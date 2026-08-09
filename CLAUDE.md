# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A multi-page React + Vite app that visualizes classic data structures and
algorithms (linked list, stack, queue, binary search tree, hash table,
min-heap, sorting algorithms, graph traversal/shortest-path) with a terminal
aesthetic. No backend, no persistence beyond the theme preference in
`localStorage`. Client-side routing via `react-router-dom`.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
```

There is no test suite and no linter configured. Verify changes by running
`npm run dev` and exercising the feature in the browser.

## Architecture

- `src/main.jsx` — mounts `<BrowserRouter>` and defines all `<Route>`s. Each
  DSA topic is a route nested under the shell `<App>` route (`index` = home
  page, e.g. `linked-list`, `stack`, `sorting/:algo`, `graph/:algo`).
- `src/App.jsx` — top-level shell only: theme state (`useTheme`) + the shared
  `Header` nav bar + `<Outlet />`. Keep it thin; it renders no page content.
- `src/pages/HomePage.jsx` — landing page listing every topic as a card,
  grouped under "data structures" / "algorithms". A topic's card is only
  clickable once its route exists; unbuilt topics render with a "soon" badge
  and `ready: false` in the `TOPICS` list.
- `src/features/<topic>/` — one folder per DSA topic (`linked-list`, `stack`,
  `queue`, `bst`, `hash-table`, `heap`, `sorting`, `graph`). Each contains:
  - `<Topic>Page.jsx` — composition only, analogous to the old `App.jsx`.
  - `use<Topic>.js` — owns all state and operations for that structure,
    built from the shared hooks below (`useOperationLog`, `useBusyFlag`)
    plus a topic-local `makeNode`/`nextAddress` from `createAddressCounter`.
  - `components/` — presentational components local to that topic only
    (e.g. `NodeBlock`, `StackFrame`, `TreeView`). Don't reach across feature
    folders to reuse one topic's presentational component in another; if a
    piece is genuinely generic, promote it to `src/components/` instead.
  - Pure algorithm/data helpers live in their own file (e.g. `bstUtils.js`,
    `heapUtils.js`, `sortAlgorithms.js`, `graphAlgorithms.js`) separate from
    the hook, so tree/graph layout and sort/traversal algorithms are testable
    independent of React state.
  - Node/frame/entry addresses are synthetic, assigned by a
    `createAddressCounter(start)` instance scoped per topic (e.g. `0x1000`
    for linked list, `0x2000` for stack, `0x3000` for queue, ...) purely for
    visual flavor — not real memory addresses, don't need to be unique
    across remounts or across topics.
- `src/lib/` — plain (non-React) utilities shared by every topic hook:
  - `sleep.js` — the `sleep(ms)` promise used to pace every animation step.
  - `addressCounter.js` — `createAddressCounter(start)` factory; call it once
    at module scope in a topic's hook file to get that topic's `nextAddress`.
- `src/hooks/` — shared React hooks:
  - `useTheme.js` — reads/writes `data-theme` on `<html>` and mirrors it to
    `localStorage` under the `llv-theme` key. `index.html` has an inline
    script that sets `data-theme` before React hydrates, to avoid a flash of
    the wrong theme.
  - `useOperationLog.js` — the `{ log, pushLog }` pair every topic hook
    returns; caps entries (default 60) and stamps each with a `crypto.
    randomUUID()` id. Pass the initial `[{text, kind}]` entries (if any) as
    the first argument.
  - `useBusyFlag.js` — the re-entrancy guard every animated operation needs.
    `guard(fn)` wraps an operation so a second call no-ops while one is
    in flight, and reliably releases the flag afterward **even if `fn`
    throws** (a `try/finally`, not present in the original hand-rolled
    `busyRef` pattern — that gap could leave a structure's controls locked
    up forever after an error). For an interruptible operation (a traversal
    with its own abort flag, stopped independently of its own completion),
    use `start()`/`stop()` directly instead of `guard()` — see `useLinkedList`
    or `useBST`'s `traverse`/`stopTraverse` for the pattern.
- `src/components/` — components shared across every page: `Header` (site
  nav bar), `ThemeToggle`, `PageHeader` (per-topic title + "← topics" back
  link), `Button` (the shared command-button style), `OperationLog` (the
  scrolling kind-tagged log panel), `StatsBar` (takes `stats: [{label, value,
  highlight?}]`), `EmptyState` (takes `title`/`subtitle`), `AlgoTabs` (takes
  `items` keyed by algorithm id + `current`/`basePath`/`disabled` — used by
  `sorting` and `graph`, the two topics with an algorithm switcher).

### Adding a new topic

1. Create `src/features/<topic>/` with `<Topic>Page.jsx`, `use<Topic>.js`,
   and a `components/` folder.
2. Add its route(s) in `src/main.jsx` inside the `<Route element={<App/>}>`
   block.
3. Flip its entry in `TOPICS` in `src/pages/HomePage.jsx` to `ready: true`.
4. Build `use<Topic>.js` from the shared primitives: `useOperationLog()` for
   `log`/`pushLog`, `useBusyFlag()` for `busy`/`guard`, `sleep()` from
   `src/lib/sleep.js` between animation steps, and `createAddressCounter()`
   for synthetic node addresses. Wrap **every** operation — including
   `clear*` — in `guard()` so it's a reentrancy-safe no-op while another
   operation is animating; wire the resulting `busy` into every button's
   `disabled` prop in the topic's `ControlPanel` (the one exception is a
   "stop" button for an interruptible traversal, which must stay clickable
   while `busy` is true). Reuse `StatsBar`/`EmptyState`/`AlgoTabs` from
   `src/components/` rather than writing topic-local copies.

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

One exception: active-node/frame glows use a raw `shadow-[...]` (or inline
`style={{ filter: "drop-shadow(...)" }}` for SVG) arbitrary value referencing
`var(--color-accent)` directly (Tailwind has no shadow-color theme key with
opacity support the way it does for `bg`/`border`/`text`, and SVG `filter`
isn't reachable via Tailwind classes at all). Follow that pattern if you need
another theme-aware glow.

SVG-based views (BST/heap tree layout, graph view) style nodes/edges with
Tailwind's `fill-*`/`stroke-*` utilities against the same semantic color
tokens — these work out of the box since `fill`/`stroke` pick up
`theme.colors` like any other utility.

## Conventions

- Functional components, no class components.
- Keep components presentational; put stateful logic in a `use<Topic>` hook.
- Don't introduce a state management library — each page's state is owned by
  its own hook; there's no cross-page shared state to justify one.
