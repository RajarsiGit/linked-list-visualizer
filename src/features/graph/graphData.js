export const NODES = [
  { id: "A", x: 80, y: 60 },
  { id: "B", x: 260, y: 40 },
  { id: "C", x: 440, y: 60 },
  { id: "D", x: 80, y: 220 },
  { id: "E", x: 260, y: 200 },
  { id: "F", x: 440, y: 220 },
  { id: "G", x: 170, y: 340 },
  { id: "H", x: 350, y: 340 },
];

export const EDGES = [
  ["A", "B", 4],
  ["A", "D", 1],
  ["B", "C", 3],
  ["B", "E", 2],
  ["C", "F", 5],
  ["D", "E", 2],
  ["D", "G", 6],
  ["E", "F", 1],
  ["E", "H", 3],
  ["F", "H", 2],
  ["G", "H", 4],
];

export function buildAdjacency() {
  const adj = Object.fromEntries(NODES.map((n) => [n.id, []]));
  for (const [a, b, w] of EDGES) {
    adj[a].push({ to: b, weight: w });
    adj[b].push({ to: a, weight: w });
  }
  for (const id of Object.keys(adj)) {
    adj[id].sort((x, y) => (x.to < y.to ? -1 : 1));
  }
  return adj;
}

export const edgeKey = (a, b) => [a, b].sort().join("-");
