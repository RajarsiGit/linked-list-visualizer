import { useState } from "react";
import Button from "../../../components/Button";
import { parseNumericValue } from "../../../lib/parseValue";

export default function ControlPanel({ onInsert, onExtractMin, onPeek, onClear, busy }) {
  const [value, setValue] = useState("");

  const handleInsert = () => {
    const n = parseNumericValue(value);
    if (n === null) return;
    onInsert(n);
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
          onKeyDown={(e) => e.key === "Enter" && handleInsert()}
          placeholder="value"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />

        <Button onClick={handleInsert} disabled={busy}>
          insert
        </Button>
        <Button onClick={onExtractMin} danger disabled={busy}>
          extract_min
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
