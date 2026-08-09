import useHashTable from "./useHashTable";
import { bucketize, BUCKET_COUNT } from "./hashUtils";
import PageHeader from "../../components/PageHeader";
import OperationLog from "../../components/OperationLog";
import BucketRow from "./components/BucketRow";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "../../components/StatsBar";

export default function HashTablePage() {
  const { entries, log, activeId, busy, set, get, remove, clearTable } = useHashTable([
    ["name", "ada"],
    ["lang", "js"],
    ["year", 1843],
  ]);

  const buckets = bucketize(entries);

  return (
    <>
      <PageHeader
        title="hash_table.visualizer"
        subtitle="separate chaining · console-driven"
      />

      <StatsBar
        stats={[
          { label: "entries", value: entries.length },
          { label: "buckets", value: BUCKET_COUNT },
          { label: "load factor", value: (entries.length / BUCKET_COUNT).toFixed(2) },
          { label: "status", value: busy ? "busy" : "idle", highlight: busy },
          { label: "type", value: "chaining" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="min-w-0">
          <div className="rounded border border-line bg-surface p-5 lg:p-8 min-h-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                bucket view
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-[11px] text-ink-mute">
                {entries.length} entr{entries.length === 1 ? "y" : "ies"}
              </span>
            </div>

            <div>
              {buckets.map((chain, i) => (
                <BucketRow key={i} index={i} chain={chain} activeId={activeId} />
              ))}
            </div>
          </div>

          <ControlPanel onSet={set} onGet={get} onDelete={remove} onClear={clearTable} busy={busy} />
        </div>

        <OperationLog entries={log} />
      </div>
    </>
  );
}
