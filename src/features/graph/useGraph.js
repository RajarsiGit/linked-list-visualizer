import { useState } from "react";
import { NODES, buildAdjacency } from "./graphData";
import { ALGO_FNS } from "./graphAlgorithms";
import { sleep } from "../../lib/sleep";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const NODE_IDS = NODES.map((n) => n.id);
const ADJ = buildAdjacency();

export default function useGraph() {
  const [startId, setStartId] = useState(NODE_IDS[0]);
  const [status, setStatus] = useState({});
  const [parent, setParent] = useState({});
  const [distances, setDistances] = useState({});
  const [activeId, setActiveId] = useState(null);
  const { log, pushLog } = useOperationLog([
    {
      text: `graph loaded: ${NODE_IDS.length} nodes, ${Object.values(ADJ).reduce((a, l) => a + l.length, 0) / 2} edges`,
      kind: "info",
    },
  ]);
  const { busy, guard } = useBusyFlag();

  const run = guard(async (algoKey) => {
    const algoFn = ALGO_FNS[algoKey];
    if (!algoFn) return;

    const localStatus = Object.fromEntries(NODE_IDS.map((id) => [id, "default"]));
    const localParent = {};
    const localDist = {};
    setStatus({ ...localStatus });
    setParent({});
    setDistances({});
    pushLog(`${algoKey.toUpperCase()}() -> start from ${startId}`, "info");

    const gen = algoFn(ADJ, startId, NODE_IDS);
    let result = gen.next();
    while (!result.done) {
      const step = result.value;
      if (step.type === "visit") {
        localStatus[step.node] = "visited";
        setActiveId(step.node);
        setStatus({ ...localStatus });
        if (step.dist !== undefined) {
          localDist[step.node] = step.dist;
          setDistances({ ...localDist });
        }
        pushLog(
          `  visit ${step.node}` + (step.dist !== undefined ? ` :: dist=${step.dist}` : ""),
          "trace"
        );
        await sleep(600);
      } else if (step.type === "parent") {
        localParent[step.to] = step.from;
        setParent({ ...localParent });
        pushLog(`  edge ${step.from}-${step.to} -> added to tree`, "write");
        await sleep(300);
      } else if (step.type === "relax") {
        localParent[step.to] = step.from;
        localDist[step.to] = step.dist;
        setParent({ ...localParent });
        setDistances({ ...localDist });
        pushLog(`  relax ${step.from}->${step.to} :: dist=${step.dist}`, "write");
        await sleep(300);
      }
      result = gen.next();
    }

    setActiveId(null);
    pushLog(`${algoKey.toUpperCase()}() -> done`, "info");
  });

  const changeStart = guard((id) => {
    setStartId(id);
    setStatus({});
    setParent({});
    setDistances({});
  });

  return {
    nodeIds: NODE_IDS,
    startId,
    status,
    parent,
    distances,
    activeId,
    log,
    busy,
    run,
    changeStart,
  };
}
