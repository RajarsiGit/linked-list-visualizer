export default function EntryBlock({ entry, active }) {
  return (
    <div className="shrink-0">
      <div
        className={[
          "flex items-center gap-2 rounded border px-3 py-2 transition-all duration-300",
          active
            ? "border-accent bg-accent-bg shadow-[0_0_0_1px_rgb(var(--color-accent)/0.3),0_0_16px_rgb(var(--color-accent)/0.15)]"
            : "border-line-strong bg-surface-alt hover:border-line-hover",
        ].join(" ")}
      >
        <span className={active ? "text-accent text-xs" : "text-ink-mute text-xs"}>
          {entry.key}
        </span>
        <span className="text-ink-faint text-xs">:</span>
        <span className={["text-sm font-medium tabular-nums", active ? "text-accent" : "text-ink"].join(" ")}>
          {entry.value}
        </span>
      </div>
      <div className="text-[9px] text-ink-faint mt-1 text-center">{entry.address}</div>
    </div>
  );
}
