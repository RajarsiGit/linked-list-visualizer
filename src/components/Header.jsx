import ThemeToggle from "./ThemeToggle";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="flex items-baseline justify-between flex-wrap gap-3 border-b border-line pb-4">
      <div>
        <h1 className="text-ink text-lg tracking-tight">
          <span className="text-accent">&gt;</span> linked_list.visualizer
        </h1>
        <p className="text-ink-mute text-xs mt-1">
          singly-linked · in-memory · console-driven
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <span className="text-[10px] text-ink-faint border border-line rounded px-2 py-1">
          v0.2.0
        </span>
      </div>
    </header>
  );
}
