import React, { useState, useEffect } from "react";
import {
  BookOpen,
  RefreshCw,
  CheckCircle,
  XCircle,
  Activity,
  GitBranch,
  Database,
  Layers,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Terminal,
  AlertTriangle,
  Search,
  Eye,
  BarChart,
  List,
  Cpu,
  Hash,
  TrendingUp,
} from "lucide-react";

// --- DATA STRUCTURE CLASSES ---

class TreeNode {
  constructor(val, color = "white") {
    this.val = val;
    this.left = null;
    this.right = null;
    this.color = color; // For RBT
    this.height = 1; // For AVL
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

// --- STATIC CODE ANALYZER ENGINE ---

const analyzeCode = (code, algoType) => {
  if (!code) return { detectedLang: "None", percentage: 0, feedback: [] };

  const codeLower = code
    .replace(/[^\x20-\x7E\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const feedback = [];
  let score = 0;
  let maxScore = 0;
  let detectedLang = "Pseudo-code";

  // 1. Language Detection
  if (
    codeLower.includes("->") ||
    codeLower.includes("cout") ||
    codeLower.includes("<vector>")
  ) {
    detectedLang = "C++";
  } else if (
    codeLower.includes("system.out") ||
    codeLower.includes("public void") ||
    codeLower.includes("arraylist")
  ) {
    detectedLang = "Java";
  } else if (codeLower.includes("def ") || codeLower.includes("self.")) {
    detectedLang = "Python";
  } else if (
    codeLower.includes(" for ") &&
    (codeLower.includes(" to ") || codeLower.includes(" downto "))
  ) {
    detectedLang = "Textbook Pseudocode";
  }

  const check = (keywords, message, weight = 1) => {
    maxScore += weight;
    const match = keywords.some((k) =>
      codeLower.includes(k.toLowerCase().trim())
    );
    if (match) {
      score += weight;
      feedback.push({ success: true, text: message });
    } else {
      feedback.push({ success: false, text: `Missing logic: ${message}` });
    }
  };

  // 2. Algorithm Fingerprinting
  if (algoType === "merge_sort") {
    check(["merge(", "merge_sort"], "Merge Function", 2);
    check(["floor", "/2", "mid"], "Midpoint", 2);
    check(["L[", "R["], "Subarrays", 2);
  } else if (algoType === "insertion_sort") {
    check(["for j", "for i"], "Main Loop", 2);
    check(["key", "value"], "Key Var", 2);
    check(["while", "> 0", "> key"], "Shift Loop", 3);
  } else if (algoType === "binary_search") {
    check(["low", "high", "mid"], "Bounds/Mid", 2);
    check(["<", ">", "=="], "Comparisons", 2);
  } else if (algoType.includes("bst_") || algoType.includes("tree_")) {
    if (algoType.includes("search")) {
      check(["<", ">", "key"], "Traversal Logic", 2);
    } else if (algoType.includes("order")) {
      check(["left", "right"], "Recursive Calls", 2);
      check(["print"], "Output", 1);
    }
  } else if (algoType.includes("rbt")) {
    check(["color", "red", "black"], "Color Props", 2);
    check(["rotate"], "Rotations", 2);
    check(["fixup"], "Fixup Logic", 2);
  } else if (algoType.includes("avl")) {
    check(["height", "balance"], "Balance Factor", 2);
    check(["rotate"], "Rotations", 2);
  } else if (algoType.includes("heap")) {
    check(["heap-size", "largest"], "Heap Properties", 2);
    check(["left", "right", "parent"], "Index Logic", 2);
    check(["exchange", "swap"], "Swap Logic", 2);
  } else if (algoType === "bfs") {
    check(["queue", "enqueue", "dequeue"], "Queue Ops", 3);
    check(["white", "gray", "black", "visited"], "Visited State", 2);
  } else if (algoType === "dfs") {
    check(["recurse", "visit"], "Recursion", 3);
    check(["white", "gray", "black", "visited"], "Visited State", 2);
  } else if (algoType === "dijkstra") {
    check(["relax"], "Relax Edge", 2);
    check(["priority", "min", "extract"], "Priority Queue", 3);
  } else if (algoType === "kruskal") {
    check(["sort", "weight", "increasing"], "Sort Edges", 2);
    check(["find", "union", "set"], "Disjoint Set / Union-Find", 3);
    check(["cycle"], "Cycle Detection", 2);
  } else if (algoType === "hashing") {
    check(["h(", "mod", "%"], "Hash Function", 2);
    check(["while", "repeat", "for"], "Probing Loop", 2);
    check(["nil", "null", "empty"], "Check Empty", 2);
  }

  // Generic
  check(["return", "if", "for", "while"], "Control Structures", 1);

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { detectedLang, percentage, feedback };
};

// --- GENERATORS ---

const generateGraph = (numNodes = 5, directed = false, weighted = true) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    label: String.fromCharCode(65 + i),
  }));
  const edges = [];
  const matrix = Array(numNodes)
    .fill(null)
    .map(() => Array(numNodes).fill(0));
  const connected = new Set([0]);
  const pool = Array.from({ length: numNodes - 1 }, (_, i) => i + 1);

