import { fetchRecent311Complaints } from "./nyc311Service.js";
import { classifyComplaint, getCategoryNames } from "../utils/classifier.js";
import { sampleReports } from "../utils/sampleReports.js";
import {
  getReports,
  getStats,
  upsertConspiracyReports,
} from "../db/queries.js";

const DEFAULT_LIMIT = 100;
const numericEnv = (value, fallback) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};
const LIVE_FETCH_LIMIT = numericEnv(process.env.NYC_311_TARGET_RECORDS, 10000);
const LIVE_CACHE_TTL_MS = numericEnv(
  process.env.LIVE_CACHE_TTL_MS,
  1000 * 60 * 5,
);
const STATS_CACHE_TTL_MS = numericEnv(
  process.env.STATS_CACHE_TTL_MS,
  1000 * 60 * 5,
);
const liveReportCache = new Map();
const statsCache = { createdAt: 0, payload: null };

function normalizeReport(report) {
  return {
    unique_key: report.unique_key,
    created_date: report.created_date,
    borough: report.borough || "UNKNOWN",
    complaint_type: report.complaint_type || "Unspecified Complaint",
    descriptor: report.descriptor || "No descriptor supplied by NYC 311.",
    latitude: report.latitude ? Number(report.latitude) : null,
    longitude: report.longitude ? Number(report.longitude) : null,
  };
}

function applyFallbackFilters(reports, filters = {}) {
  const {
    category,
    borough,
    search,
    minScore = 1,
    limit = DEFAULT_LIMIT,
  } = filters;
  const requestedCategory = category?.toUpperCase();

  return reports
    .filter((report) => {
      const reportCategories = report.conspiracy_categories?.length
        ? report.conspiracy_categories
        : [report.conspiracy_category];
      const matchesCategory = requestedCategory
        ? reportCategories.includes(requestedCategory)
        : true;
      const matchesBorough = borough
        ? report.borough === borough.toUpperCase()
        : true;
      const matchesScore = report.conspiracy_score >= Number(minScore);
      const haystack =
        `${report.complaint_type} ${report.descriptor} ${report.borough} ${reportCategories.join(" ")} ${(report.matched_keywords || []).join(" ")}`.toLowerCase();
      const matchesSearch = search
        ? haystack.includes(search.toLowerCase())
        : true;

      return matchesCategory && matchesBorough && matchesScore && matchesSearch;
    })
    .sort((a, b) => {
      const scoreDiff = b.conspiracy_score - a.conspiracy_score;
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.created_date) - new Date(a.created_date);
    })
    .slice(0, Number(limit));
}

function buildFallbackStats(reports = sampleReports) {
  const byCategory = Object.values(
    reports.reduce((groups, report) => {
      const reportCategories = report.conspiracy_categories?.length
        ? report.conspiracy_categories
        : [report.conspiracy_category];

      for (const category of reportCategories) {
        groups[category] ||= {
          name: category,
          value: 0,
        };
        groups[category].value += 1;
      }

      return groups;
    }, {}),
  );

  const byBorough = Object.values(
    reports.reduce((groups, report) => {
      groups[report.borough] ||= {
        name: report.borough,
        reports: 0,
        totalScore: 0,
      };
      groups[report.borough].reports += 1;
      groups[report.borough].totalScore += report.conspiracy_score;
      return groups;
    }, {}),
  ).map((borough) => ({
    name: borough.name,
    reports: borough.reports,
    intensity: Math.round(borough.totalScore / borough.reports),
  }));

  const trend = Object.values(
    reports.reduce((groups, report) => {
      const reportDay = new Date(report.created_date);
      const date = reportDay.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      groups[date] ||= {
        date,
        sortDate: new Date(
          reportDay.getFullYear(),
          reportDay.getMonth(),
          reportDay.getDate(),
        ).getTime(),
        reports: 0,
        totalScore: 0,
      };
      groups[date].reports += 1;
      groups[date].totalScore += report.conspiracy_score;
      return groups;
    }, {}),
  )
    .map((day) => ({
      date: day.date,
      sortDate: day.sortDate,
      reports: day.reports,
      intensity: Math.round(day.totalScore / day.reports),
    }))
    .sort((a, b) => a.sortDate - b.sortDate)
    .map(({ sortDate, ...day }) => day);

  const topBorough = byBorough
    .slice()
    .sort((a, b) => b.reports - a.reports)[0]?.name;

  return {
    summary: {
      total_reports: reports.length,
      conspiracy_reports: reports.length,
      active_categories: byCategory.length,
      top_borough: topBorough || "UNKNOWN",
    },
    byCategory,
    byBorough,
    trend,
  };
}

