import useBST from "./useBST";
import { treeHeight, countNodes } from "./bstUtils";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import TreeView from "./components/TreeView";
import EmptyState from "../../components/EmptyState";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function BSTPage() {
  const {
    root,
    log,
    activeId,
    busy,
    traversing,
    insert,
    searchValue,
    remove,
    traverse,
    stopTraverse,
    clearTree,
  } = useBST([50, 30, 70, 20, 40, 60, 80]);

  const count = countNodes(root);

  return (
    <>
      <PageHeader
        title="binary_search_tree.visualizer"
        subtitle="ordered · left < node < right · console-driven"
      />

      <StatsBar
        stats={[
          { label: "nodes", value: count },
          { label: "height", value: treeHeight(root) },
          { label: "status", value: busy ? "busy" : "idle", highlight: busy },
          { label: "type", value: "binary search tree" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                tree view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">
                {count} node{count === 1 ? "" : "s"}
              </span>
            </div>

            {!root ? (
              <EmptyState title="root → NULL" subtitle="tree is empty. insert a value to begin." />
            ) : (
              <TreeView root={root} activeId={activeId} />
            )}
          </div>

          <ControlPanel
            onInsert={insert}
            onSearch={searchValue}
            onDelete={remove}
            onTraverse={traverse}
            onStopTraverse={stopTraverse}
            onClear={clearTree}
            busy={busy}
            traversing={traversing}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
