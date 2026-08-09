import { layoutTree } from "../bstUtils";

const SPACING_X = 76;
const SPACING_Y = 92;
const RADIUS = 22;
const PAD = 40;

export default function TreeView({ root, activeId }) {
  const positions = layoutTree(root);
  const byId = Object.fromEntries(positions.map((p) => [p.id, p]));

  const maxX = Math.max(0, ...positions.map((p) => p.x));
  const maxY = Math.max(0, ...positions.map((p) => p.y));
  const width = (maxX + 1) * SPACING_X + PAD * 2;
  const height = (maxY + 1) * SPACING_Y + PAD * 2;

  const center = (p) => ({
    cx: p.x * SPACING_X + SPACING_X / 2 + PAD,
    cy: p.y * SPACING_Y + SPACING_Y / 2 + PAD,
  });

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {positions.map((p) => {
          if (!p.parentId) return null;
          const parent = byId[p.parentId];
          const a = center(parent);
          const b = center(p);
          return (
            <line
              key={`e-${p.id}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              className="stroke-line-strong"
              strokeWidth={1.5}
            />
          );
        })}

        {positions.map((p) => {
          const { cx, cy } = center(p);
          const active = p.id === activeId;
          return (
            <g key={p.id}>
              <circle
                cx={cx}
                cy={cy}
                r={RADIUS}
                className={[
                  "transition-all duration-300",
                  active ? "fill-accent-bg stroke-accent" : "fill-surface-alt stroke-line-strong",
                ].join(" ")}
                strokeWidth={active ? 2 : 1.5}
                style={
                  active
                    ? { filter: "drop-shadow(0 0 6px rgb(var(--color-accent) / 0.5))" }
                    : undefined
                }
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={["text-[13px] tabular-nums font-medium", active ? "fill-accent" : "fill-ink"].join(
                  " "
                )}
              >
                {p.value}
              </text>
              <text
                x={cx}
                y={cy + RADIUS + 14}
                textAnchor="middle"
                className="text-[9px] fill-ink-faint"
              >
                {p.address}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
