import useHeap from "./useHeap";
import { heapHeight } from "./heapUtils";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import ArrayView from "./components/ArrayView";
import HeapTreeView from "./components/HeapTreeView";
import EmptyState from "../../components/EmptyState";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function HeapPage() {
  const { nodes, log, activeIds, busy, insert, extractMin, peek, clearHeap } = useHeap([
    12, 47, 9, 33, 5, 21,
  ]);

  return (
    <>
      <PageHeader
        title="min_heap.visualizer"
        subtitle="binary heap · array-backed · console-driven"
      />

      <StatsBar
        stats={[
          { label: "nodes", value: nodes.length },
          { label: "height", value: heapHeight(nodes.length) },
          { label: "status", value: busy ? "busy" : "idle", highlight: busy },
          { label: "type", value: "min-heap · array-backed" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                heap view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">
                {nodes.length} node{nodes.length === 1 ? "" : "s"}
              </span>
            </div>

            {nodes.length === 0 ? (
              <EmptyState title="root → NULL" subtitle="heap is empty. insert a value to begin." />
            ) : (
              <>
                <ArrayView nodes={nodes} activeIds={activeIds} />
                <HeapTreeView nodes={nodes} activeIds={activeIds} />
              </>
            )}
          </div>

          <ControlPanel
            onInsert={insert}
            onExtractMin={extractMin}
            onPeek={peek}
            onClear={clearHeap}
            busy={busy}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
