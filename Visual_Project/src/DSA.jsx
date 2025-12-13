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
  Calculator,
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
  // ... (Existing checks kept, adding new ones) ...
  if (algoType.includes("quick_sort")) {
    check(["partition", "pivot"], "Partition Logic", 2);
    check(["swap", "temp"], "Swap Logic", 2);
    check(["<", ">"], "Comparison", 2);
  } else if (algoType === "linear_search") {
    check(["for", "while"], "Loop", 2);
    check(["==", "equals"], "Comparison", 2);
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

  // Add random edges
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

const generateHashData = (size = 7) => {
  const table = Array(size).fill(null);
  for (let i = 0; i < 3; i++) {
    let val = Math.floor(Math.random() * 50) + 1;
    let idx = val % size;
    while (table[idx] !== null) {
      idx = (idx + 1) % size;
    }
    table[idx] = val;
  }
  const strategies = ["Linear", "Quadratic", "Double"];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  let key = Math.floor(Math.random() * 50) + 1;
  // Ensure collision logic
  const filledIndices = table
    .map((v, i) => (v !== null ? i : -1))
    .filter((i) => i !== -1);
  if (filledIndices.length > 0) {
    const targetIdx =
      filledIndices[Math.floor(Math.random() * filledIndices.length)];
    key = Math.floor(Math.random() * 5) * size + targetIdx;
  }
  return { table, key, size, strategy };
};

// NEW: Generator for Postfix Expressions
const generatePostfixData = () => {
  const ops = ["+", "-", "*"];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  const op1 = ops[Math.floor(Math.random() * ops.length)];
  const op2 = ops[Math.floor(Math.random() * ops.length)];
  // Simple a b op c op format
  return {
    expr: `${a} ${b} ${op1} ${c} ${op2}`,
    hint: `Push operands. On operator, pop two, eval, push result.`,
  };
};

// --- ALGORITHMS ---

const algorithms = {
  // === GRAPHS ===
  bfs: {
    name: "BFS (Breadth-First Search)",
    category: "Graphs",
    signature: "BFS(G, s)",
    hint: "Use a Queue. Mark visited.",
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
    question: "List BFS traversal order starting from A.",
    code: `BFS(G, s)
  for each u in G.V - {s} u.color = WHITE
  s.color = GRAY; Q = {s}
  while Q != {}
      u = Dequeue(Q)
      for each v in G.Adj[u]
          if v.color == WHITE
              v.color = GRAY
              Enqueue(Q, v)
      u.color = BLACK`,
  },
  dfs: {
    name: "DFS (Depth-First Search)",
    category: "Graphs",
    signature: "DFS(G)",
    hint: "Recursion. Mark Gray/Black.",
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
    question: "List Pre-Order DFS starting from A.",
    code: `DFS(G)
  for each u in G.V u.color = WHITE
  time = 0
  for each u in G.V
      if u.color == WHITE DFS-Visit(G,u)`,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    signature: "Dijkstra(G, w, s)",
    hint: "Relax edges. Priority Queue.",
    solve: (data) => {
      if (!data || !data.matrix) return "INF";
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
    question: "Shortest distance from A to Last Node?",
    code: `Dijkstra(G, w, s)
  Init-Single-Source(G, s)
  S = {}; Q = G.V
  while Q != {}
      u = Extract-Min(Q)
      S = S U {u}
      for each v in G.Adj[u]
          Relax(u, v, w)`,
  },
  kruskal: {
    name: "Kruskal's Algorithm (MST)",
    category: "Graphs",
    signature: "MST-Kruskal(G, w)",
    hint: "Sort edges, Union-Find, avoid cycles.",
    solve: (data) => {
      if (!data || !data.edges) return 0;
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
        if (union(e.source, e.target)) mstWeight += e.weight;
      }
      return mstWeight;
    },
    question: "Total Weight of MST?",
    code: `MST-Kruskal(G, w)
  A = {}
  for each v in G.V Make-Set(v)
  sort edges of G.E by weight w
  for each (u, v) in G.E
      if Find-Set(u) != Find-Set(v)
          A = A U {(u, v)}
          Union(u, v)
  return A`,
  },

  // === SEARCHING (NEW) ===
  linear_search: {
    name: "Linear Search",
    category: "Searching",
    signature: "linearSearch(arr, target)",
    hint: "Iterate 0 to n-1.",
    solve: (d) => {
      if (!d) return -1;
      // searching for median element just to have a target
      const t = d[Math.floor(d.length / 2)];
      return d.indexOf(t);
    },
    question: (d) => `Index of ${d ? d[Math.floor(d.length / 2)] : "x"}?`,
    code: `public class Search {
    public static int linearSearch(int[] arr, int target) {
        for(int i=0; i<arr.length; i++) {
            if(arr[i] == target) return i;
        }
        return -1;
    }
    // Main program to test
    public static void main(String[] args) {
        int[] data = {5, 2, 9, 1, 5, 6}; // Random list
        int target = 9;
        System.out.println("Index: " + linearSearch(data, target));
    }
}`,
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    signature: "Binary-Search(A, t)",
    hint: "Sorted array. Compare mid.",
    solve: (d) => (d ? Math.floor(d.length / 2) : -1), // We simulate finding the middle of sorted
    question: "Index of median element (in sorted array)?",
    code: `public static int binarySearch(int[] arr, int t) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == t) return mid;
        if (arr[mid] < t) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
  },

  // === SORTING (UPDATED) ===
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    signature: "Insertion-Sort(A)",
    hint: "Insert A[j] into sorted A[0..j-1].",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    code: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
  selection_sort: {
    name: "Selection Sort",
    category: "Sorting",
    signature: "Selection-Sort(A)",
    hint: "Find min in unsorted part, swap to end of sorted part.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    code: `public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < arr.length; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
  },
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    signature: "Merge-Sort(A, p, r)",
    hint: "Divide, Conquer, Combine.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    code: `// Main program to test
public static void main(String[] args) {
    int[] arr = {12, 11, 13, 5, 6, 7};
    mergeSort(arr, 0, arr.length-1);
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[] = new int[n1];
    int R[] = new int[n2];
    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
    // Merge...
}`,
  },
  quick_sort: {
    name: "Quick Sort",
    category: "Sorting",
    signature: "QuickSort(A, p, r)",
    hint: "Partition around pivot.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low-1);
    for (int j=low; j<high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
    return i+1;
}

void sort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        sort(arr, low, pi-1);
        sort(arr, pi+1, high);
    }
}`,
  },
  randomized_quick_sort: {
    name: "Rand QuickSort",
    category: "Sorting",
    signature: "Randomized-Partition(A, p, r)",
    hint: "Swap pivot with random element first.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    code: `int randomizedPartition(int arr[], int low, int high) {
    int r = (int)(Math.random() * (high-low+1)) + low;
    int temp = arr[r];
    arr[r] = arr[high];
    arr[high] = temp;
    return partition(arr, low, high);
}`,
  },

  // === RECURRENCES (PDF Problems) ===
  recurrence_a: {
    name: "Recurrence 1(a)",
    category: "Recurrences",
    signature: "T(n) = 2T(n/4) + sqrt(n)",
    hint: "Master Theorem. a=2, b=4, f(n)=n^0.5.",
    solve: (d) => "Theta(sqrt(n) log n)",
    question: "Solve T(n) = 2T(n/4) + sqrt(n)",
    code: `// n^{log_4 2} = n^{0.5} = sqrt(n)
// f(n) = sqrt(n)
// Case 2: T(n) = Theta(sqrt(n) * log n)`,
  },
  recurrence_c: {
    name: "Recurrence 1(c)",
    category: "Recurrences",
    signature: "T(n) = 4T(n/2) + sqrt(n)",
    hint: "Master Theorem. a=4, b=2. Compare n^2 vs n^0.5.",
    solve: (d) => "Theta(n^2)",
    question: "Solve T(n) = 4T(n/2) + sqrt(n)",
    code: `// n^{log_2 4} = n^2
// f(n) = n^0.5
// Case 1: f(n) is polynomially smaller than n^2
// T(n) = Theta(n^2)`,
  },
  recurrence_j: {
    name: "Recurrence 1(j)",
    category: "Recurrences",
    signature: "J(n) = J(n/2)+J(n/3)+J(n/6)+n",
    hint: "Akra-Bazzi or Sum of coeffs (1/2 + 1/3 + 1/6 = 1).",
    solve: (d) => "Theta(n log n)",
    question: "Solve J(n)...",
    code: `// 1/2 + 1/3 + 1/6 = 1
// Behave like MergeSort/QuickSort split
// T(n) = Theta(n log n)`,
  },

  // === STACKS & QUEUES ===
  stack_ops: {
    name: "Stack Operations",
    category: "Linear",
    signature: "Push(S, x)",
    hint: "LIFO.",
    solve: (d) => "99",
    question: "Push(99). What is Top?",
    code: `Push(S, x) { S.top++; S[S.top] = x; }`,
  },
  queue_ops: {
    name: "Queue Operations",
    category: "Linear",
    signature: "Enqueue(Q, x)",
    hint: "FIFO.",
    solve: (d) => (d && d.length > 1 ? d[1] : ""),
    question: "Dequeue(), new Head?",
    code: `Enqueue(Q, x) { Q[tail] = x; tail++; }`,
  },
  postfix_eval: {
    name: "Postfix Eval (Weiss)",
    category: "Linear",
    signature: "evalPostfix(exp)",
    hint: "Push operands. Pop 2 on operator.",
    solve: (d) => {
      if (!d) return 0;
      const tokens = d.expr.split(" ");
      const stack = [];
      for (let t of tokens) {
        if (!isNaN(t)) stack.push(Number(t));
        else {
          const b = stack.pop(),
            a = stack.pop();
          if (t === "+") stack.push(a + b);
          if (t === "-") stack.push(a - b);
          if (t === "*") stack.push(a * b);
        }
      }
      return stack[0];
    },
    question: (d) => `Evaluate: ${d ? d.expr : ""}`,
    code: `// Weiss 3.22 / Postfix Eval
public int eval(String[] tokens) {
    Stack<Integer> s = new Stack<>();
    for(String t : tokens) {
        if(isNum(t)) s.push(Integer.parseInt(t));
        else {
            int b = s.pop(), a = s.pop();
            s.push(apply(t, a, b));
        }
    }
    return s.pop();
}`,
  },

  // === TREES & HASHING (Existing) ===
  bst_inorder: {
    name: "BST In-Order",
    category: "Trees",
    signature: "Inorder(x)",
    hint: "L-Root-R",
    solve: (d) => {
      if (!d || !d.root) return "";
      const res = [];
      const t = (n) => {
        if (n) {
          t(n.left);
          res.push(n.val);
          t(n.right);
        }
      };
      t(d.root);
      return res.join(", ");
    },
    question: "In-Order Sequence?",
    code: `Inorder(x) { if x!=NIL { Inorder(x.left); print x; Inorder(x.right); } }`,
  },
  bst_search: {
    name: "BST Search",
    category: "Trees",
    signature: "Search(x, k)",
    hint: "k < x.key ? left : right",
    solve: (d) => (d && d.values.includes(d.target) ? "Found" : "Not Found"),
    question: (d) => `Search for ${d ? d.target : "x"}.`,
    code: `Search(x, k) { 
    if x==NIL or k==x.key return x;
    if k < x.key return Search(x.left, k);
    else return Search(x.right, k); 
}`,
  },
  heap_ops: {
    name: "Max-Heapify",
    category: "Trees",
    signature: "Max-Heapify(A, i)",
    hint: "Float down largest.",
    solve: (d) => (d && d.length ? d[0] : ""),
    question: "Root after Heapify?",
    code: `MaxHeapify(A, i) {
   l = left(i); r = right(i);
   largest = (A[l] > A[i]) ? l : i;
   if (A[r] > A[largest]) largest = r;
   if (largest != i) { swap(A[i], A[largest]); MaxHeapify(A, largest); }
}`,
  },
  hashing: {
    name: "Hashing (Open Addr)",
    category: "Hashing",
    signature: "Hash-Insert(T, k)",
    hint: "Probe until empty.",
    solve: (data) => {
      if (!data || !data.table) return "";
      const { table, key, size, strategy } = data;
      let i = 0;
      let idx = key % size;
      const h2 = 1 + (key % (size - 1));
      while (table[idx] !== null && i < size * 2) {
        i++;
        if (strategy === "Linear") idx = (key + i) % size;
        else if (strategy === "Quadratic") idx = (key + i * i) % size;
        else if (strategy === "Double") idx = (key + i * h2) % size;
      }
      return i < size * 2 ? idx : "Overflow";
    },
    question: (d) => `Insert ${d ? d.key : 0} using ${d ? d.strategy : ""}.`,
    code: `// CLRS 11.4 Open Addressing
hash(k, i) {
  // Linear: (h'(k) + i) % m
  // Quadratic: (h'(k) + c1*i + c2*i^2) % m
  // Double: (h1(k) + i*h2(k)) % m
}`,
  },
  // Added Complexity
  complexity: {
    name: "Complexity Quiz",
    category: "Recurrences",
    signature: "Big-O",
    hint: "Analyze loops.",
    solve: (d) => (d ? d.answer : ""),
    question: (d) => `Complexity of ${d ? d.algo : ""}?`,
    code: `// Cheat Sheet
// Merge Sort: O(n log n)
// Quick Sort: O(n^2) worst, O(n log n) avg
// Heapsort: O(n log n)`,
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
    return [
      node.left && (
        <line
          key={`l-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x - spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      ),
      ...renderLines(node.left, depth + 1, x - spread, spread / 2),
      node.right && (
        <line
          key={`r-${node.id}`}
          x1={x}
          y1={40 + depth * 60}
          x2={x + spread}
          y2={40 + (depth + 1) * 60}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      ),
      ...renderLines(node.right, depth + 1, x + spread, spread / 2),
    ];
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

const ArrayVisualizer = ({ data }) => {
  if (!data || !Array.isArray(data))
    return <div className="text-slate-400 p-8 text-center">No Data</div>;
  const maxVal = Math.max(...data, 50);
  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full px-4 pb-4">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center w-8">
          <div
            className="w-full bg-indigo-500 rounded-t"
            style={{ height: `${(val / maxVal) * 100}%` }}
          ></div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            {val}
          </span>
        </div>
      ))}
    </div>
  );
};

const HashVisualizer = ({ data }) => {
  if (!data || !data.table)
    return <div className="text-slate-400 p-8">No Hash Data</div>;
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-2 font-bold text-indigo-600">
        Key: {data.key} ({data.strategy})
      </div>
      <div className="flex gap-1 border p-2 rounded bg-slate-50">
        {data.table.map((val, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 border flex items-center justify-center text-xs ${
                val === null ? "bg-white" : "bg-indigo-100 font-bold"
              }`}
            >
              {val === null ? "∅" : val}
            </div>
            <span className="text-[10px] text-slate-400">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PostfixVisualizer = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="text-2xl font-mono bg-slate-100 p-4 rounded mb-2 tracking-widest">
      {data ? data.expr : ""}
    </div>
    <div className="text-sm text-slate-500">
      Operands: Push. Operators: Pop 2, Calc, Push.
    </div>
  </div>
);

const RecurrenceVisualizer = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="text-4xl font-serif italic mb-4 text-slate-700">
      T(n) = ...
    </div>
    <div className="text-sm text-slate-500">Apply Master Theorem cases.</div>
  </div>
);

const GraphVisualizer = ({ data, directed }) => {
  if (!data || !data.nodes)
    return <div className="text-slate-400">No Graph</div>;
  const radius = 100,
    centerX = 200,
    centerY = 150;
  const nodePos = data.nodes.map((n, i) => {
    const angle = (i / data.nodes.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...n,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
  return (
    <svg width="400" height="300" className="mx-auto">
      {data.edges.map((e, i) => {
        const s = nodePos.find((n) => n.id === e.source);
        const t = nodePos.find((n) => n.id === e.target);
        return s && t ? (
          <line
            key={i}
            x1={s.x}
            y1={s.y}
            x2={t.x}
            y2={t.y}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        ) : null;
      })}
      {nodePos.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="16"
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

// --- MAIN COMPONENT ---

export default function DSAExamPrep() {
  const [activeAlgo, setActiveAlgo] = useState("linear_search");
  const [problemData, setProblemData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [codeReport, setCodeReport] = useState(null);

  const currentAlgo = algorithms[activeAlgo] || algorithms["linear_search"];

  const generateNewProblem = () => {
    setFeedback(null);
    setShowSolution(false);
    setShowHint(false);
    setUserAnswer("");
    setCodeReport(null);
    setUserCode(
      currentAlgo.signature + " {\n    // Write your implementation here...\n}"
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
    else if (cat === "Sorting" || cat === "Searching")
      setProblemData(generateSortData(7));
    else if (cat === "Linear" && activeAlgo.includes("postfix"))
      setProblemData(generatePostfixData());
    else if (cat === "Linear") setProblemData(generateListData(4));
    else if (cat === "Hashing") setProblemData(generateHashData(7));
    else if (cat === "Recurrences") {
      if (activeAlgo === "complexity") {
        const qs = [
          { algo: "Activity Selection", answer: "O(n)" },
          { algo: "Rod Cutting", answer: "O(n^2)" },
        ];
        setProblemData(qs[Math.floor(Math.random() * qs.length)]);
      } else {
        setProblemData({});
      }
    }
  };

  useEffect(() => {
    generateNewProblem();
  }, [activeAlgo]);

  const checkAnswer = () => {
    const correct = String(currentAlgo.solve(problemData));
    const userClean = userAnswer.toLowerCase().replace(/[^a-z0-9]/g, "");
    const correctClean = correct.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Loose check for recurrences to allow slight formatting diffs
    if (currentAlgo.category === "Recurrences") {
      setFeedback(
        userClean.includes(correctClean.replace("theta", ""))
          ? "correct"
          : "incorrect"
      );
    } else {
      setFeedback(userClean === correctClean ? "correct" : "incorrect");
    }

    if (currentAlgo.category !== "Recurrences")
      setCodeReport(analyzeCode(userCode, activeAlgo));
  };

  const renderVisualizer = () => {
    if (!problemData) return <div>Loading...</div>;
    const cat = currentAlgo.category;
    if (cat === "Graphs")
      return (
        <GraphVisualizer data={problemData} directed={activeAlgo === "dfs"} />
      );
    if (cat === "Trees") {
      if (activeAlgo.includes("heap"))
        return <ArrayVisualizer data={problemData} />; // Heap as array
      return (
        <TreeVisualizer
          root={problemData.root}
          highlight={problemData.target}
        />
      );
    }
    if (cat === "Sorting" || cat === "Searching")
      return <ArrayVisualizer data={problemData} />;
    if (cat === "Linear") {
      if (activeAlgo.includes("postfix"))
        return <PostfixVisualizer data={problemData} />;
      return <ArrayVisualizer data={problemData} />;
    }
    if (cat === "Hashing") return <HashVisualizer data={problemData} />;
    if (cat === "Recurrences")
      return <RecurrenceVisualizer data={problemData} />;
    return <div className="text-4xl text-slate-200 font-bold">?</div>;
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Activity /> DSA Prep
        </div>
        <div className="p-4 space-y-6">
          <SidebarSection
            title="Searching"
            items={["linear_search", "binary_search"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Search size={16} />}
          />
          <SidebarSection
            title="Sorting"
            items={[
              "insertion_sort",
              "selection_sort",
              "merge_sort",
              "quick_sort",
              "randomized_quick_sort",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<BarChart size={16} />}
          />
          <SidebarSection
            title="Recurrences (Problem Set)"
            items={[
              "recurrence_a",
              "recurrence_c",
              "recurrence_j",
              "complexity",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Calculator size={16} />}
          />
          <SidebarSection
            title="Stacks/Queues"
            items={["stack_ops", "queue_ops", "postfix_eval"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<List size={16} />}
          />
          <SidebarSection
            title="Graphs"
            items={["bfs", "dfs", "dijkstra", "kruskal"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<GitBranch size={16} />}
          />
          <SidebarSection
            title="Trees/Heaps"
            items={[
              "bst_inorder",
              "bst_search",
              "bst_ops",
              "rbt_ops",
              "heap_ops",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Database size={16} />}
          />
          <SidebarSection
            title="Hashing"
            items={["hashing"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Hash size={16} />}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[300px] shrink-0">
                <div className="bg-slate-50 border-b border-slate-100 p-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-center">
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
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-slate-700">
                <div className="bg-[#252526] p-3 border-b border-[#333] flex justify-between items-center">
                  <span className="font-mono text-xs text-purple-400">
                    Code Editor (Java/C++)
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 shrink-0 max-h-[30%] overflow-y-auto">
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
          {id.replace(/_/g, " ").replace("dp", "DP")}
        </span>
      </button>
    ))}
  </div>
);
