import { useCallback, useRef, useState } from "react";

// Shared re-entrancy guard for animated operations: every visualizer hook
// needs to block a new operation from starting while one is mid-animation,
// and reliably clear the flag even if the operation throws.
//
// - `guard(fn)` covers the common case: wrap an operation so it no-ops while
//   busy, and always releases the flag afterward (including on error).
// - `start`/`stop` are exposed directly for interruptible operations (e.g. a
//   traversal with its own abort flag) that need to release the flag from
//   somewhere other than the wrapped function's own completion.
export default function useBusyFlag() {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const start = useCallback(() => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    return true;
  }, []);

  const stop = useCallback(() => {
    busyRef.current = false;
    setBusy(false);
  }, []);

  const guard = useCallback(
    (fn) =>
      async (...args) => {
        if (!start()) return;
        try {
          return await fn(...args);
        } finally {
          stop();
        }
      },
    [start, stop]
  );

  return { busy, isBusy: () => busyRef.current, start, stop, guard };
}
