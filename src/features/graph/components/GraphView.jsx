import { NODES, EDGES, edgeKey } from "../graphData";

const RADIUS = 22;
const PAD = 40;

export default function GraphView({ status, parent, distances, activeId, startId }) {
  const width = Math.max(...NODES.map((n) => n.x)) + PAD * 2;
  const height = Math.max(...NODES.map((n) => n.y)) + PAD * 2;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const treeEdgeKeys = new Set(
    Object.entries(parent).map(([to, from]) => edgeKey(from, to))
  );

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {EDGES.map(([a, b, w]) => {
          const na = byId[a];
          const nb = byId[b];
          const isTree = treeEdgeKeys.has(edgeKey(a, b));
          const mx = (na.x + nb.x) / 2 + PAD;
          const my = (na.y + nb.y) / 2 + PAD;
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={na.x + PAD}
                y1={na.y + PAD}
                x2={nb.x + PAD}
                y2={nb.y + PAD}
                className={isTree ? "stroke-accent" : "stroke-line-strong"}
                strokeWidth={isTree ? 2.5 : 1.5}
              />
              <rect
                x={mx - 9}
                y={my - 8}
                width={18}
                height={14}
                className="fill-surface"
              />
              <text
                x={mx}
                y={my + 3}
                textAnchor="middle"
                className="text-[9px] fill-ink-faint"
              >
                {w}
              </text>
            </g>
          );
        })}

        {NODES.map((n) => {
          const s = status[n.id] || "default";
          const active = activeId === n.id;
          const isStart = n.id === startId;
          const dist = distances[n.id];
          return (
            <g key={n.id}>
              <circle
                cx={n.x + PAD}
                cy={n.y + PAD}
                r={RADIUS}
                className={[
                  "transition-all duration-300",
                  active
                    ? "fill-accent-bg stroke-accent"
                    : s === "visited"
                    ? "fill-accent/20 stroke-accent/50"
                    : "fill-surface-alt stroke-line-strong",
                ].join(" ")}
                strokeWidth={active || isStart ? 2.5 : 1.5}
                strokeDasharray={isStart && !active ? "3 2" : undefined}
                style={
                  active
                    ? { filter: "drop-shadow(0 0 6px rgb(var(--color-accent) / 0.5))" }
                    : undefined
                }
              />
              <text
                x={n.x + PAD}
                y={n.y + PAD + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={["text-[13px] font-medium", active || s === "visited" ? "fill-accent" : "fill-ink"].join(
                  " "
                )}
              >
                {n.id}
              </text>
              {dist !== undefined && (
                <text
                  x={n.x + PAD}
                  y={n.y + PAD + RADIUS + 14}
                  textAnchor="middle"
                  className="text-[9px] fill-ink-faint"
                >
                  dist={dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
