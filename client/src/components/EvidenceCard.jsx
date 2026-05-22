import { MapPin, Radio, Timer } from 'lucide-react';
import ClassifiedStamp from './ClassifiedStamp';
import { formatDate } from '../utils/formatters';
import { getCategoryColor } from '../utils/categories';

export default function EvidenceCard({ report, compact = false }) {
  const color = getCategoryColor(report.conspiracy_category);

  return (
    <article className="case-file evidence-card relative overflow-hidden rounded-[6px] p-4 transition duration-300 hover:-translate-y-1">
      <span className="masking-tape tape-left" />
      <span className="push-pin" style={{ backgroundColor: color }} />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <ClassifiedStamp>{report.conspiracy_category}</ClassifiedStamp>
          <div
            className="score-dial"
            style={{ '--score-color': color, '--score': report.conspiracy_score }}
          >
            <span>{report.conspiracy_score}</span>
          </div>
        </div>

        <p className="font-body text-sm leading-6 text-aged/90">
          {report.descriptor || report.complaint_type || 'Descriptor unavailable.'}
        </p>

        {!compact ? (
          <div className="grid gap-2 border-t border-paper/10 pt-3 text-xs uppercase tracking-[0.18em] text-muted sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <MapPin size={14} style={{ color }} />
              {report.borough || 'UNKNOWN'}
            </span>
            <span className="flex items-center gap-2">
              <Timer size={14} style={{ color }} />
              {formatDate(report.created_date)}
            </span>
            <span className="flex items-center gap-2">
              <Radio size={14} style={{ color }} />
              {report.complaint_type || '311 REPORT'}
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
