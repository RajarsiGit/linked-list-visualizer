import { useState } from "react";
import Button from "../../../components/Button";

export default function ControlPanel({
  onInsertHead,
  onInsertTail,
  onInsertAt,
  onTraverse,
  onStopTraverse,
  onClear,
  traversing,
  busy,
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

        <Button onClick={handleInsertHead} disabled={busy}>insert_head</Button>
        <Button onClick={handleInsertTail} disabled={busy}>insert_tail</Button>
        <Button onClick={handleInsertAt} disabled={busy}>insert_at</Button>

        <div className="w-px h-6 bg-line mx-1" />

        {!traversing ? (
          <Button onClick={onTraverse} accent disabled={busy}>traverse</Button>
        ) : (
          <Button onClick={onStopTraverse} danger>stop</Button>
        )}
        <Button onClick={onClear} danger disabled={busy}>clear</Button>
      </div>
    </div>
  );
}
