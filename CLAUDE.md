# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A single-page React + Vite app that visualizes singly-linked list operations
(insert/delete/traverse) with a terminal aesthetic. No backend, no persistence
beyond the theme preference in `localStorage`.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
```

There is no test suite and no linter configured. Verify changes by running
`npm run dev` and exercising the feature in the browser.

## Architecture

- `src/App.jsx` — top-level composition only. State and list operations live in
  `useLinkedList`; theme state lives in `useTheme`. Keep App.jsx thin.
- `src/hooks/useLinkedList.js` — owns `nodes`/`log`/`activeId`/`traversing` state
  and every mutation (`insertHead`, `insertTail`, `insertAt`, `deleteNode`,
  `clearList`, `traverse`, `stopTraverse`). Node addresses are synthetic, assigned
  by an incrementing module-level counter (`nextAddress`) purely for visual flavor —
  they are not real memory addresses and don't need to be unique across remounts.
- `src/hooks/useTheme.js` — reads/writes `data-theme` on `<html>` and mirrors it to
  `localStorage` under the `llv-theme` key. `index.html` has an inline script that
  sets `data-theme` before React hydrates, to avoid a flash of the wrong theme.
- `src/components/` — presentational components. None of them own state beyond
  local UI state (e.g. `ControlPanel`'s input fields).

## Theming

Colors are never hardcoded as hex/rgb literals in components. The system is:

1. `src/index.css` defines RGB triplets (e.g. `--color-accent: 159 239 0`) under
   `:root, [data-theme="dark"]` and overrides under `[data-theme="light"]`.
2. `tailwind.config.js` exposes each variable as a Tailwind color via a
   `withOpacity()` helper, which is what makes opacity modifiers like
   `bg-accent/30` or `border-accent/40` work.
3. Components use the resulting semantic utility classes: `bg-canvas`,
   `bg-surface` / `bg-surface-alt`, `border-line` / `border-line-strong` /
   `border-line-hover` / `border-line-dashed`, `text-ink` / `text-ink-dim` /
   `text-ink-mute` / `text-ink-faint`, `text-accent` / `bg-accent-bg`, and the
   `danger-*` / `warn` / `info` family for log/status colors.

**When adding a new color or a new theme**: add the CSS variable in both
`:root`/`[data-theme="dark"]` and `[data-theme="light"]` blocks in `index.css`
first, then reference it from `tailwind.config.js` — never reach for an
arbitrary `bg-[#hex]` value in a component, since that silently breaks light
mode.

One exception: `NodeBlock.jsx`'s active-node glow uses a raw `shadow-[...]`
arbitrary value referencing `var(--color-accent)` directly (Tailwind has no
shadow-color theme key with opacity support the way it does for `bg`/`border`/
`text`). Follow that pattern if you need another theme-aware box-shadow.

## Conventions

- Functional components, no class components.
- Keep components presentational; put stateful logic in a hook under `src/hooks/`.
- Don't introduce a state management library — the app is small enough that
  hooks + prop drilling are sufficient.
