import { createAddressCounter } from "../../lib/addressCounter";

const nextAddress = createAddressCounter(0x4000);

export const makeNode = (value) => ({
  id: crypto.randomUUID(),
  value,
  address: nextAddress(),
  left: null,
  right: null,
});

// Returns the sequence of node ids visited while descending toward `value`,
// plus whether the value was found and the node at that point (if any).
export function findPath(root, value) {
  const path = [];
  let cur = root;
  while (cur) {
    path.push(cur.id);
    if (value === cur.value) return { path, found: true, node: cur };
    cur = value < cur.value ? cur.left : cur.right;
  }
  return { path, found: false, node: null };
}

export function insertPure(root, value) {
  if (!root) return makeNode(value);
  if (value === root.value) return root;
  if (value < root.value) return { ...root, left: insertPure(root.left, value) };
  return { ...root, right: insertPure(root.right, value) };
}

export function deletePure(root, value) {
  if (!root) return root;
  if (value < root.value) return { ...root, left: deletePure(root.left, value) };
  if (value > root.value) return { ...root, right: deletePure(root.right, value) };

  if (!root.left) return root.right;
  if (!root.right) return root.left;

  let successor = root.right;
  while (successor.left) successor = successor.left;
  const newRight = deletePure(root.right, successor.value);
  return { ...root, value: successor.value, left: root.left, right: newRight };
}

export function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node);
  inorder(node.right, out);
  return out;
}

export function preorder(node, out = []) {
  if (!node) return out;
  out.push(node);
  preorder(node.left, out);
  preorder(node.right, out);
  return out;
}

export function postorder(node, out = []) {
  if (!node) return out;
  postorder(node.left, out);
  postorder(node.right, out);
  out.push(node);
  return out;
}

export function levelorder(root) {
  const out = [];
  if (!root) return out;
  const queue = [root];
  while (queue.length) {
    const n = queue.shift();
    out.push(n);
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
  return out;
}

export function treeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}

export function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

// Assigns each node an x slot via in-order position (so left subtrees stay
// left of right subtrees with no overlap) and a y slot via depth.
export function layoutTree(root) {
  const positions = [];
  let x = 0;
  function walk(node, depth, parentId) {
    if (!node) return;
    walk(node.left, depth + 1, node.id);
    positions.push({
      id: node.id,
      value: node.value,
      address: node.address,
      x: x++,
      y: depth,
      parentId,
    });
    walk(node.right, depth + 1, node.id);
  }
  walk(root, 0, null);
  return positions;
}
