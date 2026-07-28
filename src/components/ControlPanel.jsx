import { useState } from "react";

export default function ControlPanel({
  onInsertHead,
  onInsertTail,
  onInsertAt,
  onTraverse,
  onStopTraverse,
  onClear,
  traversing,
  maxIndex,
}) {
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");

  const parsedValue = () => {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : trimmed;
  };

  const handleInsertHead = () => {
    const v = parsedValue();
    if (v === null) return;
    onInsertHead(v);
    setValue("");
  };

  const handleInsertTail = () => {
    const v = parsedValue();
    if (v === null) return;
    onInsertTail(v);
    setValue("");
  };

  const handleInsertAt = () => {
    const v = parsedValue();
    if (v === null) return;
    const i = index.trim() === "" ? maxIndex : Number(index);
    onInsertAt(v, Number.isFinite(i) ? i : maxIndex);
    setValue("");
    setIndex("");
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
          placeholder="value"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />
        <input
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder="idx"
          className="w-16 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />

        <Btn onClick={handleInsertHead}>insert_head</Btn>
        <Btn onClick={handleInsertTail}>insert_tail</Btn>
        <Btn onClick={handleInsertAt}>insert_at</Btn>

        <div className="w-px h-6 bg-line mx-1" />

        {!traversing ? (
          <Btn onClick={onTraverse} accent>traverse</Btn>
        ) : (
          <Btn onClick={onStopTraverse} danger>stop</Btn>
        )}
        <Btn onClick={onClear} danger>clear</Btn>
      </div>
    </div>
  );
}

function Btn({ children, onClick, accent, danger }) {
  const base =
    "px-3 py-1.5 rounded text-xs border transition-colors uppercase tracking-wide";
  const styles = danger
    ? "border-danger-border text-danger hover:bg-danger-bg hover:border-danger-border-hover"
    : accent
    ? "border-accent/40 text-accent hover:bg-accent-bg"
    : "border-line-strong text-ink-dim hover:bg-surface-alt hover:border-line-hover";
  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
