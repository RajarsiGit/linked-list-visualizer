export default function NodeBlock({ node, index, active, onDelete, disabled }) {
  return (
    <div className="group relative shrink-0">
      <div className="absolute -top-5 left-0 text-[10px] text-ink-faint">
        [{index}]
      </div>

      <div
        className={[
          "flex rounded border overflow-hidden transition-all duration-300",
          active
            ? "border-accent shadow-[0_0_0_1px_rgb(var(--color-accent)/0.3),0_0_16px_rgb(var(--color-accent)/0.15)]"
            : "border-line-strong hover:border-line-hover",
        ].join(" ")}
      >
        <div
          className={[
            "flex flex-col justify-center items-center px-4 py-3 min-w-[64px] border-r transition-colors duration-300",
            active ? "bg-accent-bg border-accent/40" : "bg-surface-alt border-line-strong",
          ].join(" ")}
        >
          <span className="text-[9px] text-ink-mute uppercase tracking-wide">data</span>
          <span
            className={[
              "text-base font-medium tabular-nums",
              active ? "text-accent" : "text-ink",
            ].join(" ")}
          >
            {node.value}
          </span>
        </div>

        <div className="flex flex-col justify-center items-center px-3 py-3 min-w-[56px] bg-surface relative">
          <span className="text-[9px] text-ink-mute uppercase tracking-wide">next</span>
          <span className="text-ink-mute text-xs">●→</span>
        </div>

        <button
          onClick={onDelete}
          disabled={disabled}
          aria-label={`Delete node ${node.value}`}
          className="px-2 flex items-center justify-center bg-danger-bg text-danger-dim hover:bg-danger-bg-hover hover:text-danger transition-colors border-l border-line-strong opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
        >
          ✕
        </button>
      </div>

      <div className="text-[9px] text-ink-faint mt-1 text-center">{node.address}</div>
    </div>
  );
}
