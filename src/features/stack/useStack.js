import { useState } from "react";
import { sleep } from "../../lib/sleep";
import { createAddressCounter } from "../../lib/addressCounter";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const nextAddress = createAddressCounter(0x2000);

const makeFrame = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
});

export default function useStack(initialValues = []) {
  const [frames, setFrames] = useState(() => initialValues.map(makeFrame));
  const { log, pushLog } = useOperationLog(
    initialValues.length
      ? [
          {
            text: `stack initialized, top -> ${[...initialValues].reverse().join(" -> ")} -> NULL`,
            kind: "info",
          },
        ]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const { busy, guard } = useBusyFlag();

  const push = guard((value) => {
    const f = makeFrame(value);
    setFrames((prev) => [...prev, f]);
    pushLog(`PUSH(${value}) -> new frame @ ${f.address}`, "write");
  });

  const pop = guard(async () => {
    if (frames.length === 0) {
      pushLog("POP() -> stack underflow", "warn");
      return;
    }
    const top = frames[frames.length - 1];
    setActiveId(top.id);
    pushLog(`POP() -> removing @ ${top.address} :: value=${top.value}`, "delete");
    await sleep(400);
    setFrames((cur) => cur.filter((f) => f.id !== top.id));
    setActiveId(null);
  });

  const peek = guard(async () => {
    if (frames.length === 0) {
      pushLog("PEEK() -> stack is empty", "warn");
      return;
    }
    const top = frames[frames.length - 1];
    pushLog(`PEEK() -> top @ ${top.address} :: value=${top.value}`, "trace");
    setActiveId(top.id);
    await sleep(700);
    setActiveId(null);
  });

  const clearStack = guard(() => {
    setFrames([]);
    setActiveId(null);
    pushLog("CLEAR() -> top = NULL", "warn");
  });

  return {
    frames,
    log,
    activeId,
    busy,
    push,
    pop,
    peek,
    clearStack,
  };
}
