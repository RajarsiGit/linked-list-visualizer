export default function QueueSlot({ item, active }) {
  return (
    <div className="shrink-0">
      <div
        className={[
          "flex flex-col justify-center items-center px-4 py-3 min-w-[64px] rounded border transition-all duration-300",
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
          {item.value}
        </span>
      </div>
      <div className="text-[9px] text-ink-faint mt-1 text-center">{item.address}</div>
    </div>
  );
}
