import { TreeNode } from "../models/TreeNode";

export const generateGraph = (numNodes = 5, directed = false, weighted = true) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    label: String.fromCharCode(65 + i),
  }));
  const edges = [];
  const connected = new Set([0]);
  const pool = Array.from({ length: numNodes - 1 }, (_, i) => i + 1);

  while (pool.length > 0) {
    const targetIdx = Math.floor(Math.random() * pool.length);
    const target = pool.splice(targetIdx, 1)[0];
    const source =
      Array.from(connected)[Math.floor(Math.random() * connected.size)];
    const weight = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
    edges.push({ source, target, weight });
    connected.add(target);
  }

  for (let i = 0; i < 2; i++) {
    const s = Math.floor(Math.random() * numNodes);
    const t = Math.floor(Math.random() * numNodes);
    if (s !== t && !edges.some((e) => e.source === s && e.target === t)) {
      edges.push({
        source: s,
        target: t,
        weight: Math.floor(Math.random() * 9) + 1,
      });
    }
  }

  return { nodes, edges, directed, weighted };
};
//BST DATA
export const generateBSTData = (count = 7) => {
  const rootVal = Math.floor(Math.random() * 40) + 30;
  const root = new TreeNode(rootVal, "black");
  const values = [rootVal];

  for (let i = 0; i < count; i++) {
    const val = Math.floor(Math.random() * 100);
    if (values.includes(val)) continue;
    values.push(val);
    let curr = root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = new TreeNode(val, "red");
          curr.left.parent = curr;
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = new TreeNode(val, "red");
          curr.right.parent = curr;
          break;
        }
        curr = curr.right;
      }
    }
  }
  return { root, values };
};

export const generateRBTData = () => {
  const root = new TreeNode(50, "black");
  root.left = new TreeNode(25, "red");
  root.right = new TreeNode(75, "red");
  root.left.parent = root;
  root.right.parent = root;
  return { root };
};

export const generateHeapData = () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10);

export const generateSortData = (size = 6) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);

export const generateStackData = () => {
  const ops = [];
  const values = [];
  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.4 || values.length === 0) {
      const val = Math.floor(Math.random() * 99);
      ops.push({ type: "push", val });
      values.push(val);
    } else {
      ops.push({ type: "pop" });
      values.pop();
    }
  }
  return { ops, result: values };
};

export const generateHashData = (size = 7) => {
  const table = Array(size).fill(null);
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * size);
    while (table[idx] !== null) idx = (idx + 1) % size;
    table[idx] = Math.floor(Math.random() * 50) + 1;
  }
  return {
    table,
    key: Math.floor(Math.random() * 50) + 1,
    size,
    strategy: "Linear",
  };
};

export const generatePostfixData = () => {
  const ops = ["+", "-", "*"];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  return {
    expr: `${a} ${b} ${c} ${ops[Math.floor(Math.random() * 3)]} ${
      ops[Math.floor(Math.random() * 3)]
    }`,
  };
};
