export default function LoadingState({ label = 'DECODING LIVE 311 SIGNALS' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-[6px] border border-paper/10 bg-black/30">
      <div className="text-center">
        <span className="mx-auto mb-4 block h-4 w-4 rounded-full bg-surveillance shadow-terminal animate-pulseHotspot" />
        <p className="font-body text-xs uppercase tracking-[0.28em] text-muted">{label}</p>
      </div>
    </div>
  );
}
