import { memo } from "react";
import { Filter, Search } from "lucide-react";
import { boroughs, categories } from "../utils/categories";

function FilterBar({ filters, onChange }) {
  function patch(key, value) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <section className="rounded-[6px] border border-paper/10 bg-black/35 p-4 shadow-terminal">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <label className="terminal-input flex items-center gap-2 px-3 py-2">
          <Search size={16} className="text-surveillance" />
          <input
            value={filters.search || ""}
            onChange={(e) => patch("search", e.target.value)}
            placeholder="SEARCH INCIDENT TEXT"
            className="w-full bg-transparent font-body text-sm uppercase tracking-[0.12em] text-aged outline-none placeholder:text-muted"
          />
        </label>

        <label className="terminal-select">
          <Filter size={15} />
          <select
            value={filters.borough || ""}
            onChange={(e) => patch("borough", e.target.value)}
          >
            <option value="">ALL BOROUGHS</option>
            {boroughs.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>

        <label className="terminal-select">
          <Filter size={15} />
          <select
            value={filters.category || ""}
            onChange={(e) => patch("category", e.target.value)}
          >
            <option value="">ALL CATEGORIES</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="terminal-input flex flex-col gap-2 rounded-[6px] border border-paper/10 bg-charcoal/30 p-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
              Threshold
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={filters.minScore || 1}
            onChange={(e) => patch("minScore", Number(e.target.value))}
            className="w-full accent-crimson"
          />
          <span className="text-right font-display text-2xl text-surveillance">
            {filters.minScore || 1}
          </span>
        </label>
      </div>
    </section>
  );
}

export default memo(FilterBar);
