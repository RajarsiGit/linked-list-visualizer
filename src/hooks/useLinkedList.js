import { useCallback, useRef, useState } from "react";

let addressCounter = 0x1000;
const nextAddress = () => {
  addressCounter += 8;
  return "0x" + addressCounter.toString(16).padStart(4, "0");
};

const makeNode = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useLinkedList(initialValues = []) {
  const [nodes, setNodes] = useState(() => initialValues.map(makeNode));
  const [log, setLog] = useState(() =>
    initialValues.length
      ? [
          {
            id: crypto.randomUUID(),
            text: `list initialized, head -> ${initialValues.join(" -> ")} -> NULL`,
            kind: "info",
          },
        ]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const [traversing, setTraversing] = useState(false);
  const traversalAbort = useRef(false);

  const pushLog = useCallback((text, kind = "info") => {
    setLog((prev) => [...prev.slice(-49), { id: crypto.randomUUID(), text, kind }]);
  }, []);

  const insertHead = useCallback(
    (value) => {
      const n = makeNode(value);
      setNodes((prev) => [n, ...prev]);
      pushLog(`INSERT_HEAD(${value}) -> new node @ ${n.address}`, "write");
    },
    [pushLog]
  );

  const insertTail = useCallback(
    (value) => {
      const n = makeNode(value);
      setNodes((prev) => [...prev, n]);
      pushLog(`INSERT_TAIL(${value}) -> new node @ ${n.address}`, "write");
    },
    [pushLog]
  );

  const insertAt = useCallback(
    (value, index) => {
      const n = makeNode(value);
      setNodes((prev) => {
        const i = Math.max(0, Math.min(index, prev.length));
        const copy = [...prev];
        copy.splice(i, 0, n);
        return copy;
      });
      pushLog(`INSERT_AT(${value}, idx=${index}) -> new node @ ${n.address}`, "write");
    },
    [pushLog]
  );

  const deleteNode = useCallback(
    (id) => {
      setNodes((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target) {
          pushLog(`DELETE(${target.value} @ ${target.address}) -> pointer relinked`, "delete");
        }
        return prev.filter((n) => n.id !== id);
      });
      setActiveId((prev) => (prev === id ? null : prev));
    },
    [pushLog]
  );

  const clearList = useCallback(() => {
    setNodes([]);
    pushLog("CLEAR() -> head = NULL", "warn");
  }, [pushLog]);

  const traverse = useCallback(async () => {
    if (traversing || nodes.length === 0) return;
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
  }, [nodes, traversing, pushLog]);

  const stopTraverse = useCallback(() => {
    traversalAbort.current = true;
    setTraversing(false);
    setActiveId(null);
  }, []);

  return {
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
  };
}