  // Ensure connectivity first
  while (pool.length > 0) {
    const targetIdx = Math.floor(Math.random() * pool.length);
    const target = pool.splice(targetIdx, 1)[0];
    const source =
      Array.from(connected)[Math.floor(Math.random() * connected.size)];
    const weight = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
    edges.push({ source, target, weight });
    matrix[source][target] = weight;
    if (!directed) matrix[target][source] = weight;
    connected.add(target);
  }

  // Add a few random extra edges to make it interesting
  for (let i = 0; i < 3; i++) {
    const s = Math.floor(Math.random() * numNodes);
    const t = Math.floor(Math.random() * numNodes);
    if (s !== t && matrix[s][t] === 0) {
      const w = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
      edges.push({ source: s, target: t, weight: w });
      matrix[s][t] = w;
      if (!directed) matrix[t][s] = w;
    }
  }

  return { nodes, edges, matrix };
};

const generateBSTData = (count = 10) => {
  const rootVal = Math.floor(Math.random() * 40) + 30;
  const root = new TreeNode(rootVal);
  const values = [rootVal];
  for (let i = 0; i < count; i++) {
    const val = Math.floor(Math.random() * 100);
    if (values.includes(val)) continue;
    values.push(val);
    let curr = root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = new TreeNode(val);
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = new TreeNode(val);
          break;
        }
        curr = curr.right;
      }
    }
  }
  return {
    root,
    values,
    target: values[Math.floor(Math.random() * values.length)],
  };
};

const generateRBTData = () => {
  const root = new TreeNode(50, "black");
  root.left = new TreeNode(25, "red");
  root.right = new TreeNode(75, "red");
  root.left.left = new TreeNode(10, "black");
  root.left.right = new TreeNode(33, "black");
  root.right.left = new TreeNode(60, "black");
  root.right.right = new TreeNode(89, "black");
  return { root };
};

const generateHeapData = () => {
  return Array.from(
    { length: 7 },
    () => Math.floor(Math.random() * 50) + 10
  ).sort((a, b) => b - a);
};

const generateSortData = (size = 7) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
};

const generateListData = (size = 4) => {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
};

// NEW: Generator for Hash Table Data with Strategy
const generateHashData = (size = 7) => {
  const table = Array(size).fill(null);
  // Pre-fill about 50% of the table
  for (let i = 0; i < 3; i++) {
    let val = Math.floor(Math.random() * 50) + 1;
    let idx = val % size;
    // Simple linear probe to place initial values
    while (table[idx] !== null) {
      idx = (idx + 1) % size;
    }
    table[idx] = val;
  }

  // Pick a strategy
  const strategies = ["Linear", "Quadratic", "Double"];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];

  // Pick a key
  let key = Math.floor(Math.random() * 50) + 1;

  // Ensure the key collides initially to make the problem interesting
  // Find a filled spot
  const filledIndices = table
    .map((v, i) => (v !== null ? i : -1))
    .filter((i) => i !== -1);
  if (filledIndices.length > 0) {
    const targetIdx =
      filledIndices[Math.floor(Math.random() * filledIndices.length)];
    // Adjust key so key % size == targetIdx
    key = Math.floor(Math.random() * 5) * size + targetIdx;
  }

  return { table, key, size, strategy };
};

// --- ALGORITHMS ---

