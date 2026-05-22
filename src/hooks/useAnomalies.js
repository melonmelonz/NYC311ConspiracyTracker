import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNYC311Batch } from "../api/nyc311";
import { classifyComplaint } from "../utils/classifier";

// In-memory cache so navigating between pages doesn't re-fetch
let cachedAnomalies = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid() {
  return cachedAnomalies && Date.now() - cacheTimestamp < CACHE_TTL;
}

export function useAnomalies({ borough, category, search, minScore = 1, limit } = {}) {
  const [allAnomalies, setAllAnomalies] = useState(cachedAnomalies || []);
  const [loading, setLoading] = useState(!isCacheValid());
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    // Use cache if valid and no borough filter (borough filter changes the API query)
    if (isCacheValid() && !borough) {
      setAllAnomalies(cachedAnomalies);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const raw = await fetchNYC311Batch({ pages: 3, pageSize: 1000, borough });

      const classified = [];
      for (const complaint of raw) {
        const result = classifyComplaint(complaint);
        if (result) {
          classified.push({ ...complaint, ...result });
        }
      }

      // Sort by score descending
      classified.sort((a, b) => b.conspiracy_score - a.conspiracy_score);

      if (mountedRef.current) {
        setAllAnomalies(classified);
        // Only cache the full unfiltered dataset
        if (!borough) {
          cachedAnomalies = classified;
          cacheTimestamp = Date.now();
        }
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
      }
    }
  }, [borough]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  // Client-side filtering
  let filtered = allAnomalies;

  if (category) {
    filtered = filtered.filter(
      (a) => a.conspiracy_category === category || a.conspiracy_categories?.includes(category)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        (a.descriptor || "").toLowerCase().includes(q) ||
        (a.complaint_type || "").toLowerCase().includes(q) ||
        (a.matched_keywords || []).some((kw) => kw.includes(q))
    );
  }

  if (minScore > 1) {
    filtered = filtered.filter((a) => a.conspiracy_score >= minScore);
  }

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return { anomalies: filtered, allAnomalies, loading, error, refresh: load };
}

// Derived stats computed from the full anomaly dataset
export function useAnomalyStats(anomalies) {
  if (!anomalies.length) {
    return { byCategory: [], byBorough: [], trend: [], summary: {} };
  }

  const catCounts = {};
  const boroCounts = {};
  const dateCounts = {};

  for (const a of anomalies) {
    const cat = a.conspiracy_category || "ODDITY";
    catCounts[cat] = (catCounts[cat] || 0) + 1;

    const boro = a.borough || "UNKNOWN";
    if (boro !== "Unspecified" && boro !== "UNKNOWN") {
      boroCounts[boro] = (boroCounts[boro] || 0) + 1;
    }

    if (a.created_date) {
      const d = a.created_date.slice(0, 10);
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
  }

  const byCategory = Object.entries(catCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const byBorough = Object.entries(boroCounts)
    .map(([name, reports]) => ({
      name,
      reports,
      intensity: Math.round((reports / anomalies.length) * 100),
    }))
    .sort((a, b) => b.reports - a.reports);

  const trend = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, reports]) => ({ date: date.slice(5), reports }));

  const topBorough = byBorough[0]?.name || "N/A";

  return {
    byCategory,
    byBorough,
    trend,
    summary: {
      total: anomalies.length,
      categories: byCategory.length,
      topBorough,
      avgScore: Math.round(
        anomalies.reduce((s, a) => s + a.conspiracy_score, 0) / anomalies.length
      ),
    },
  };
}
