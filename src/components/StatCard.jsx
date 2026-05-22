export default function StatCard({ icon: Icon, label, value, detail, accent = '#c1121f' }) {
  return (
    <article className="case-file group relative overflow-hidden rounded-[6px] p-4 shadow-evidence">
      <span className="push-pin" style={{ backgroundColor: accent }} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
          <p className="mt-2 font-display text-5xl leading-none text-aged">{value}</p>
          {detail ? <p className="mt-2 text-sm text-paper/80">{detail}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-[6px] border border-paper/10 bg-black/30 p-3" style={{ color: accent }}>
            <Icon size={24} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
