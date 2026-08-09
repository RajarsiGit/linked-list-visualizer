import useQueue from "./useQueue";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import QueueSlot from "./components/QueueSlot";
import PointerLabel from "./components/PointerLabel";
import EmptyState from "../../components/EmptyState";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function QueuePage() {
  const { items, log, activeId, busy, enqueue, dequeue, peek, clearQueue } = useQueue([
    12, 47, 9,
  ]);

  return (
    <>
      <PageHeader title="queue.visualizer" subtitle="FIFO · array-backed · console-driven" />

      <StatsBar
        stats={[
          { label: "length", value: items.length },
          { label: "status", value: busy ? "busy" : "idle", highlight: busy },
          { label: "type", value: "FIFO · array-backed" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                queue view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">
                {items.length} item{items.length === 1 ? "" : "s"}
              </span>
            </div>

            {items.length === 0 ? (
              <EmptyState
                title="front → NULL ← rear"
                subtitle="queue is empty. enqueue a value to begin."
              />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <PointerLabel label="front" side="left" />
                {items.map((it) => (
                  <QueueSlot key={it.id} item={it} active={activeId === it.id} />
                ))}
                <PointerLabel label="rear" side="right" />
              </div>
            )}
          </div>

          <ControlPanel
            onEnqueue={enqueue}
            onDequeue={dequeue}
            onPeek={peek}
            onClear={clearQueue}
            busy={busy}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
