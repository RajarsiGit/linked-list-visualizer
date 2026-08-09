export const ALGO_INFO = {
  bfs: { label: "bfs", desc: "breadth-first search · queue-based" },
  dfs: { label: "dfs", desc: "depth-first search · stack/recursion-based" },
  dijkstra: { label: "dijkstra", desc: "shortest paths · greedy relaxation" },
};

function* bfs(adj, start) {
  const visited = new Set([start]);
  yield { type: "visit", node: start };
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const { to } of adj[cur]) {
      if (!visited.has(to)) {
        visited.add(to);
        yield { type: "parent", from: cur, to };
        yield { type: "visit", node: to };
        queue.push(to);
      }
    }
  }
}

function* dfsWalk(adj, node, visited) {
  visited.add(node);
  yield { type: "visit", node };
  for (const { to } of adj[node]) {
    if (!visited.has(to)) {
      yield { type: "parent", from: node, to };
      yield* dfsWalk(adj, to, visited);
    }
  }
}

function* dfs(adj, start) {
  yield* dfsWalk(adj, start, new Set());
}

function* dijkstra(adj, start, nodeIds) {
  const dist = Object.fromEntries(nodeIds.map((id) => [id, Infinity]));
  dist[start] = 0;
  const visited = new Set();
  yield { type: "visit", node: start, dist: 0 };

  while (visited.size < nodeIds.length) {
    let u = null;
    let best = Infinity;
    for (const id of nodeIds) {
      if (!visited.has(id) && dist[id] < best) {
        best = dist[id];
        u = id;
      }
    }
    if (u === null) break;
    visited.add(u);
    if (u !== start) yield { type: "visit", node: u, dist: dist[u] };

    for (const { to, weight } of adj[u]) {
      if (visited.has(to)) continue;
      const nd = dist[u] + weight;
      if (nd < dist[to]) {
        dist[to] = nd;
        yield { type: "relax", from: u, to, dist: nd };
      }
    }
  }
}

export const ALGO_FNS = { bfs, dfs, dijkstra };
