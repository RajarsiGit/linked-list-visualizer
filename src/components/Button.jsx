export default function Button({ children, onClick, accent, danger, disabled }) {
  const base =
    "px-3 py-1.5 rounded text-xs border transition-colors uppercase tracking-wide disabled:opacity-40 disabled:pointer-events-none";
  const styles = danger
    ? "border-danger-border text-danger hover:bg-danger-bg hover:border-danger-border-hover"
    : accent
    ? "border-accent/40 text-accent hover:bg-accent-bg"
    : "border-line-strong text-ink-dim hover:bg-surface-alt hover:border-line-hover";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
