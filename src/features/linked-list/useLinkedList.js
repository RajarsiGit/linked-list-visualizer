import { useCallback, useRef, useState } from "react";
import { sleep } from "../../lib/sleep";
import { createAddressCounter } from "../../lib/addressCounter";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const nextAddress = createAddressCounter(0x1000);

const makeNode = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
});

export default function useLinkedList(initialValues = []) {
  const [nodes, setNodes] = useState(() => initialValues.map(makeNode));
  const { log, pushLog } = useOperationLog(
    initialValues.length
      ? [{ text: `list initialized, head -> ${initialValues.join(" -> ")} -> NULL`, kind: "info" }]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const [traversing, setTraversing] = useState(false);
  const { busy, guard, start, stop } = useBusyFlag();
  const traversalAbort = useRef(false);

  const insertHead = guard((value) => {
    const n = makeNode(value);
    setNodes((prev) => [n, ...prev]);
    pushLog(`INSERT_HEAD(${value}) -> new node @ ${n.address}`, "write");
  });

  const insertTail = guard((value) => {
    const n = makeNode(value);
    setNodes((prev) => [...prev, n]);
    pushLog(`INSERT_TAIL(${value}) -> new node @ ${n.address}`, "write");
  });

  const insertAt = guard((value, index) => {
    const n = makeNode(value);
    setNodes((prev) => {
      const i = Math.max(0, Math.min(index, prev.length));
      const copy = [...prev];
      copy.splice(i, 0, n);
      return copy;
    });
    pushLog(`INSERT_AT(${value}, idx=${index}) -> new node @ ${n.address}`, "write");
  });

  const deleteNode = guard((id) => {
    setNodes((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target) {
        pushLog(`DELETE(${target.value} @ ${target.address}) -> pointer relinked`, "delete");
      }
      return prev.filter((n) => n.id !== id);
    });
    setActiveId((prev) => (prev === id ? null : prev));
  });

  const clearList = guard(() => {
    setNodes([]);
    pushLog("CLEAR() -> head = NULL", "warn");
  });

  const traverse = useCallback(async () => {
    if (nodes.length === 0 || !start()) return;
    setTraversing(true);
    traversalAbort.current = false;
    pushLog("TRAVERSE() -> start from head", "info");
    for (const n of nodes) {
      if (traversalAbort.current) break;
      setActiveId(n.id);
      pushLog(`  visit @ ${n.address} :: value=${n.value}`, "trace");
      await sleep(650);
    }
    if (!traversalAbort.current) pushLog("TRAVERSE() -> reached NULL, done", "info");
    setActiveId(null);
    setTraversing(false);
    stop();
  }, [nodes, pushLog, start, stop]);

  const stopTraverse = useCallback(() => {
    traversalAbort.current = true;
    setTraversing(false);
    setActiveId(null);
    stop();
  }, [stop]);

  return {
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
  };
}
