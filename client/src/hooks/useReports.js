import { useCallback, useEffect, useState } from 'react';
import { fetchMapData, fetchReports, fetchStats } from '../api/client';

export function useReports(initialFilters = {}) {
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const filterKey = JSON.stringify(initialFilters);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await fetchReports(initialFilters);
      setReports(payload.data || []);
      setMeta(payload.meta || {});
    } catch (requestError) {
      setError(requestError.message || 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    meta,
    loading,
    error,
    refresh: loadReports
  };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchStats()
      .then((payload) => {
        if (mounted) setStats(payload.data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading };
}

export function useMapReports(filters = {}) {
  const [payload, setPayload] = useState({ reports: [], dangerZones: [] });
  const [loading, setLoading] = useState(true);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let mounted = true;

    fetchMapData(filters)
      .then((response) => {
        if (mounted) setPayload(response.data || { reports: [], dangerZones: [] });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filterKey]);

  return { ...payload, loading };
}
