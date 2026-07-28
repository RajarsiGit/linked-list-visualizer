# linked_list.visualizer

A terminal-styled, in-browser visualizer for singly-linked list operations. Insert,
delete, and traverse nodes while watching a live operation log and heap-style memory
addresses update in real time.

![status](https://img.shields.io/badge/status-active-9fef00)
![license](https://img.shields.io/badge/license-GPL--3.0-blue)

## Features

- **Insert / delete** nodes at the head, tail, or an arbitrary index
- **Traverse** the list with an animated pointer walk and step-by-step log output
- **Operation log** styled like a console/REPL, showing every mutation as it happens
- **Synthetic memory addresses** assigned to each node to reinforce the heap mental model
- **Light / dark theme toggle**, persisted across sessions and defaulting to your OS
  preference

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed local URL in your browser. The dev server supports hot reload, so
edits to any file under `src/` apply instantly.

### Other scripts

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Usage

The **commands** panel below the heap view drives every operation:

| Control       | Effect                                                          |
| ------------- | ---------------------------------------------------------------|
| `insert_head` | Inserts a new node with the given value at the head of the list |
| `insert_tail` | Inserts a new node with the given value at the tail of the list |
| `insert_at`   | Inserts at the index typed in the `idx` field (defaults to tail if blank) |
| `traverse`    | Animates a walk from head to the end, logging each visited node |
| `stop`        | Cancels an in-progress traversal                                |
| `clear`       | Empties the list                                                |

Hover a node to reveal its delete (`✕`) control. The theme toggle in the header
switches between the dark ("hacker terminal") and light ("paper terminal") palettes.

## Project structure

```
src/
  components/       Presentational components (NodeBlock, ControlPanel, OperationLog, ...)
  hooks/
    useLinkedList.js   List state + operations (insert/delete/traverse)
    useTheme.js        Theme state, persistence, and <html data-theme> sync
  App.jsx           Top-level composition
  index.css         Tailwind layers + theme CSS variables (dark/light)
```

Colors are defined once as CSS custom properties in [src/index.css](src/index.css)
and exposed to Tailwind as semantic tokens (`bg-surface`, `text-ink-mute`,
`border-line`, `text-accent`, etc.) in [tailwind.config.js](tailwind.config.js), so
adding a new theme means editing variables in one place rather than hunting through
components for hardcoded hex values.

## Tech stack

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
