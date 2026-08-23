import { createAddressCounter } from "../../lib/addressCounter";

const nextAddress = createAddressCounter(0x6000);

export const makeNode = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
});

export const parentIndex = (i) => Math.floor((i - 1) / 2);
export const leftIndex = (i) => 2 * i + 1;
export const rightIndex = (i) => 2 * i + 2;

function siftDownPure(arr, i, n) {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let smallest = i;
    if (l < n && arr[l].value < arr[smallest].value) smallest = l;
    if (r < n && arr[r].value < arr[smallest].value) smallest = r;
    if (smallest === i) break;
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    i = smallest;
  }
}

export function buildHeap(values) {
  const arr = values.map(makeNode);
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDownPure(arr, i, arr.length);
  }
  return arr;
}

export function heapHeight(n) {
  return n === 0 ? 0 : Math.floor(Math.log2(n)) + 1;
}

// Positions each array slot as a node in a complete-binary-tree layout:
// depth from index, x centered within its level's column.
export function heapLayout(nodes) {
  const n = nodes.length;
  if (n === 0) return { positions: [], levelWidth: 1 };
  const maxDepth = Math.floor(Math.log2(n));
  const levelWidth = 2 ** maxDepth;

  const positions = nodes.map((node, i) => {
    const depth = Math.floor(Math.log2(i + 1));
    const levelStart = 2 ** depth - 1;
    const posInLevel = i - levelStart;
    const cols = 2 ** depth;
    const xUnit = (posInLevel + 0.5) * (levelWidth / cols);
    const pIdx = parentIndex(i);
    return {
      id: node.id,
      value: node.value,
      address: node.address,
      index: i,
      x: xUnit,
      y: depth,
      parentId: i === 0 ? null : nodes[pIdx]?.id ?? null,
    };
  });

  return { positions, levelWidth };
}
