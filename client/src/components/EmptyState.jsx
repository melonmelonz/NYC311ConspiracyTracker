import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-[6px] border border-paper/10 bg-black/35 p-8 text-center">
      <SearchX className="mx-auto mb-3 text-crimson" size={32} />
      <p className="font-display text-3xl text-aged">NO ACTIVE FILES</p>
      <p className="mt-2 text-sm text-muted">
        Signal filters may be too narrow. Try lowering the conspiracy threshold
        or expanding the search.
      </p>
    </div>
  );
}
