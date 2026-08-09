export default function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-ink-faint text-2xl mb-2">{title}</div>
      <p className="text-ink-mute text-xs">{subtitle}</p>
    </div>
  );
}
