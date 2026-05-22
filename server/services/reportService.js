import { fetchRecent311Complaints } from './nyc311Service.js';
import { classifyComplaint, getCategoryNames } from '../utils/classifier.js';
import { sampleReports } from '../utils/sampleReports.js';
import {
  getReports,
  getStats,
  upsertConspiracyReports
} from '../db/queries.js';

const DEFAULT_LIMIT = 80;
const LIVE_FETCH_LIMIT = 700;

function normalizeReport(report) {
  return {
    unique_key: report.unique_key,
    created_date: report.created_date,
    borough: report.borough || 'UNKNOWN',
    complaint_type: report.complaint_type || 'Unspecified Complaint',
    descriptor: report.descriptor || 'No descriptor supplied by NYC 311.',
    latitude: report.latitude ? Number(report.latitude) : null,
    longitude: report.longitude ? Number(report.longitude) : null
  };
}

function applyFallbackFilters(reports, filters = {}) {
  const { category, borough, search, minScore = 1, limit = DEFAULT_LIMIT } = filters;

  return reports
    .filter((report) => {
      const matchesCategory = category
        ? report.conspiracy_category === category.toUpperCase()
        : true;
      const matchesBorough = borough ? report.borough === borough.toUpperCase() : true;
      const matchesScore = report.conspiracy_score >= Number(minScore);
      const haystack = `${report.complaint_type} ${report.descriptor} ${report.borough} ${report.conspiracy_category}`.toLowerCase();
      const matchesSearch = search ? haystack.includes(search.toLowerCase()) : true;

      return matchesCategory && matchesBorough && matchesScore && matchesSearch;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, Number(limit));
}

function buildFallbackStats(reports = sampleReports) {
  const byCategory = Object.values(
    reports.reduce((groups, report) => {
      groups[report.conspiracy_category] ||= {
        name: report.conspiracy_category,
        value: 0
      };
      groups[report.conspiracy_category].value += 1;
      return groups;
    }, {})
  );

  const byBorough = Object.values(
    reports.reduce((groups, report) => {
      groups[report.borough] ||= {
        name: report.borough,
        reports: 0,
        totalScore: 0
      };
      groups[report.borough].reports += 1;
      groups[report.borough].totalScore += report.conspiracy_score;
      return groups;
    }, {})
  ).map((borough) => ({
    name: borough.name,
    reports: borough.reports,
    intensity: Math.round(borough.totalScore / borough.reports)
  }));

  const trend = reports
    .slice()
    .reverse()
    .map((report) => ({
      date: new Date(report.created_date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      }),
      reports: 1,
      intensity: report.conspiracy_score
    }));

  const topBorough = byBorough.slice().sort((a, b) => b.reports - a.reports)[0]?.name;

  return {
    summary: {
      total_reports: reports.length,
      conspiracy_reports: reports.length,
      active_categories: byCategory.length,
      top_borough: topBorough || 'UNKNOWN'
    },
    byCategory,
    byBorough,
    trend
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
        conspiracy_score: classification.conspiracy_score
      };
    })
    .filter(Boolean);
}

export async function fetchClassifiedLiveReports(filters = {}) {
  const liveComplaints = await fetchRecent311Complaints({
    limit: LIVE_FETCH_LIMIT,
    borough: filters.borough
  });

  return cleanAndClassifyComplaints(liveComplaints);
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
    limit: filters.limit || DEFAULT_LIMIT
  };

  try {
    const liveReports = await fetchClassifiedLiveReports(normalizedFilters);

    try {
      if (liveReports.length) {
        await upsertConspiracyReports(liveReports);
      }

      return await getReports(normalizedFilters);
    } catch (databaseError) {
      console.warn('Serving live reports without PostgreSQL:', databaseError.message);
      return applyFallbackFilters(
        liveReports.length ? liveReports : sampleReports,
        normalizedFilters
      );
    }
  } catch (error) {
    console.warn('Using fallback reports:', error.message);
    return applyFallbackFilters(sampleReports, normalizedFilters);
  }
}

export async function categoryReports(category, query = {}) {
  return listReports({
    ...query,
    category
  });
}

export async function boroughReports(borough, query = {}) {
  return listReports({
    ...query,
    borough
  });
}

export async function searchReports(search, query = {}) {
  return listReports({
    ...query,
    search
  });
}

export async function statsSummary() {
  try {
    const liveReports = await fetchClassifiedLiveReports();

    try {
      if (liveReports.length) {
        await upsertConspiracyReports(liveReports);
      }

      return await getStats();
    } catch (databaseError) {
      console.warn('Serving live stats without PostgreSQL:', databaseError.message);
      return buildFallbackStats(liveReports.length ? liveReports : sampleReports);
    }
  } catch (error) {
    console.warn('Using fallback stats:', error.message);
    return buildFallbackStats(sampleReports);
  }
}

export async function mapData(query = {}) {
  const reports = await listReports({
    ...query,
    limit: query.limit || 250
  });

  const dangerZones = [
    {
      id: 'zone-midtown-surveillance',
      label: 'Midtown Listening Grid',
      category: 'SURVEILLANCE',
      center: [40.7549, -73.984],
      radius: 1600,
      intensity: 81
    },
    {
      id: 'zone-brooklyn-frequency',
      label: 'Brooklyn Frequency Bloom',
      category: 'NOISE PHENOMENA',
      center: [40.6782, -73.9442],
      radius: 2100,
      intensity: 74
    },
    {
      id: 'zone-queens-underground',
      label: 'Queens Subsurface Echo',
      category: 'UNDERGROUND CONSPIRACY',
      center: [40.7282, -73.7949],
      radius: 2400,
      intensity: 89
    }
  ];

  return {
    reports: reports.filter((report) => report.latitude && report.longitude),
    dangerZones
  };
}

export function availableCategories() {
  return getCategoryNames();
}
