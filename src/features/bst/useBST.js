import { useCallback, useRef, useState } from "react";
import {
  findPath,
  insertPure,
  deletePure,
  inorder,
  preorder,
  postorder,
  levelorder,
} from "./bstUtils";
import { sleep } from "../../lib/sleep";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const ORDER_FNS = { inorder, preorder, postorder, levelorder: (n) => levelorder(n) };

export default function useBST(initialValues = []) {
  const [root, setRoot] = useState(() => {
    let r = null;
    for (const v of initialValues) r = insertPure(r, v);
    return r;
  });
  const { log, pushLog } = useOperationLog(
    initialValues.length
      ? [{ text: `tree initialized with [${initialValues.join(", ")}]`, kind: "info" }]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const [traversing, setTraversing] = useState(false);
  const { busy, guard, start, stop } = useBusyFlag();
  const abortRef = useRef(false);

  const walkPath = useCallback(async (root2, value, { onStep } = {}) => {
    let cur = root2;
    while (cur) {
      setActiveId(cur.id);
      if (onStep) onStep(cur);
      await sleep(400);
      if (value === cur.value) return cur;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return null;
  }, []);

  const insert = guard(async (value) => {
    const { found } = findPath(root, value);
    if (found) {
      pushLog(`INSERT(${value}) -> value already exists`, "warn");
      return;
    }
    pushLog(`INSERT(${value}) -> searching for insertion point`, "info");
    await walkPath(root, value, {
      onStep: (n) =>
        pushLog(
          `  @ ${n.address} :: value=${n.value} -> go ${value < n.value ? "left" : "right"}`,
          "trace"
        ),
    });
    const newRoot = insertPure(root, value);
    setRoot(newRoot);
    const { node } = findPath(newRoot, value);
    pushLog(`INSERT(${value}) -> new node @ ${node.address}`, "write");
    setActiveId(null);
  });

  const searchValue = guard(async (value) => {
    if (!root) {
      pushLog("SEARCH() -> tree is empty", "warn");
      return;
    }
    pushLog(`SEARCH(${value}) -> start at root`, "info");
    const found = await walkPath(root, value, {
      onStep: (n) => pushLog(`  visit @ ${n.address} :: value=${n.value}`, "trace"),
    });
    pushLog(
      found ? `SEARCH(${value}) -> found @ ${found.address}` : `SEARCH(${value}) -> not found`,
      found ? "info" : "warn"
    );
    setActiveId(null);
  });

  const remove = guard(async (value) => {
    const { found, node } = findPath(root, value);
    if (!found) {
      pushLog(`DELETE(${value}) -> not found`, "warn");
      return;
    }
    pushLog(`DELETE(${value}) -> searching`, "info");
    await walkPath(root, value, {
      onStep: (n) => pushLog(`  visit @ ${n.address} :: value=${n.value}`, "trace"),
    });
    setActiveId(node.id);
    pushLog(`DELETE(${value}) -> removing @ ${node.address}`, "delete");
    await sleep(400);
    setRoot((cur) => deletePure(cur, value));
    setActiveId(null);
  });

  const traverse = useCallback(
    async (order) => {
      if (!root || !start()) return;
      const orderFn = ORDER_FNS[order];
      const seq = orderFn(root);
      if (seq.length === 0) {
        stop();
        return;
      }
      setTraversing(true);
      abortRef.current = false;
      pushLog(`${order.toUpperCase()}() -> start`, "info");
      for (const n of seq) {
        if (abortRef.current) break;
        setActiveId(n.id);
        pushLog(`  visit @ ${n.address} :: value=${n.value}`, "trace");
        await sleep(550);
      }
      if (!abortRef.current) pushLog(`${order.toUpperCase()}() -> done`, "info");
      setActiveId(null);
      setTraversing(false);
      stop();
    },
    [root, pushLog, start, stop]
  );

  const stopTraverse = useCallback(() => {
    abortRef.current = true;
    setTraversing(false);
    setActiveId(null);
    stop();
  }, [stop]);

  const clearTree = guard(() => {
    setRoot(null);
    setActiveId(null);
    pushLog("CLEAR() -> root = NULL", "warn");
  });

  return {
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
  };
}
