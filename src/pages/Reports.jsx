import { useState } from "react";
import EmptyState from "../components/EmptyState";
import EvidenceCard from "../components/EvidenceCard";
import FilterBar from "../components/FilterBar";
import LoadingState from "../components/LoadingState";
import { useAnomalies } from "../hooks/useAnomalies";

export default function Reports() {
  const [filters, setFilters] = useState({ minScore: 1 });
  const { anomalies, loading } = useAnomalies({
    borough: filters.borough,
    category: filters.category,
    search: filters.search,
    minScore: filters.minScore,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 border-b border-paper/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.28em] text-crimson">
            Live Anomaly Feed
          </p>
          <h2 className="mt-2 font-display text-6xl leading-none text-aged">
            Classified Case Files
          </h2>
          <p className="mt-3 max-w-2xl font-marker text-xl text-paper">
            Classified from live NYC 311 data via the Socrata Open Data API.
          </p>
        </div>
        <div className="classified-panel inline-flex flex-col items-end gap-1 px-4 py-2">
          <p className="font-display text-4xl text-crimson">{anomalies.length}</p>
          <p className="text-xs uppercase tracking-widest text-muted">Active Reports</p>
        </div>
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingState />
      ) : anomalies.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {anomalies.map((report) => (
            <EvidenceCard key={report.unique_key} report={report} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
