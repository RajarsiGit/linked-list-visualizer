import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="pb-2">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[11px] text-ink-mute hover:text-accent transition-colors"
      >
        ← topics
      </Link>
      <h1 className="text-ink text-lg tracking-tight mt-2">
        <span className="text-accent">&gt;</span> {title}
      </h1>
      <p className="text-ink-mute text-xs mt-1">{subtitle}</p>
    </div>
  );
}
