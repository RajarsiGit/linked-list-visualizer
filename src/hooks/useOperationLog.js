import { useCallback, useState } from "react";

const DEFAULT_MAX = 60;

// Shared "operation log" state used by every visualizer: a capped,
// kind-tagged list of entries rendered by <OperationLog>.
export default function useOperationLog(initialEntries = [], max = DEFAULT_MAX) {
  const [log, setLog] = useState(() =>
    initialEntries.map((entry) => ({ id: crypto.randomUUID(), ...entry }))
  );

  const pushLog = useCallback(
    (text, kind = "info") => {
      setLog((prev) => [...prev.slice(-(max - 1)), { id: crypto.randomUUID(), text, kind }]);
    },
    [max]
  );

  return { log, pushLog };
}