const algorithms = {
  // === GRAPHS ===
  bfs: {
    name: "BFS (Breadth-First Search)",
    category: "Graphs",
    signature: "BFS(G, s)",
    hint: "Use a Queue. Enqueue start. Mark nodes as visited (or Black) to prevent cycles.",
    solve: (data) => {
      if (!data || !data.matrix) return "";
      const queue = [0];
      const visited = new Set([0]);
      const res = [];
      while (queue.length) {
        const u = queue.shift();
        res.push(String.fromCharCode(65 + u));
        for (let v = 0; v < data.matrix.length; v++)
          if (data.matrix[u][v] > 0 && !visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
      }
      return res.join(", ");
    },
    question: "Perform BFS starting from Node A. List visited nodes.",
    code: `BFS(G, s)
  for each u in G.V - {s}
      u.color = WHITE, u.d = INF
  s.color = GRAY, s.d = 0, Q = {s}
  while Q != {}
      u = Dequeue(Q)
      for each v in G.Adj[u]
          if v.color == WHITE
              v.color = GRAY
              v.d = u.d + 1
              Enqueue(Q, v)
      u.color = BLACK`,
  },
  dfs: {
    name: "DFS (Depth-First Search)",
    category: "Graphs",
    signature: "DFS(G)",
    hint: "Recursively visit. Mark Gray on entry, Black on exit.",
    solve: (data) => {
      if (!data || !data.matrix) return "";
      const visited = new Set();
      const res = [];
      const t = (u) => {
        visited.add(u);
        res.push(String.fromCharCode(65 + u));
        for (let v = 0; v < data.matrix.length; v++)
          if (data.matrix[u][v] && !visited.has(v)) t(v);
      };
      t(0);
      return res.join(", ");
    },
    question: "Perform Pre-Order DFS starting from Node A.",
    code: `DFS(G)
  for each u in G.V u.color = WHITE
  time = 0
  for each u in G.V
      if u.color == WHITE DFS-Visit(G,u)

DFS-Visit(G,u)
  u.color = GRAY
  time = time + 1; u.d = time
  for each v in G.Adj[u]
      if v.color == WHITE DFS-Visit(G,v)
  u.color = BLACK; u.f = time + 1`,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    signature: "Dijkstra(G, w, s)",
    hint: "Maintain a set A of visited nodes. Relax edges (u,v) where u is in A and v is not.",
    solve: (data) => {
      if (!data || !data.matrix) return "";
      const n = data.nodes.length;
      const dist = Array(n).fill(Infinity);
      dist[0] = 0;
      const visited = Array(n).fill(false);
      for (let i = 0; i < n; i++) {
        let u = -1,
          min = Infinity;
        for (let k = 0; k < n; k++)
          if (!visited[k] && dist[k] < min) {
            min = dist[k];
            u = k;
          }
        if (u === -1) break;
        visited[u] = true;
        for (let v = 0; v < n; v++)
          if (data.matrix[u][v] && dist[u] + data.matrix[u][v] < dist[v])
            dist[v] = dist[u] + data.matrix[u][v];
      }
      return dist[n - 1] === Infinity ? "INF" : dist[n - 1];
    },
    question: "Shortest path distance from Node A to the last Node?",
    code: `Dijkstra(G, w, s)
  Init-Single-Source(G, s)
  S = {}; Q = G.V
  while Q != {}
      u = Extract-Min(Q)
      S = S U {u}
      for each v in G.Adj[u]
          Relax(u, v, w)
          
  // Note: Relax checks if d[v] > d[u] + w(u,v)`,
  },
  kruskal: {
    name: "Kruskal's Algorithm (MST)",
    category: "Graphs",
    signature: "MST-Kruskal(G, w)",
    hint: "Sort edges by weights. If adding edge doesn't create cycle, add to T.",
    solve: (data) => {
      if (!data || !data.edges) return 0;
      // Simple Union-Find implementation
      const parent = Array.from({ length: data.nodes.length }, (_, i) => i);
      const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
      const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
          parent[rootI] = rootJ;
          return true;
        }
        return false;
      };

      const sortedEdges = [...data.edges].sort((a, b) => a.weight - b.weight);
      let mstWeight = 0;

      for (let e of sortedEdges) {
        if (union(e.source, e.target)) {
          mstWeight += e.weight;
        }
      }
      return mstWeight;
    },
    question: "Calculate the Total Weight of the MST.",
    code: `Kruskal's Algorithm: Main Algorithmic Greedy Strategy
Input G=(V,E,w)
Sort the edges by their weights from smallest to largest.
T = {} is an empty tree.

While ( V(T) != V(G) )
    Let e=(u,v) be the cheapest edge
    If adding e to T doesn't create a cycle in T
        T <- T U {e}
    
    // (Implicitly remove e from consideration)
End While
Return T`,
  },

  // === TREES ===
  bst_inorder: {
    name: "BST In-Order",
    category: "Trees",
    signature: "Inorder-Tree-Walk(x)",
    hint: "Left -> Root -> Right.",
    solve: (data) => {
      if (!data || !data.root) return "";
      const res = [];
      const t = (n) => {
        if (!n) return;
        t(n.left);
        res.push(n.val);
        t(n.right);
      };
      t(data.root);
      return res.join(", ");
    },
    question: "List nodes in In-Order sequence.",
    code: `Inorder-Tree-Walk(x)
  if x != NIL
      Inorder-Tree-Walk(x.left)
      print x.key
      Inorder-Tree-Walk(x.right)`,
  },
  bst_search: {
    name: "BST Search",
    category: "Trees",
    signature: "Tree-Search(x, k)",
    hint: "k < x.key ? Left : Right.",
    solve: (data) => {
      if (!data || !data.values) return "N/A";
      return data.values.includes(data.target) ? "Found" : "Not Found";
    },
    question: (d) => `Will Tree-Search find ${d && d.target ? d.target : "?"}?`,
    code: `Tree-Search(x, k)
  if x == NIL or k == x.key
      return x
  if k < x.key
      return Tree-Search(x.left, k)
  else return Tree-Search(x.right, k)`,
  },
  bst_successor: {
    name: "BST Successor",
    category: "Trees",
    signature: "Tree-Successor(x)",
    hint: "Min of right subtree OR lowest ancestor where x is left child.",
    solve: (data) => {
      if (!data || !data.values) return "";
      const sorted = data.values.slice().sort((a, b) => a - b);
      const idx = sorted.indexOf(data.target);
      return idx < sorted.length - 1 ? sorted[idx + 1] : "NIL";
    },
    question: (d) => `Find Successor of ${d && d.target ? d.target : "?"}.`,
    code: `Tree-Successor(x)
  if x.right != NIL
      return Tree-Minimum(x.right)
  y = x.p
  while y != NIL and x == y.right
      x = y; y = y.p
  return y`,
  },
  bst_ops: {
    name: "BST Insert/Delete",
    category: "Trees",
    signature: "Tree-Insert(T, z)",
    hint: "Standard BST insertion logic.",
    solve: (d) => "Varies",
    question: "Code the Tree-Insert logic.",
    code: `Tree-Insert(T, z)
  y = NIL; x = T.root
  while x != NIL
      y = x
      if z.key < x.key x = x.left
      else x = x.right
  z.p = y
  if y == NIL T.root = z
  else if z.key < y.key y.left = z
  else y.right = z`,
  },
  rbt_ops: {
    name: "Red-Black Tree",
    category: "Trees",
    signature: "RB-Insert(T, z)",
    hint: "Insert Red, then Fixup.",
    solve: (d) => "Balanced",
    question: "Write logic for RB-Insert-Fixup.",
    code: `RB-Insert-Fixup(T, z)
  while z.p.color == RED
      if z.p == z.p.p.left
          y = z.p.p.right
          if y.color == RED
              z.p.color = BLACK; y.color = BLACK
              z.p.p.color = RED; z = z.p.p
          else ...`,
  },
  avl_ops: {
    name: "AVL Tree",
    category: "Trees",
    signature: "AVL-Insert(T, z)",
    hint: "Check balance factor, rotate if >1 or <-1.",
    solve: (d) => "Balanced",
    question: "Write rotation logic for AVL.",
    code: `AVL-Insert(T, z)
  // Insert...
  bf = height(left) - height(right)
  if bf > 1 and key < left.key
      return rightRotate(node)
  if bf < -1 and key > right.key
      return leftRotate(node)`,
  },
  heap_ops: {
    name: "Max-Heap Operations",
    category: "Trees",
    signature: "Max-Heapify(A, i)",
    hint: "Float down: swap with largest child.",
    solve: (d) => (d && d.length ? d[0] : ""),
    question: "What is the Max element (Root)?",
    code: `Max-Heapify(A, i)
  l = Left(i); r = Right(i); largest = i
  if l <= size and A[l] > A[i] largest = l
  if r <= size and A[r] > A[largest] largest = r
  if largest != i
      swap(A[i], A[largest])
      Max-Heapify(A, largest)`,
  },

  // === SORTING ===
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    signature: "Merge-Sort(A, p, r)",
    hint: "Divide, Conquer, Combine.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort this array.",
    code: `Merge-Sort(A, p, r)
  if p < r
      q = floor((p+r)/2)
      Merge-Sort(A, p, q)
      Merge-Sort(A, q+1, r)
      Merge(A, p, q, r)`,
  },
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    signature: "Insertion-Sort(A)",
    hint: "Insert A[j] into sorted A[1..j-1].",
    solve: (d) => {
      if (!d) return "";
      const a = [...d];
      const k = a[1];
      let j = 0;
      while (j >= 0 && a[j] > k) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = k;
      return a.join(", ");
    },
    question: "Perform first pass (insert 2nd element).",
    code: `Insertion-Sort(A)
      for j = 2 to A.length
        key = A[j]; i = j - 1
          while i > 0 and A[i] > key
        A[i+1] = A[i]
          i = i - 1
      A[i+1] = key`,
  },
  binary_search: {
    name: "Binary Search",
    category: "Sorting",
    signature: "Binary-Search(A, t)",
    hint: "Check mid. Recurse left or right.",
    solve: (d) =>
      d ? [...d].sort((a, b) => a - b)[Math.floor((d.length - 1) / 2)] : "",
    question: "Find the middle element of sorted version.",
    code: `Binary-Search(A, t, low, high)
  if low > high return NIL
  mid = floor((low+high)/2)
  if t == A[mid] return mid
  if t < A[mid] return Binary-Search(A, t, low, mid-1)
  else return Binary-Search(A, t, mid+1, high)`,
  },

  // === LINEAR ===
  stack_ops: {
    name: "Stack Operations",
    category: "Linear",
    signature: "Push(S, x)",
    hint: "LIFO. Increment top.",
    solve: (d) => "99",
    question: "Push(99). What is Top?",
    code: `Push(S, x)
  S.top = S.top + 1
  S[S.top] = x`,
  },
  queue_ops: {
    name: "Queue Operations",
    category: "Linear",
    signature: "Enqueue(Q, x)",
    hint: "FIFO. Enqueue at Tail.",
    solve: (d) => (d && d.length > 1 ? d[1] : ""),
    question: "Dequeue(), who is new Head?",
    code: `Enqueue(Q, x)
  Q[Q.tail] = x
  if Q.tail == Q.length Q.tail = 1
  else Q.tail = Q.tail + 1`,
  },

  // === HASHING ===
  hashing: {
    name: "Hashing (Open Addr)",
    category: "Hashing",
    signature: "Hash-Insert(T, k)",
    // Dynamic Hint based on Strategy
    hint: "Probe until empty slot found.",
    solve: (data) => {
      if (!data || !data.table) return "";
      const { table, key, size, strategy } = data;
      let i = 0;
      let idx = key % size;

      // Secondary hash for double hashing: h2(k) = 1 + (k % (m-1))
      const h2 = 1 + (key % (size - 1));

      // Simulate probing
      while (table[idx] !== null && i < size * 2) {
        // limit loop to prevent freeze
        i++;
        if (strategy === "Linear") {
          idx = (key + i) % size;
        } else if (strategy === "Quadratic") {
          idx = (key + i * i) % size;
        } else if (strategy === "Double") {
          idx = (key + i * h2) % size;
        }
      }

      return i < size * 2 ? idx : "Overflow";
    },
    question: (data) => {
      if (!data) return "Insert key ?";
      const { key, size, strategy } = data;
      if (strategy === "Linear")
        return `Linear Probing: Insert key ${key}. h(k,i) = (k + i) % ${size}`;
      if (strategy === "Quadratic")
        return `Quadratic Probing: Insert key ${key}. h(k,i) = (k + i²) % ${size}`;
      if (strategy === "Double")
        return `Double Hashing: Insert key ${key}. h(k,i) = (k + i*h2(k)) % ${size}, where h2(k)=1+(k%${
          size - 1
        })`;
      return "Insert key";
    },
    code: `// Open Addressing Logic
Hash-Insert(T, k)
  i = 0
  repeat
      // Strategies:
      // Linear:    j = (k + i) % m
      // Quadratic: j = (k + c1*i + c2*i^2) % m
      // Double:    j = (h1(k) + i*h2(k)) % m
      
      if T[j] == NIL
          T[j] = k; return j
      else i = i + 1
  until i == m
  error "hash table overflow"`,
  },

  // === COMPLEXITY ===
  complexity: {
    name: "Complexity Quiz",
    category: "Theory",
    signature: "Big-O",
    hint: "Count loops.",
    solve: (d) => (d && d.answer ? d.answer : ""),
    question: (d) => `Complexity of ${d && d.algo ? d.algo : "..."}?`,
    code: `// Cheat Sheet:
// Merge Sort: O(n lg n)
// Activity Selection: O(n)
// Rod Cutting: O(n^2)
// BST Search: O(n)`,
  },
};

