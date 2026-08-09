import { useState } from "react";
import Button from "../../../components/Button";

const ORDERS = [
  { key: "inorder", label: "in_order" },
  { key: "preorder", label: "pre_order" },
  { key: "postorder", label: "post_order" },
  { key: "levelorder", label: "level_order" },
];

export default function ControlPanel({
  onInsert,
  onSearch,
  onDelete,
  onTraverse,
  onStopTraverse,
  onClear,
  busy,
  traversing,
}) {
  const [value, setValue] = useState("");

  const parsed = () => {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  };

  const run = (fn) => () => {
    const v = parsed();
    if (v === null) return;
    fn(v);
    setValue("");
  };

  return (
    <div className="mt-4 rounded border border-line bg-surface p-4">
      <div className="text-[11px] tracking-[0.15em] text-ink-mute uppercase mb-3">
        commands
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(onInsert)()}
          placeholder="value"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />

        <Button onClick={run(onInsert)} disabled={busy}>
          insert
        </Button>
        <Button onClick={run(onSearch)} accent disabled={busy}>
          search
        </Button>
        <Button onClick={run(onDelete)} danger disabled={busy}>
          delete
        </Button>

        <div className="w-px h-6 bg-line mx-1" />

        <Button onClick={onClear} danger disabled={busy}>
          clear
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-line">
        <span className="text-[10px] text-ink-mute uppercase tracking-wide mr-1">
          traverse:
        </span>
        {ORDERS.map((o) => (
          <Button
            key={o.key}
            onClick={() => onTraverse(o.key)}
            disabled={busy && !traversing}
          >
            {o.label}
          </Button>
        ))}
        {traversing && (
          <Button onClick={onStopTraverse} danger>
            stop
          </Button>
        )}
      </div>
    </div>
  );
}
