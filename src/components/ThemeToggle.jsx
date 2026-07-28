export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle color theme"
      aria-pressed={theme === "light"}
      className="flex items-center gap-2 border border-line rounded px-2.5 py-1.5 text-[10px] uppercase tracking-widest transition-colors hover:border-line-hover"
    >
      <span className={theme === "dark" ? "text-accent" : "text-ink-faint"}>
        dark
      </span>
      <span className="text-line-strong">/</span>
      <span className={theme === "light" ? "text-accent" : "text-ink-faint"}>
        light
      </span>
    </button>
  );
}
