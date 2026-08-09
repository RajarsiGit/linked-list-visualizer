import { useState } from "react";
import { sleep } from "../../lib/sleep";
import { createAddressCounter } from "../../lib/addressCounter";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const nextAddress = createAddressCounter(0x3000);

const makeSlot = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
});

export default function useQueue(initialValues = []) {
  const [items, setItems] = useState(() => initialValues.map(makeSlot));
  const { log, pushLog } = useOperationLog(
    initialValues.length
      ? [{ text: `queue initialized, front -> ${initialValues.join(" -> ")} <- rear`, kind: "info" }]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const { busy, guard } = useBusyFlag();

  const enqueue = guard((value) => {
    const s = makeSlot(value);
    setItems((prev) => [...prev, s]);
    pushLog(`ENQUEUE(${value}) -> new slot @ ${s.address}`, "write");
  });

  const dequeue = guard(async () => {
    if (items.length === 0) {
      pushLog("DEQUEUE() -> queue underflow", "warn");
      return;
    }
    const front = items[0];
    setActiveId(front.id);
    pushLog(`DEQUEUE() -> removing @ ${front.address} :: value=${front.value}`, "delete");
    await sleep(400);
    setItems((cur) => cur.filter((s) => s.id !== front.id));
    setActiveId(null);
  });

  const peek = guard(async () => {
    if (items.length === 0) {
      pushLog("PEEK() -> queue is empty", "warn");
      return;
    }
    const front = items[0];
    pushLog(`PEEK() -> front @ ${front.address} :: value=${front.value}`, "trace");
    setActiveId(front.id);
    await sleep(700);
    setActiveId(null);
  });

  const clearQueue = guard(() => {
    setItems([]);
    setActiveId(null);
    pushLog("CLEAR() -> front = rear = NULL", "warn");
  });

  return {
    items,
    log,
    activeId,
    busy,
    enqueue,
    dequeue,
    peek,
    clearQueue,
  };
}
