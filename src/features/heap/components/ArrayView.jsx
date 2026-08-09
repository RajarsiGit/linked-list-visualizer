export default function ArrayView({ nodes, activeIds }) {
  return (
    <div className="flex flex-wrap gap-2 pb-6 mb-6 border-b border-line">
      {nodes.map((n, i) => {
        const active = activeIds.includes(n.id);
        return (
          <div key={n.id} className="shrink-0">
            <div className="text-[9px] text-ink-faint text-center mb-1">[{i}]</div>
            <div
              className={[
                "flex items-center justify-center min-w-[44px] px-2 py-2 rounded border text-sm tabular-nums font-medium transition-all duration-300",
                active
                  ? "border-accent bg-accent-bg text-accent shadow-[0_0_0_1px_rgb(var(--color-accent)/0.3),0_0_12px_rgb(var(--color-accent)/0.15)]"
                  : "border-line-strong bg-surface-alt text-ink",
              ].join(" ")}
            >
              {n.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
