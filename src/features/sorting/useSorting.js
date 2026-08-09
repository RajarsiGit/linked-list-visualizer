import { useState } from "react";
import { ALGO_FNS } from "./sortAlgorithms";
import { sleep } from "../../lib/sleep";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const SPEED = 220;

const randomArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);

export default function useSorting(initialSize = 12) {
  const [values, setValues] = useState(() => randomArray(initialSize));
  const [status, setStatus] = useState(() => Array(initialSize).fill("default"));
  const { log, pushLog } = useOperationLog([
    { text: `array generated, size=${initialSize}`, kind: "info" },
  ]);
  const { busy, guard } = useBusyFlag();

  const shuffle = guard((size) => {
    const n = size ?? values.length;
    setValues(randomArray(n));
    setStatus(Array(n).fill("default"));
    pushLog(`SHUFFLE() -> new array, size=${n}`, "warn");
  });

  const run = guard(async (algoKey) => {
    const algoFn = ALGO_FNS[algoKey];
    if (!algoFn) return;
    pushLog(`${algoKey.toUpperCase()}_SORT() -> start`, "info");

    const localValues = [...values];
    let localStatus = localValues.map(() => "default");
    const gen = algoFn(localValues);
    let result = gen.next();

    while (!result.done) {
      const step = result.value;
      if (step.type === "compare") {
        const [a, b] = step.indices;
        localStatus = localStatus.map((s, idx) => (idx === a || idx === b ? "active" : s));
        setStatus([...localStatus]);
        pushLog(`  compare idx ${a} (${localValues[a]}) vs idx ${b} (${localValues[b]})`, "trace");
        await sleep(SPEED);
        localStatus = localStatus.map((s, idx) =>
          (idx === a || idx === b) && s !== "sorted" ? "default" : s
        );
        setStatus([...localStatus]);
      } else if (step.type === "swap") {
        const [a, b] = step.indices;
        setValues([...localValues]);
        localStatus = localStatus.map((s, idx) => (idx === a || idx === b ? "active" : s));
        setStatus([...localStatus]);
        pushLog(`  swap idx ${a} <-> idx ${b}`, "write");
        await sleep(SPEED);
        localStatus = localStatus.map((s, idx) =>
          (idx === a || idx === b) && s !== "sorted" ? "default" : s
        );
        setStatus([...localStatus]);
      } else if (step.type === "overwrite") {
        setValues([...localValues]);
        localStatus = localStatus.map((s, idx) => (idx === step.index ? "active" : s));
        setStatus([...localStatus]);
        pushLog(`  write idx ${step.index} = ${step.value}`, "write");
        await sleep(SPEED);
        localStatus = localStatus.map((s, idx) =>
          idx === step.index && s !== "sorted" ? "default" : s
        );
        setStatus([...localStatus]);
      } else if (step.type === "sorted") {
        localStatus = localStatus.map((s, idx) => (idx === step.index ? "sorted" : s));
        setStatus([...localStatus]);
      }
      result = gen.next();
    }

    setValues([...localValues]);
    setStatus(localValues.map(() => "sorted"));
    pushLog(`${algoKey.toUpperCase()}_SORT() -> done`, "info");
  });

  return { values, status, log, busy, shuffle, run };
}
