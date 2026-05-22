import { Filter, Search } from 'lucide-react';
import { boroughs, categories } from '../utils/categories';

export default function FilterBar({ filters, onChange }) {
  function patchFilter(key, value) {
    onChange({
      ...filters,
      [key]: value || undefined
    });
  }

  return (
    <section className="rounded-[6px] border border-paper/10 bg-black/35 p-4 shadow-terminal">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <label className="terminal-input flex items-center gap-2 px-3 py-2">
          <Search size={16} className="text-surveillance" />
          <input
            value={filters.q || ''}
            onChange={(event) => patchFilter('q', event.target.value)}
            placeholder="SEARCH INCIDENT TEXT"
            className="w-full bg-transparent font-body text-sm uppercase tracking-[0.12em] text-aged outline-none placeholder:text-muted"
          />
        </label>

        <label className="terminal-select">
          <Filter size={15} />
          <select
            value={filters.borough || ''}
            onChange={(event) => patchFilter('borough', event.target.value)}
          >
            <option value="">ALL BOROUGHS</option>
            {boroughs.map((borough) => (
              <option key={borough} value={borough}>
                {borough}
              </option>
            ))}
          </select>
        </label>

        <label className="terminal-select">
          <Filter size={15} />
          <select
            value={filters.category || ''}
            onChange={(event) => patchFilter('category', event.target.value)}
          >
            <option value="">ALL CATEGORIES</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="terminal-input flex items-center gap-3 px-3 py-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">Score</span>
          <input
            type="range"
            min="1"
            max="100"
            value={filters.minScore || 1}
            onChange={(event) => patchFilter('minScore', event.target.value)}
            className="w-full accent-crimson"
          />
          <span className="w-8 text-right font-display text-2xl text-surveillance">
            {filters.minScore || 1}
          </span>
        </label>
      </div>
    </section>
  );
}