// --- VISUALIZERS ---

const TreeVisualizer = ({ root, highlight }) => {
  if (!root)
    return <div className="text-slate-400 p-8 text-center">No Tree Data</div>;
  const levels = [];
  const traverse = (node, depth, x, spread) => {
    if (!node) return;
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push({
      x,
      y: 40 + depth * 60,
      val: node.val,
      color: node.color,
      id: node.id,
    });
    traverse(node.left, depth + 1, x - spread, spread / 2);
    traverse(node.right, depth + 1, x + spread, spread / 2);
  };
  traverse(root, 0, 200, 100);

  const renderLines = (node, depth, x, spread) => {
    if (!node) return [];
    const lines = [];
    if (node.left)
      lines.push(
        <line
          key={`l-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x - spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />,
        ...renderLines(node.left, depth + 1, x - spread, spread / 2)
      );
    if (node.right)
      lines.push(
        <line
          key={`r-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x + spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />,
        ...renderLines(node.right, depth + 1, x + spread, spread / 2)
      );
    return lines;
  };

  return (
    <svg width="400" height="350" className="mx-auto overflow-visible">
      {renderLines(root, 0, 200, 100)}
      {levels.flat().map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="16"
            fill={
              n.val === highlight
                ? "#fef3c7"
                : n.color === "red"
                ? "#fee2e2"
                : n.color === "black"
                ? "#334155"
                : "white"
            }
            stroke={
              n.val === highlight
                ? "#d97706"
                : n.color === "red"
                ? "#ef4444"
                : n.color === "black"
                ? "#0f172a"
                : "#3b82f6"
            }
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y}
            dy="5"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={n.color === "black" ? "white" : "#1e293b"}
          >
            {n.val}
          </text>
        </g>
      ))}
    </svg>
  );
};

