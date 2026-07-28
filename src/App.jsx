import useLinkedList from "./hooks/useLinkedList";
import useTheme from "./hooks/useTheme";
import Header from "./components/Header";
import NodeBlock from "./components/NodeBlock";
import Connector from "./components/Connector";
import OperationLog from "./components/OperationLog";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "./components/StatsBar";
import EmptyState from "./components/EmptyState";
import NullTerminal from "./components/NullTerminal";
import PointerLabel from "./components/PointerLabel";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    nodes,
    log,
    activeId,
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
    <div className="min-h-screen bg-canvas text-ink-dim font-mono selection:bg-accent/30 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-5 py-6 lg:px-8">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <StatsBar nodeCount={nodes.length} traversing={traversing} />

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
                <EmptyState />
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
              maxIndex={nodes.length}
            />
          </div>

          <OperationLog entries={log} />
        </div>
      </div>
    </div>
  );
}
