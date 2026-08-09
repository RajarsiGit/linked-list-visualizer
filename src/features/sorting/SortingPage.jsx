import { useParams } from "react-router-dom";
import useSorting from "./useSorting";
import { ALGO_INFO } from "./sortAlgorithms";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import BarChart from "./components/BarChart";
import AlgoTabs from "../../components/AlgoTabs";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function SortingPage() {
  const { algo } = useParams();
  const current = ALGO_INFO[algo] ? algo : "bubble";
  const { values, status, log, busy, shuffle, run } = useSorting(12);

  return (
    <>
      <PageHeader title="sorting.visualizer" subtitle="comparison sorts · console-driven" />

      <AlgoTabs items={ALGO_INFO} current={current} basePath="/sorting" disabled={busy} />

      <StatsBar
        stats={[
          { label: "size", value: values.length },
          { label: "status", value: busy ? "sorting" : "idle", highlight: busy },
          { label: "complexity", value: ALGO_INFO[current].complexity },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                array view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">{ALGO_INFO[current].label}</span>
            </div>

            <BarChart values={values} status={status} />
          </div>

          <ControlPanel
            onShuffle={shuffle}
            onSort={() => run(current)}
            size={values.length}
            busy={busy}
          />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
