export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-ink-faint text-2xl mb-2">head → NULL</div>
      <p className="text-ink-mute text-xs">
        list is empty. insert a node to begin.
      </p>
    </div>
  );
}
