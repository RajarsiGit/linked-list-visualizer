export default function StatsBar({ nodeCount, traversing }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-ink-mute">
      <Stat label="length" value={nodeCount} />
      <Stat label="status" value={traversing ? "traversing" : "idle"} highlight={traversing} />
      <Stat label="type" value="singly-linked" />
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="uppercase tracking-wide">{label}:</span>
      <span className={highlight ? "text-accent" : "text-ink-dim"}>{value}</span>
    </div>
  );
}
