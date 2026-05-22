import { memo, useMemo } from "react";
import { MapPin, Radio, Timer } from "lucide-react";
import ClassifiedStamp from "./ClassifiedStamp";
import { formatDate } from "../utils/formatters";
import { getCategoryColor } from "../utils/categories";

function EvidenceCard({ report, compact = false }) {
  const categories = useMemo(
    () =>
      report.conspiracy_categories?.length
        ? report.conspiracy_categories
        : [report.conspiracy_category],
    [report.conspiracy_categories, report.conspiracy_category]
  );
  const primaryCategory = categories[0] || report.conspiracy_category;
  const color = getCategoryColor(primaryCategory);

  return (
    <article className="case-file evidence-card relative overflow-hidden rounded-[6px] p-4 transition duration-300 hover:-translate-y-1">
      <span className="masking-tape tape-left" />
      <span className="push-pin" style={{ backgroundColor: color }} />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <ClassifiedStamp>{primaryCategory}</ClassifiedStamp>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(1, 3).map((cat) => (
                  <span key={cat} className="category-chip">{cat}</span>
                ))}
              </div>
            )}
          </div>
          <div
            className="score-dial"
            style={{ "--score-color": color, "--score": report.conspiracy_score }}
          >
            <span>{report.conspiracy_score}</span>
          </div>
        </div>

        <p className="font-body text-sm leading-6 text-aged/90">
          {report.descriptor || report.complaint_type || "Descriptor unavailable."}
        </p>

        {report.matched_keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {report.matched_keywords.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="rounded bg-crimson/10 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-crimson/80"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {!compact ? (
          <div className="grid gap-2 border-t border-paper/10 pt-3 text-xs uppercase tracking-[0.18em] text-muted sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <MapPin size={14} style={{ color }} />
              {report.borough || "UNKNOWN"}
            </span>
            <span className="flex items-center gap-2">
              <Timer size={14} style={{ color }} />
              {formatDate(report.created_date)}
            </span>
            <span className="flex items-center gap-2">
              <Radio size={14} style={{ color }} />
              {report.complaint_type || "311 REPORT"}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted">
            <span>{report.borough}</span>
            <span>{formatDate(report.created_date)}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(EvidenceCard);
