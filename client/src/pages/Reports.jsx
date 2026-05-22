import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceImagePlaceholder from '../components/EvidenceImagePlaceholder';
import FilterBar from '../components/FilterBar';
import LoadingState from '../components/LoadingState';
import { useReports } from '../hooks/useReports';

export default function Reports() {
  const [filters, setFilters] = useState({ limit: 60, minScore: 1 });
  const requestFilters = useMemo(
    () => ({
      limit: filters.limit,
      minScore: filters.minScore,
      borough: filters.borough,
      category: filters.category,
      q: filters.q
    }),
    [filters]
  );
  const { reports, loading } = useReports(requestFilters);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 border-b border-paper/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.28em] text-crimson">Live Conspiracy Feed</p>
          <h2 className="mt-2 font-display text-6xl leading-none text-aged">Classified Case Files</h2>
        </div>
        <div className="font-marker text-3xl text-paper">CONFIDENTIAL</div>
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      <section className="grid gap-5 xl:grid-cols-[1fr_19rem]">
        <div>
          {loading ? (
            <LoadingState />
          ) : reports.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {reports.map((report) => (
                <EvidenceCard key={report.unique_key} report={report} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <aside className="space-y-4">
          <EvidenceImagePlaceholder label="PINNED INVESTIGATION IMAGE" />
          <EvidenceImagePlaceholder label="PROPAGANDA POSTER SLOT" />
          <div className="classified-panel">
            <p className="font-display text-4xl text-crimson">UNEXPLAINED</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {reports.length} active reports match the current filter chain.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