// FIX: Added explicit array check to prevent crash if data is null/object
const HeapVisualizer = ({ data }) => {
  if (!data || !Array.isArray(data))
    return <div className="text-slate-400 p-8 text-center">No Heap Data</div>;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 justify-center">
        {data.map((v, i) => (
          <div
            key={i}
            className="w-10 h-10 border flex items-center justify-center rounded-full bg-orange-100 border-orange-300 font-bold text-orange-800"
          >
            {v}
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500">Array Representation</div>
    </div>
  );
};

const ArrayVisualizer = ({ data, label }) => {
  if (!data || !Array.isArray(data))
    return <div className="text-slate-400 p-8 text-center">No Data</div>;
  const nums = data.filter((n) => typeof n === "number");
  const maxVal = nums.length ? Math.max(...nums, 50) : 50;
  return (
    <div className="flex flex-col h-full">
      {label && (
        <div className="text-xs text-slate-500 mb-2 text-center">{label}</div>
      )}
      <div className="flex items-end justify-center gap-1 h-full w-full px-4 pb-4">
        {data.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-8">
            {typeof val === "number" ? (
              <div
                className="w-full bg-indigo-500 rounded-t"
                style={{ height: `${(val / maxVal) * 100}%` }}
              ></div>
            ) : (
              <span className="text-xs">{val}</span>
            )}
            {typeof val === "number" && (
              <span className="text-xs font-mono text-slate-500">{val}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// NEW: Hash Visualizer to show table slots
const HashVisualizer = ({ data }) => {
  if (!data || !data.table)
    return <div className="text-slate-400 p-8">No Hash Data</div>;
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-2 font-bold text-indigo-600">Key: {data.key}</div>
      <div className="text-xs text-slate-500 mb-4 bg-slate-100 px-2 py-1 rounded">
        Strategy: <span className="font-bold">{data.strategy}</span>
      </div>
      <div className="flex gap-1 border p-2 rounded bg-slate-50">
        {data.table.map((val, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 border border-slate-300 flex items-center justify-center font-mono text-sm shadow-sm
                            ${
                              val === null
                                ? "bg-white text-slate-300"
                                : "bg-indigo-100 text-indigo-800 font-bold"
                            }`}
            >
              {val === null ? "∅" : val}
            </div>
            <span className="text-xs text-slate-500 mt-1">{i}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-400 mt-2">Size m = {data.size}</div>
    </div>
  );
};

const GraphVisualizer = ({ data, directed }) => {
  if (!data || !data.nodes)
    return <div className="text-slate-400 p-8">No Graph Data</div>;

  // Simple spring-like layout generator (circular)
  const radius = 120;
  const centerX = 200;
  const centerY = 175;

  const nodePos = data.nodes.map((n, i) => {
    const angle = (i / data.nodes.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...n,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <svg width="400" height="350" className="mx-auto">
      {/* Edges */}
      {data.edges.map((e, i) => {
        const s = nodePos.find((n) => n.id === e.source);
        const t = nodePos.find((n) => n.id === e.target);
        if (!s || !t) return null;
        return (
          <g key={i}>
            <line
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {e.weight > 1 && (
              <text
                x={(s.x + t.x) / 2}
                y={(s.y + t.y) / 2}
                fill="#64748b"
                fontSize="10"
                className="bg-white"
              >
                {e.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodePos.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="18"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y}
            dy="5"
            textAnchor="middle"
            fontWeight="bold"
            fill="#1e293b"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// FIX: Added explicit array check to prevent crash if data is object/null
const ListVisualizer = ({ data }) => (
  <div className="flex gap-2 justify-center p-8">
    {data && Array.isArray(data) ? (
      data.map((v, i) => (
        <div key={i} className="p-2 border rounded">
          {v}
        </div>
      ))
    ) : (
      <div className="text-slate-400">No List Data</div>
    )}
  </div>
);

// --- MAIN COMPONENT ---

export default function DSAExamPrep() {
  const [activeAlgo, setActiveAlgo] = useState("bfs");
  const [problemData, setProblemData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [codeReport, setCodeReport] = useState(null);

  const currentAlgo = algorithms[activeAlgo] || algorithms["bfs"];

  const generateNewProblem = () => {
    setFeedback(null);
    setShowSolution(false);
    setShowTrace(false);
    setShowHint(false);
    setUserAnswer("");
    setCodeReport(null);
    setUserCode(
      currentAlgo.signature + "\n    // Write your implementation here...\n"
    );

    const cat = currentAlgo.category;
    if (cat === "Graphs")
      setProblemData(generateGraph(5, activeAlgo === "dfs", true));
    else if (cat === "Trees")
      setProblemData(
        activeAlgo.includes("heap")
          ? generateHeapData()
          : activeAlgo.includes("rbt")
          ? generateRBTData()
          : generateBSTData(7)
      );
    else if (cat === "Sorting") setProblemData(generateSortData(7));
    else if (cat === "Linear") setProblemData(generateListData(4));
    else if (cat === "Hashing")
      setProblemData(generateHashData(7)); // New Hashing Data
    else if (cat === "Theory") {
      const qs = [
        { algo: "Activity Selection", answer: "O(n)" },
        { algo: "Rod Cutting", answer: "O(n^2)" },
      ];
      setProblemData(qs[Math.floor(Math.random() * qs.length)]);
    }
  };

  useEffect(() => {
    generateNewProblem();
  }, [activeAlgo]);

  const checkAnswer = () => {
    if (!problemData) return;
    const correct = String(currentAlgo.solve(problemData));
    const userClean = userAnswer.replace(/[^a-zA-Z0-9,]/g, "").trim();
    const correctClean = correct.replace(/[^a-zA-Z0-9,]/g, "").trim();
    setFeedback(userClean === correctClean ? "correct" : "incorrect");
    if (currentAlgo.category !== "Theory")
      setCodeReport(analyzeCode(userCode, activeAlgo));
  };

  const renderVisualizer = () => {
    // Null checks for all visualizers to prevent crashes
    if (!problemData) return <div>Loading...</div>;
    const cat = currentAlgo.category;

    if (cat === "Graphs")
      return (
        <GraphVisualizer data={problemData} directed={activeAlgo === "dfs"} />
      );
    if (activeAlgo.includes("heap"))
      return <HeapVisualizer data={problemData} />;
    if (cat === "Trees")
      return (
        <TreeVisualizer
          root={problemData.root}
          highlight={problemData.target}
        />
      );
    if (cat === "Sorting") return <ArrayVisualizer data={problemData} />;
    if (cat === "Linear") return <ListVisualizer data={problemData} />;
    if (cat === "Hashing") return <HashVisualizer data={problemData} />;

    return (
      <div className="text-6xl text-slate-200 text-center font-bold">?</div>
    );
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden flex flex-col md:flex-row">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Activity />
            <span>DSA Prep</span>
          </div>
        </div>
        <div className="p-4 space-y-6">
          <SidebarSection
            title="Graphs"
            items={["bfs", "dfs", "dijkstra", "kruskal"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<GitBranch size={16} />}
          />
          <SidebarSection
            title="Trees"
            items={[
              "bst_inorder",
              "bst_search",
              "bst_successor",
              "bst_ops",
              "rbt_ops",
              "avl_ops",
              "heap_ops",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Database size={16} />}
          />
          <SidebarSection
            title="Sorting"
            items={["merge_sort", "insertion_sort", "binary_search"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<BarChart size={16} />}
          />
          <SidebarSection
            title="Linear"
            items={["stack_ops", "queue_ops"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<List size={16} />}
          />
          <SidebarSection
            title="Hashing"
            items={["hashing"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Hash size={16} />}
          />
          {/* Removed Greedy & DP section */}
          <SidebarSection
            title="Theory"
            items={["complexity"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Cpu size={16} />}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">
            {currentAlgo.name}
          </h1>
          <button
            onClick={generateNewProblem}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium text-sm"
          >
            <RefreshCw size={16} /> New Problem
          </button>
        </header>

        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
            <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px] shrink-0">
                <div className="bg-slate-50 border-b border-slate-100 p-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-center shrink-0">
                  Visualization
                </div>
                <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                  {renderVisualizer()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 shrink-0">
                <h3 className="font-bold text-lg mb-2">Question</h3>
                <p className="text-slate-600 mb-4">
                  {typeof currentAlgo.question === "function"
                    ? currentAlgo.question(problemData)
                    : currentAlgo.question}
                </p>
                {showHint && (
                  <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded border border-amber-200">
                    Hint: {currentAlgo.hint}
                  </div>
                )}
                {showTrace && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <span className="font-bold">Answer: </span>
                    {String(currentAlgo.solve(problemData))}
                  </div>
                )}
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setFeedback(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    className="border p-2 rounded flex-1"
                    placeholder="Enter answer..."
                  />
                  <button
                    onClick={checkAnswer}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Check
                  </button>
                </div>
                {feedback && (
                  <div
                    className={`mt-2 flex items-center gap-2 font-bold ${
                      feedback === "correct" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {feedback === "correct" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}{" "}
                    {feedback === "correct" ? "Correct!" : "Incorrect"}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-slate-500 hover:text-indigo-600"
                  >
                    Show Hint
                  </button>
                  <button
                    onClick={() => setShowTrace(!showTrace)}
                    className="text-xs text-slate-500 hover:text-indigo-600"
                  >
                    {showTrace ? "Hide" : "Show"} Answer
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-slate-700 min-h-0">
                <div className="bg-[#252526] p-3 border-b border-[#333] flex justify-between items-center shrink-0">
                  <span className="font-mono text-xs text-purple-400">
                    Code Editor
                  </span>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {showSolution ? "Hide Key" : "Reveal Key"}
                  </button>
                </div>
                <div className="flex-1 relative font-mono text-sm overflow-hidden">
                  {showSolution ? (
                    <div className="absolute inset-0 p-4 text-[#d4d4d4] overflow-auto whitespace-pre-wrap">
                      {currentAlgo.code}
                    </div>
                  ) : (
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 resize-none outline-none"
                      spellCheck="false"
                    />
                  )}
                </div>
              </div>
              {codeReport && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 shrink-0 max-h-[40%] overflow-y-auto">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Search size={16} /> Analysis: {codeReport.detectedLang}
                  </h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${codeReport.percentage}%` }}
                    ></div>
                  </div>
                  {codeReport.feedback.map((f, i) => (
                    <div
                      key={i}
                      className={`text-xs p-1 ${
                        f.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {f.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SidebarSection = ({ title, items, active, set, icon }) => (
  <div className="mb-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">
      {title}
    </h3>
    {items.map((id) => (
      <button
        key={id}
        onClick={() => set(id)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
          active === id
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        {icon}{" "}
        <span className="capitalize">
          {id === "kruskal"
            ? "MST (Kruskal)"
            : id.replace(/_/g, " ").replace("dp", "DP")}
        </span>
      </button>
    ))}
  </div>
);
