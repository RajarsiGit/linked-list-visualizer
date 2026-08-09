export default function BarChart({ values, status }) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-1.5 h-[260px]">
      {values.map((v, i) => {
        const s = status[i];
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <span
              className={[
                "text-[10px] mb-1 tabular-nums",
                s === "active" ? "text-accent" : "text-ink-faint",
              ].join(" ")}
            >
              {v}
            </span>
            <div
              className={[
                "w-full rounded-t transition-all duration-200 border-t",
                s === "active"
                  ? "bg-accent-bg border-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.25)]"
                  : s === "sorted"
                  ? "bg-accent/20 border-accent/40"
                  : "bg-surface-alt border-line-strong",
              ].join(" ")}
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