export function cleanAndClassifyComplaints(complaints) {
  return complaints
    .map(normalizeReport)
    .map((report) => {
      const classification = classifyComplaint(report);

      if (!classification) {
        return null;
      }

      return {
        ...report,
        conspiracy_category: classification.conspiracy_category,
        conspiracy_categories: classification.conspiracy_categories,
        conspiracy_score: classification.conspiracy_score,
        matched_keywords: classification.matched_keywords,
        classification_details: classification.classification_details,
      };
    })
    .filter(Boolean);
}

export async function fetchClassifiedLiveReports(filters = {}) {
  const cacheKey = filters.borough
    ? `borough:${filters.borough.toUpperCase()}`
    : "all";
  const cached = liveReportCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < LIVE_CACHE_TTL_MS) {
    return cached.reports;
  }

  const liveComplaints = await fetchRecent311Complaints({
    limit: LIVE_FETCH_LIMIT,
    borough: filters.borough,
  });
  const classifiedReports = cleanAndClassifyComplaints(liveComplaints);

  liveReportCache.set(cacheKey, {
    createdAt: Date.now(),
    reports: classifiedReports,
  });

  return classifiedReports;
}

export async function syncLiveReports(filters = {}) {
  const classifiedReports = await fetchClassifiedLiveReports(filters);

  if (classifiedReports.length) {
    await upsertConspiracyReports(classifiedReports);
  }

  return classifiedReports.length;
}

export async function listReports(filters = {}) {
  const normalizedFilters = {
    ...filters,
    limit: filters.limit || DEFAULT_LIMIT,
  };

  try {
    const liveReports = await fetchClassifiedLiveReports(normalizedFilters);

    let dbReports = [];
    try {
      if (liveReports.length) {
        await upsertConspiracyReports(liveReports);
      }
      dbReports = await getReports(normalizedFilters);
    } catch (databaseError) {
      console.warn(
        "Serving live reports without PostgreSQL:",
        databaseError.message,
      );
    }

    if (dbReports.length) {
      return dbReports;
    }

    return applyFallbackFilters(
      liveReports.length ? liveReports : sampleReports,
      normalizedFilters,
    );
  } catch (error) {
    console.warn("Using fallback reports:", error.message);
    return applyFallbackFilters(sampleReports, normalizedFilters);
  }
}

export async function categoryReports(category, query = {}) {
  return listReports({
    ...query,
    category,
  });
}

export async function boroughReports(borough, query = {}) {
  return listReports({
    ...query,
    borough,
  });
}

export async function searchReports(search, query = {}) {
  return listReports({
    ...query,
    search,
  });
}

export async function statsSummary() {
  const now = Date.now();

  if (statsCache.payload && now - statsCache.createdAt < STATS_CACHE_TTL_MS) {
    return statsCache.payload;
  }

  try {
    const liveReports = await fetchClassifiedLiveReports();

    try {
      if (liveReports.length) {
        await upsertConspiracyReports(liveReports);
      }

      const payload = await getStats();
      statsCache.payload = payload;
      statsCache.createdAt = Date.now();
      return payload;
    } catch (databaseError) {
      console.warn(
        "Serving live stats without PostgreSQL:",
        databaseError.message,
      );
      const fallback = buildFallbackStats(
        liveReports.length ? liveReports : sampleReports,
      );
      statsCache.payload = fallback;
      statsCache.createdAt = Date.now();
      return fallback;
    }
  } catch (error) {
    console.warn("Using fallback stats:", error.message);
    const fallback = buildFallbackStats(sampleReports);
    statsCache.payload = fallback;
    statsCache.createdAt = Date.now();
    return fallback;
  }
}

export async function mapData(query = {}) {
  const reports = await listReports({
    ...query,
    limit: query.limit || 500,
  });

  const mappedReports = reports
    .filter((report) => report.latitude && report.longitude)
    .map((report) => ({
      unique_key: report.unique_key,
      created_date: report.created_date,
      borough: report.borough,
      complaint_type: report.complaint_type,
      descriptor: report.descriptor,
      latitude: report.latitude,
      longitude: report.longitude,
      conspiracy_category: report.conspiracy_category,
      conspiracy_categories: report.conspiracy_categories,
      conspiracy_score: report.conspiracy_score,
      matched_keywords: report.matched_keywords,
    }));

  const dangerZones = [
    {
      id: "zone-midtown-surveillance",
      label: "Midtown Listening Grid",
      category: "SURVEILLANCE",
      center: [40.7549, -73.984],
      radius: 1600,
      intensity: 81,
    },
    {
      id: "zone-brooklyn-frequency",
      label: "Brooklyn Frequency Bloom",
      category: "NOISE PHENOMENA",
      center: [40.6782, -73.9442],
      radius: 2100,
      intensity: 74,
    },
    {
      id: "zone-queens-underground",
      label: "Queens Subsurface Echo",
      category: "UNDERGROUND CONSPIRACY",
      center: [40.7282, -73.7949],
      radius: 2400,
      intensity: 89,
    },
  ];

  return {
    reports: mappedReports,
    dangerZones,
  };
}

export function availableCategories() {
  return getCategoryNames();
}
