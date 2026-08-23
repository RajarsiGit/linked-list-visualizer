// Parses a control-panel text input: numeric strings become numbers,
// everything else is kept as a string. Returns null for empty input.
export function parseValue(raw) {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : trimmed;
}

// Same, but rejects non-numeric input (for numeric-only structures like the
// BST and heap, where comparisons assume numbers).
export function parseNumericValue(raw) {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}
