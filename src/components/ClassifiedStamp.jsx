export default function ClassifiedStamp({ children = 'CLASSIFIED', tone = 'red' }) {
  return (
    <span
      className={[
        'stamp inline-flex rotate-[-4deg] items-center rounded-[3px] border-2 px-3 py-1 font-display text-xl leading-none',
        tone === 'green'
          ? 'border-surveillance/80 text-surveillance'
          : 'border-crimson/80 text-crimson'
      ].join(' ')}
    >
      {children}
    </span>
  );
}
