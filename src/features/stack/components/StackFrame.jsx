export default function StackFrame({ frame, isTop, active }) {
  return (
    <div className="relative shrink-0 w-40">
      {isTop && (
        <div className="absolute -top-6 left-0 right-0 flex flex-col items-center">
          <span className="text-[10px] text-accent tracking-widest uppercase">top</span>
          <span className="text-accent text-sm leading-none">↓</span>
        </div>
      )}

      <div
        className={[
          "flex items-center justify-between rounded border px-4 py-3 transition-all duration-300",
          active
            ? "border-accent bg-accent-bg shadow-[0_0_0_1px_rgb(var(--color-accent)/0.3),0_0_16px_rgb(var(--color-accent)/0.15)]"
            : "border-line-strong bg-surface-alt hover:border-line-hover",
        ].join(" ")}
      >
        <span className="text-[9px] text-ink-mute uppercase tracking-wide">data</span>
        <span
          className={[
            "text-base font-medium tabular-nums",
            active ? "text-accent" : "text-ink",
          ].join(" ")}
        >
          {frame.value}
        </span>
      </div>
      <div className="text-[9px] text-ink-faint mt-1 text-center">{frame.address}</div>
    </div>
  );
}
