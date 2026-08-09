import useLinkedList from "./useLinkedList";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import StatsBar from "../../components/StatsBar";
import EmptyState from "../../components/EmptyState";
import NodeBlock from "./components/NodeBlock";
import Connector from "./components/Connector";
import ControlPanel from "./components/ControlPanel";
import NullTerminal from "./components/NullTerminal";
import PointerLabel from "./components/PointerLabel";

export default function LinkedListPage() {
  const {
    nodes,
    log,
    activeId,
    busy,
    traversing,
    insertHead,
    insertTail,
    insertAt,
    deleteNode,
    clearList,
    traverse,
    stopTraverse,
  } = useLinkedList([12, 47, 9]);

  return (
    <>
      <PageHeader
        title="linked_list.visualizer"
        subtitle="singly-linked · in-memory · console-driven"
      />

      <StatsBar
        stats={[
          { label: "length", value: nodes.length },
          { label: "status", value: traversing ? "traversing" : "idle", highlight: traversing },
          { label: "type", value: "singly-linked" },
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
              <EmptyState title="head → NULL" subtitle="list is empty. insert a node to begin." />
            ) : (
              <div className="flex flex-wrap items-center gap-y-8">
                <PointerLabel label="head" />
                {nodes.map((n, i) => (
                  <div key={n.id} className="flex items-center">
                    <NodeBlock
                      node={n}
                      index={i}
                      active={activeId === n.id}
                      onDelete={() => deleteNode(n.id)}
                      disabled={busy}
                    />
                    <Connector />
                  </div>
                ))}
                <NullTerminal />
              </div>
            )}
          </div>

          <ControlPanel
            onInsertHead={insertHead}
            onInsertTail={insertTail}
            onInsertAt={insertAt}
            onTraverse={traverse}
            onStopTraverse={stopTraverse}
            onClear={clearList}
            traversing={traversing}
            busy={busy}
            maxIndex={nodes.length}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
