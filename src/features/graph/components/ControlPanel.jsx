import Button from "../../../components/Button";
import { NODES } from "../graphData";

export default function ControlPanel({ startId, onChangeStart, onRun, busy }) {
  return (
    <div className="mt-4 rounded border border-line bg-surface p-4">
      <div className="text-[11px] tracking-[0.15em] text-ink-mute uppercase mb-3">
        commands
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] text-ink-mute uppercase tracking-wide">start:</span>
        <select
          value={startId}
          onChange={(e) => onChangeStart(e.target.value)}
          disabled={busy}
          className="bg-canvas border border-line-strong rounded px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:border-accent/50 disabled:opacity-40"
        >
          {NODES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.id}
            </option>
          ))}
        </select>

        <Button onClick={onRun} accent disabled={busy}>
          run
        </Button>
      </div>
    </div>
  );
}
