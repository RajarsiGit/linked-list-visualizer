import { Link } from "react-router-dom";

// items: { [key]: { label } }, e.g. sortAlgorithms.ALGO_INFO / graphAlgorithms.ALGO_INFO
export default function AlgoTabs({ items, current, basePath, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(items).map(([key, info]) => {
        const active = key === current;
        return (
          <Link
            key={key}
            to={disabled ? "#" : `${basePath}/${key}`}
            aria-disabled={disabled}
            className={[
              "px-3 py-1.5 rounded text-xs border transition-colors uppercase tracking-wide",
              active
                ? "border-accent/40 text-accent bg-accent-bg"
                : "border-line-strong text-ink-dim hover:bg-surface-alt hover:border-line-hover",
              disabled ? "pointer-events-none opacity-50" : "",
            ].join(" ")}
          >
            {info.label}
          </Link>
        );
      })}
    </div>
  );
}
