import { useState } from "react";
import Button from "../../../components/Button";
import { parseValue } from "../../../lib/parseValue";

export default function ControlPanel({ onEnqueue, onDequeue, onPeek, onClear, busy }) {
  const [value, setValue] = useState("");

  const handleEnqueue = () => {
    const v = parseValue(value);
    if (v === null) return;
    onEnqueue(v);
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
          onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
          placeholder="value"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />

        <Button onClick={handleEnqueue} disabled={busy}>
          enqueue
        </Button>
        <Button onClick={onDequeue} disabled={busy}>
          dequeue
        </Button>
        <Button onClick={onPeek} accent disabled={busy}>
          peek
        </Button>

        <div className="w-px h-6 bg-line mx-1" />

        <Button onClick={onClear} danger disabled={busy}>
          clear
        </Button>
      </div>
    </div>
  );
}
