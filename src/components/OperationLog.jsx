import { useEffect, useRef } from "react";

const KIND_STYLES = {
  info: "text-ink-mute",
  write: "text-accent",
  delete: "text-danger",
  warn: "text-warn",
  trace: "text-info",
};

const KIND_PREFIX = {
  info: "i",
  write: "+",
  delete: "-",
  warn: "!",
  trace: "·",
};

export default function OperationLog({ entries }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="rounded border border-line bg-surface flex flex-col h-[420px] xl:h-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
          operation log
        </span>
        <div className="flex-1" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 text-[12px] leading-relaxed"
      >
        {entries.map((e) => (
          <div key={e.id} className="flex gap-2">
            <span className={`${KIND_STYLES[e.kind]} shrink-0 w-3`}>
              {KIND_PREFIX[e.kind]}
            </span>
            <span className={`${KIND_STYLES[e.kind]} break-all`}>{e.text}</span>
          </div>
        ))}
        <div className="flex gap-2 text-ink-faint">
          <span className="w-3">$</span>
          <span className="inline-block w-1.5 h-3.5 bg-accent/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
