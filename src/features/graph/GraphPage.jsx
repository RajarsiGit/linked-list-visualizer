import { useParams } from "react-router-dom";
import useGraph from "./useGraph";
import { ALGO_INFO } from "./graphAlgorithms";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import GraphView from "./components/GraphView";
import AlgoTabs from "../../components/AlgoTabs";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function GraphPage() {
  const { algo } = useParams();
  const current = ALGO_INFO[algo] ? algo : "bfs";
  const { nodeIds, startId, status, parent, distances, activeId, log, busy, run, changeStart } =
    useGraph();

  const visitedCount = Object.values(status).filter((s) => s === "visited").length;

  return (
    <>
      <PageHeader title="graph.visualizer" subtitle="traversal & shortest paths · console-driven" />

      <AlgoTabs items={ALGO_INFO} current={current} basePath="/graph" disabled={busy} />

      <StatsBar
        stats={[
          { label: "visited", value: `${visitedCount}/${nodeIds.length}` },
          { label: "status", value: busy ? "running" : "idle", highlight: busy },
          { label: "algorithm", value: ALGO_INFO[current].desc },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                graph view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">{ALGO_INFO[current].label}</span>
            </div>

            <GraphView
              status={status}
              parent={parent}
              distances={distances}
              activeId={activeId}
              startId={startId}
            />
          </div>

          <ControlPanel
            startId={startId}
            onChangeStart={changeStart}
            onRun={() => run(current)}
            busy={busy}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
