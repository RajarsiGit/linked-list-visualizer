import Button from "../../../components/Button";

const SIZES = [8, 12, 16, 20];

export default function ControlPanel({ onShuffle, onSort, size, busy }) {
  return (
    <div className="mt-4 rounded border border-line bg-surface p-4">
      <div className="text-[11px] tracking-[0.15em] text-ink-mute uppercase mb-3">
        commands
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={size}
          onChange={(e) => onShuffle(Number(e.target.value))}
          disabled={busy}
          className="bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:border-accent/50 disabled:opacity-40"
        >
          {SIZES.map((n) => (
            <option key={n} value={n}>
              size {n}
            </option>
          ))}
        </select>

        <Button onClick={() => onShuffle()} disabled={busy}>
          shuffle
        </Button>
        <Button onClick={onSort} accent disabled={busy}>
          sort
        </Button>
      </div>
    </div>
  );
}
