import { useCallback, useState } from "react";
import { makeNode, buildHeap, parentIndex, leftIndex, rightIndex } from "./heapUtils";
import { sleep } from "../../lib/sleep";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

export default function useHeap(initialValues = []) {
  const [nodes, setNodes] = useState(() => buildHeap(initialValues));
  const { log, pushLog } = useOperationLog(
    initialValues.length
      ? [{ text: `min-heap built from [${initialValues.join(", ")}]`, kind: "info" }]
      : []
  );
  const [activeIds, setActiveIds] = useState([]);
  const { busy, guard } = useBusyFlag();

  const siftUp = useCallback(
    async (startIndex, arr) => {
      let i = startIndex;
      while (i > 0) {
        const p = parentIndex(i);
        setActiveIds([arr[i].id, arr[p].id]);
        pushLog(
          `  compare idx ${i} (${arr[i].value}) vs parent idx ${p} (${arr[p].value})`,
          "trace"
        );
        await sleep(450);
        if (arr[p].value > arr[i].value) {
          [arr[p], arr[i]] = [arr[i], arr[p]];
          setNodes([...arr]);
          pushLog(`  swap idx ${i} <-> idx ${p}`, "write");
          await sleep(450);
          i = p;
        } else {
          break;
        }
      }
      return arr;
    },
    [pushLog]
  );

  const siftDown = useCallback(
    async (startIndex, arr) => {
      let i = startIndex;
      const n = arr.length;
      while (true) {
        const l = leftIndex(i);
        const r = rightIndex(i);
        let smallest = i;
        if (l < n) {
          setActiveIds([arr[smallest].id, arr[l].id]);
          pushLog(
            `  compare idx ${smallest} (${arr[smallest].value}) vs left idx ${l} (${arr[l].value})`,
            "trace"
          );
          await sleep(400);
          if (arr[l].value < arr[smallest].value) smallest = l;
        }
        if (r < n) {
          setActiveIds([arr[smallest].id, arr[r].id]);
          pushLog(
            `  compare idx ${smallest} (${arr[smallest].value}) vs right idx ${r} (${arr[r].value})`,
            "trace"
          );
          await sleep(400);
          if (arr[r].value < arr[smallest].value) smallest = r;
        }
        if (smallest === i) break;
        [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
        setNodes([...arr]);
        pushLog(`  swap idx ${i} <-> idx ${smallest}`, "write");
        await sleep(400);
        i = smallest;
      }
      return arr;
    },
    [pushLog]
  );

  const insert = guard(async (value) => {
    const node = makeNode(value);
    const arr = [...nodes, node];
    setNodes(arr);
    pushLog(`INSERT(${value}) -> appended @ idx ${arr.length - 1}, sifting up`, "write");
    await sleep(300);
    await siftUp(arr.length - 1, arr);
    setActiveIds([]);
  });

  const extractMin = guard(async () => {
    if (nodes.length === 0) {
      pushLog("EXTRACT_MIN() -> heap is empty", "warn");
      return;
    }
    const min = nodes[0];
    setActiveIds([min.id]);
    pushLog(`EXTRACT_MIN() -> root @ ${min.address} :: value=${min.value}`, "delete");
    await sleep(400);

    const arr = [...nodes];
    const last = arr.pop();
    if (arr.length > 0) {
      arr[0] = last;
      setNodes([...arr]);
      pushLog(`  moved last node to root, sifting down`, "info");
      await sleep(300);
      await siftDown(0, arr);
    } else {
      setNodes([]);
    }
    setActiveIds([]);
  });

  const peek = guard(async () => {
    if (nodes.length === 0) {
      pushLog("PEEK() -> heap is empty", "warn");
      return;
    }
    const min = nodes[0];
    setActiveIds([min.id]);
    pushLog(`PEEK() -> root @ ${min.address} :: value=${min.value}`, "trace");
    await sleep(700);
    setActiveIds([]);
  });

  const clearHeap = guard(() => {
    setNodes([]);
    setActiveIds([]);
    pushLog("CLEAR() -> heap emptied", "warn");
  });

  return {
    nodes,
    log,
    activeIds,
    busy,
    insert,
    extractMin,
    peek,
    clearHeap,
  };
}
