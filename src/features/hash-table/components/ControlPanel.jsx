import { useState } from "react";
import Button from "../../../components/Button";

export default function ControlPanel({ onSet, onGet, onDelete, onClear, busy }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleSet = () => {
    const k = key.trim();
    if (k === "" || value.trim() === "") return;
    const n = Number(value.trim());
    onSet(k, Number.isFinite(n) ? n : value.trim());
    setKey("");
    setValue("");
  };

  const handleGet = () => {
    const k = key.trim();
    if (k === "") return;
    onGet(k);
    setKey("");
  };

  const handleDelete = () => {
    const k = key.trim();
    if (k === "") return;
    onDelete(k);
    setKey("");
  };

  return (
    <div className="mt-4 rounded border border-line bg-surface p-4">
      <div className="text-[11px] tracking-[0.15em] text-ink-mute uppercase mb-3">
        commands
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="key"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSet()}
          placeholder="value"
          className="w-24 bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />

        <Button onClick={handleSet} disabled={busy}>
          set
        </Button>
        <Button onClick={handleGet} accent disabled={busy}>
          get
        </Button>
        <Button onClick={handleDelete} danger disabled={busy}>
          delete
        </Button>

        <div className="w-px h-6 bg-line mx-1" />

        <Button onClick={onClear} danger disabled={busy}>
          clear
        </Button>
      </div>
    </div>
  );
}
