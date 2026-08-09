import useStack from "./useStack";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import StackFrame from "./components/StackFrame";
import BaseMarker from "./components/BaseMarker";
import EmptyState from "../../components/EmptyState";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function StackPage() {
  const { frames, log, activeId, busy, push, pop, peek, clearStack } = useStack([12, 47, 9]);
  const reversed = [...frames].reverse();

  return (
    <>
      <PageHeader title="stack.visualizer" subtitle="LIFO · array-backed · console-driven" />

      <StatsBar
        stats={[
          { label: "length", value: frames.length },
          { label: "status", value: busy ? "busy" : "idle", highlight: busy },
          { label: "type", value: "LIFO · array-backed" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                stack view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">
                {frames.length} frame{frames.length === 1 ? "" : "s"}
              </span>
            </div>

            {frames.length === 0 ? (
              <EmptyState title="top → NULL" subtitle="stack is empty. push a value to begin." />
            ) : (
              <div className="flex flex-col items-center gap-3 pt-6">
                {reversed.map((f) => (
                  <StackFrame
                    key={f.id}
                    frame={f}
                    isTop={f.id === reversed[0].id}
                    active={activeId === f.id}
                  />
                ))}
                <BaseMarker />
              </div>
            )}
          </div>

          <ControlPanel onPush={push} onPop={pop} onPeek={peek} onClear={clearStack} busy={busy} />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
