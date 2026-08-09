import EntryBlock from "./EntryBlock";

export default function BucketRow({ index, chain, activeId }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-line last:border-b-0">
      <div className="w-8 shrink-0 text-ink-faint text-xs pt-2 text-right">[{index}]</div>
      <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[44px]">
        {chain.length === 0 ? (
          <span className="text-ink-faint text-xs">empty</span>
        ) : (
          chain.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-faint text-xs">→</span>}
              <EntryBlock entry={entry} active={activeId === entry.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
