// stats: [{ label, value, highlight? }]
export default function StatsBar({ stats }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-ink-mute">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <span className="uppercase tracking-wide">{s.label}:</span>
          <span className={s.highlight ? "text-accent" : "text-ink-dim"}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}
