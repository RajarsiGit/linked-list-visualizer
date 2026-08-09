import { useCallback, useState } from "react";
import { hashKey, BUCKET_COUNT } from "./hashUtils";
import { sleep } from "../../lib/sleep";
import { createAddressCounter } from "../../lib/addressCounter";
import useOperationLog from "../../hooks/useOperationLog";
import useBusyFlag from "../../hooks/useBusyFlag";

const nextAddress = createAddressCounter(0x5000);

export default function useHashTable(initialEntries = []) {
  const [entries, setEntries] = useState(() =>
    initialEntries.map(([key, value]) => ({
      id: crypto.randomUUID(),
      key,
      value,
      address: nextAddress(),
    }))
  );
  const { log, pushLog } = useOperationLog(
    initialEntries.length
      ? [
          {
            text: `hash table initialized with ${initialEntries.length} entr${
              initialEntries.length === 1 ? "y" : "ies"
            }, ${BUCKET_COUNT} buckets`,
            kind: "info",
          },
        ]
      : []
  );
  const [activeId, setActiveId] = useState(null);
  const { busy, guard } = useBusyFlag();

  const chainFor = useCallback(
    (key) => {
      const bucket = hashKey(key);
      return { bucket, chain: entries.filter((e) => hashKey(e.key) === bucket) };
    },
    [entries]
  );

  const set = guard(async (key, value) => {
    const bucket = hashKey(key);
    pushLog(`SET(${key}) -> hash("${key}") = bucket[${bucket}]`, "info");

    const existing = entries.find((e) => e.key === key);
    if (existing) {
      setActiveId(existing.id);
      await sleep(400);
      setEntries((cur) => cur.map((e) => (e.id === existing.id ? { ...e, value } : e)));
      pushLog(`SET(${key}) -> updated @ ${existing.address} :: value=${value}`, "write");
    } else {
      const entry = { id: crypto.randomUUID(), key, value, address: nextAddress() };
      setActiveId(entry.id);
      setEntries((cur) => [...cur, entry]);
      await sleep(400);
      pushLog(`SET(${key}) -> new entry @ ${entry.address} :: value=${value}`, "write");
    }
    setActiveId(null);
  });

  const get = guard(async (key) => {
    const { bucket, chain } = chainFor(key);
    pushLog(`GET(${key}) -> hash("${key}") = bucket[${bucket}]`, "info");
    let found = null;
    for (const entry of chain) {
      setActiveId(entry.id);
      pushLog(`  compare @ ${entry.address} :: key=${entry.key}`, "trace");
      await sleep(400);
      if (entry.key === key) {
        found = entry;
        break;
      }
    }
    pushLog(
      found
        ? `GET(${key}) -> found @ ${found.address} :: value=${found.value}`
        : `GET(${key}) -> not found`,
      found ? "info" : "warn"
    );
    setActiveId(null);
  });

  const remove = guard(async (key) => {
    const { bucket, chain } = chainFor(key);
    pushLog(`DELETE(${key}) -> hash("${key}") = bucket[${bucket}]`, "info");
    let found = null;
    for (const entry of chain) {
      setActiveId(entry.id);
      pushLog(`  compare @ ${entry.address} :: key=${entry.key}`, "trace");
      await sleep(400);
      if (entry.key === key) {
        found = entry;
        break;
      }
    }
    if (!found) {
      pushLog(`DELETE(${key}) -> not found`, "warn");
    } else {
      pushLog(`DELETE(${key}) -> removing @ ${found.address}`, "delete");
      await sleep(300);
      setEntries((cur) => cur.filter((e) => e.id !== found.id));
    }
    setActiveId(null);
  });

  const clearTable = guard(() => {
    setEntries([]);
    setActiveId(null);
    pushLog("CLEAR() -> all buckets emptied", "warn");
  });

  return {
    entries,
    log,
    activeId,
    busy,
    set,
    get,
    remove,
    clearTable,
  };
}
