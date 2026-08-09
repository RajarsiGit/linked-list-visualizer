import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="flex items-baseline justify-between flex-wrap gap-3 border-b border-line pb-4">
      <Link to="/" className="group">
        <h1 className="text-ink text-lg tracking-tight">
          <span className="text-accent">&gt;</span> dsa.visualizer
        </h1>
        <p className="text-ink-mute text-xs mt-1 group-hover:text-ink-dim transition-colors">
          data structures &amp; algorithms · terminal edition
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <span className="text-[10px] text-ink-faint border border-line rounded px-2 py-1">
          v0.3.0
        </span>
      </div>
    </header>
  );
}
