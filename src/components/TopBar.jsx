import { RefreshCcw, Siren } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-[9.6rem] z-20 border-b border-paper/10 bg-matte/82 px-4 py-3 backdrop-blur sm:top-[8.75rem] sm:px-6 lg:top-0 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-crimson">
            <Siren size={18} />
            <span className="font-body text-xs uppercase tracking-[0.32em]">
              Classified NYC 311 Intelligence
            </span>
          </div>
          <p className="mt-1 font-display text-3xl text-aged sm:text-4xl">
            The city keeps calling. The pattern answers.
          </p>
        </div>
        <button
          className="distressed-button inline-flex h-11 w-11 items-center justify-center rounded-[6px] border-crimson/50 text-crimson hover:text-aged"
          type="button"
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw size={18} />
        </button>
      </div>
    </header>
  );
}
