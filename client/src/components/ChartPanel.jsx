import ClassifiedStamp from './ClassifiedStamp';

export default function ChartPanel({ title, eyebrow = 'EVIDENCE', children, action }) {
  return (
    <section className="chart-panel relative rounded-[6px] border border-paper/10 bg-gunmetal/70 p-4 shadow-evidence">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
          <h2 className="mt-1 font-display text-3xl text-aged">{title}</h2>
        </div>
        {action || <ClassifiedStamp tone="green">EVIDENCE</ClassifiedStamp>}
      </div>
      {children}
    </section>
  );
}
