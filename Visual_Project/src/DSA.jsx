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
  BarChart, // New icon for Sorting
  List, // New icon for Linear
  Cpu, // New icon for Complexity
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

  // --- EXISTING CHECKS ---
  if (algoType === "bfs") {
    check(["queue", "deque", "list"], "Queue Declaration", 2);
    check(["push", "add", "enqueue", "offer"], "Enqueue", 2);
    check(["front", "pop", "poll", "remove"], "Dequeue", 2);
    check(["while", "empty"], "Main Loop", 2);
  } else if (algoType === "dfs") {
    if (codeLower.includes("stack")) {
      check(["stack", "push", "pop"], "Stack Usage", 2);
    } else {
      check(["dfs", "recurse", "solve"], "Recursive Call", 3);
    }
    check(["visited", "seen"], "Visited Tracking", 2);
  } else if (algoType === "dijkstra") {
    check(["priority_queue", "minheap", "heap"], "Priority Queue", 3);
    check(["dist", "distance"], "Distance Array", 1);
    check(["<", ">", "if"], "Relaxation Logic", 3);
  } else if (algoType.includes("bst_")) {
    if (algoType.includes("order")) {
      check(["left", "right"], "Recursive Steps", 2);
      check(["print", "cout", "val"], "Process Node", 2);
    }
  }
  // --- NEW CHECKS ---
  else if (algoType === "merge_sort") {
    check(["merge", "mid", "split"], "Divide Step", 2);
    check(["left", "right", "arr"], "Subarrays", 2);
    check(["while", "for"], "Merge Loop", 2);
  } else if (algoType === "insertion_sort") {
    check(["for", "i"], "Outer Loop", 1);
    check(["while", "j", ">"], "Shift Loop", 3);
    check(["=", "temp", "key"], "Insert Step", 2);
  } else if (algoType === "stack_ops") {
    check(["top", "head"], "Top Pointer", 2);
    check(["push", "next"], "Push Logic", 2);
    check(["pop", "null"], "Pop Logic", 2);
  }

  // Generic Checks
  check(["return", "void", "int"], "Function Structure", 1);

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
  for (let i = 0; i < numNodes; i++) {
    if (Math.random() > 0.7) {
      const target = Math.floor(Math.random() * numNodes);
      if (target !== i && matrix[i][target] === 0) {
        const weight = weighted ? Math.floor(Math.random() * 9) + 1 : 1;
        edges.push({ source: i, target, weight });
        matrix[i][target] = weight;
        if (!directed) matrix[target][i] = weight;
      }
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
  return { root, values };
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

// New: Generate Array for Sorting
const generateSortData = (size = 6) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
};

// New: Generate Stack/List Data
const generateListData = (size = 4) => {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
};

// --- ALGORITHMS ---

const algorithms = {
  // === ORIGINAL ALGORITHMS ===
  bfs: {
    name: "BFS (Breadth-First Search)",
    category: "Graphs",
    signature: "void bfs(Graph* G, int startNode) {",
    hint: "Use a Queue. Push start, mark visited. While !q.empty(), pop, visit neighbors.",
    solve: (data) => {
      const { matrix } = data;
      const start = 0;
      const queue = [start];
      const visited = new Set([start]);
      const result = [];
      while (queue.length > 0) {
        const u = queue.shift();
        result.push(String.fromCharCode(65 + u));
        for (let v = 0; v < matrix.length; v++) {
          if (matrix[u][v] > 0 && !visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        }
      }
      return result.join(", ");
    },
    question: "Perform BFS starting from Node A. List visited nodes.",
    code: `void bfs(Graph* G, int startNode) {
    queue<int> q;
    vector<bool> visited(G->V, false);
    q.push(startNode); visited[startNode] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " ";
        for (auto v : G->adj[u]) {
            if (!visited[v]) { visited[v] = true; q.push(v); }
        }
    }
}`,
  },
  dfs: {
    name: "DFS (Depth-First Search)",
    category: "Graphs",
    signature: "void dfs(Graph* G, int u, vector<bool>& visited) {",
    hint: "Use Recursion. Mark u as visited, print u. Recurse on unvisited neighbors.",
    solve: (data) => {
      const { matrix } = data;
      const visited = new Set();
      const result = [];
      const recurse = (u) => {
        visited.add(u);
        result.push(String.fromCharCode(65 + u));
        for (let v = 0; v < matrix.length; v++)
          if (matrix[u][v] > 0 && !visited.has(v)) recurse(v);
      };
      recurse(0);
      return result.join(", ");
    },
    question:
      "Perform Pre-Order DFS starting from Node A. (Tie-breaker: lower letter first).",
    code: `void dfs(Graph* G, int u, vector<bool>& visited) {
    visited[u] = true; cout << u << " ";
    for (auto v : G->adj[u]) {
        if (!visited[v]) dfs(G, v, visited);
    }
}`,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    signature: "void dijkstra(Graph* G, int s) {",
    hint: "Use priority_queue. Relax edges: if (dist[u] + w < dist[v]) update.",
    solve: (data) => {
      const { matrix, nodes } = data;
      const dist = Array(nodes.length).fill(Infinity);
      dist[0] = 0;
      const visited = Array(nodes.length).fill(false);
      for (let i = 0; i < nodes.length; i++) {
        let u = -1;
        let minVal = Infinity;
        for (let k = 0; k < nodes.length; k++)
          if (!visited[k] && dist[k] < minVal) {
            minVal = dist[k];
            u = k;
          }
        if (u === -1) break;
        visited[u] = true;
        for (let v = 0; v < nodes.length; v++)
          if (
            matrix[u][v] > 0 &&
            !visited[v] &&
            dist[u] + matrix[u][v] < dist[v]
          )
            dist[v] = dist[u] + matrix[u][v];
      }
      return dist[nodes.length - 1] === Infinity
        ? "INF"
        : dist[nodes.length - 1];
    },
    question: "Shortest path distance from Node A to the last Node?",
    code: `void dijkstra(Graph* G, int s) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    vector<int> dist(G->V, INF); dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto edge : G->adj[u]) {
            if (dist[u] + edge.weight < dist[edge.dest]) {
                dist[edge.dest] = dist[u] + edge.weight;
                pq.push({dist[edge.dest], edge.dest});
            }
        }
    }
}`,
  },
  bst_inorder: {
    name: "In-Order Traversal",
    category: "Trees",
    signature: "void inorder(Node* root) {",
    hint: "Left -> Root -> Right. Produces sorted output.",
    solve: (data) => {
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
    question: "List the values of the tree in In-Order sequence.",
    code: `void inorder(Node* root) {
    if (!root) return;
    inorder(root->left); cout << root->val << " "; inorder(root->right);
}`,
  },
  bst_preorder: {
    name: "Pre-Order Traversal",
    category: "Trees",
    signature: "void preorder(Node* root) {",
    hint: "Root -> Left -> Right.",
    solve: (data) => {
      const res = [];
      const t = (n) => {
        if (!n) return;
        res.push(n.val);
        t(n.left);
        t(n.right);
      };
      t(data.root);
      return res.join(", ");
    },
    question: "List the values of the tree in Pre-Order sequence.",
    code: `void preorder(Node* root) {
    if (!root) return;
    cout << root->val << " "; preorder(root->left); preorder(root->right);
}`,
  },
  bst_postorder: {
    name: "Post-Order Traversal",
    category: "Trees",
    signature: "void postorder(Node* root) {",
    hint: "Left -> Right -> Root.",
    solve: (data) => {
      const res = [];
      const t = (n) => {
        if (!n) return;
        t(n.left);
        t(n.right);
        res.push(n.val);
      };
      t(data.root);
      return res.join(", ");
    },
    question: "List the values of the tree in Post-Order sequence.",
    code: `void postorder(Node* root) {
    if (!root) return;
    postorder(root->left); postorder(root->right); cout << root->val << " ";
}`,
  },
  bst_successor: {
    name: "In-Order Successor",
    category: "Trees",
    signature: "Node* successor(Node* root, int val) {",
    hint: "Smallest node > val.",
    solve: (data) => {
      const { root, target } = data;
      const sorted = [];
      const t = (n) => {
        if (!n) return;
        t(n.left);
        sorted.push(n.val);
        t(n.right);
      };
      t(root);
      const idx = sorted.indexOf(target);
      return idx < sorted.length - 1 ? sorted[idx + 1] : "None";
    },
    question: (data) => `Find the In-Order Successor of node ${data.target}.`,
    code: `Node* successor(Node* root, int val) {
    Node* succ = nullptr;
    while (root) {
        if (val < root->val) { succ = root; root = root->left; }
        else root = root->right;
    }
    return succ;
}`,
  },
  bst_predecessor: {
    name: "In-Order Predecessor",
    category: "Trees",
    signature: "Node* predecessor(Node* root, int val) {",
    hint: "Largest node < val.",
    solve: (data) => {
      const { root, target } = data;
      const sorted = [];
      const t = (n) => {
        if (!n) return;
        t(n.left);
        sorted.push(n.val);
        t(n.right);
      };
      t(root);
      const idx = sorted.indexOf(target);
      return idx > 0 ? sorted[idx - 1] : "None";
    },
    question: (data) => `Find the In-Order Predecessor of node ${data.target}.`,
    code: `Node* predecessor(Node* root, int val) {
    Node* pred = nullptr;
    while (root) {
        if (val > root->val) { pred = root; root = root->right; }
        else root = root->left;
    }
    return pred;
}`,
  },
  bst_parent: {
    name: "Find Parent Node",
    category: "Trees",
    signature: "Node* findParent(Node* root, int val) {",
    hint: "Traverse. If root->left == val OR root->right == val, current is parent.",
    solve: (data) => {
      const { root, target } = data;
      let parent = null;
      let curr = root;
      while (curr) {
        if (curr.val === target) break;
        parent = curr.val;
        if (target < curr.val) curr = curr.left;
        else curr = curr.right;
      }
      return parent === null ? "None" : parent;
    },
    question: (data) =>
      `Find the Parent of node ${data.target}. (Return None if root)`,
    code: `Node* findParent(Node* root, int val) {
    if (!root || root->val == val) return nullptr;
    while(root) {
        if((root->left && root->left->val == val) || (root->right && root->right->val == val)) return root;
        if(val < root->val) root = root->left; else root = root->right;
    }
    return nullptr;
}`,
  },
  rbt_props: {
    name: "Red-Black Tree Properties",
    category: "Trees",
    signature: "int blackHeight(Node* root) {",
    hint: "Black Height: Number of black nodes on any path from root to NIL.",
    solve: (data) => "2",
    question:
      "What is the 'Black Height' of the root (50)? (Count black nodes on path to any null leaf).",
    code: `int blackHeight(Node* root) {
    if (!root) return 0;
    return blackHeight(root->left) + (root->color == BLACK ? 1 : 0);
}`,
  },

  // === NEW ALGORITHMS (ADDED) ===

  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    signature: "void merge(int arr[], int p, int q, int r)",
    hint: "Recursively divide array in half, sort, then merge sorted halves.",
    solve: (data) => {
      return [...data].sort((a, b) => a - b).join(", ");
    },
    question: "What will the array look like after it is fully sorted?",
    code: `// [Source: Sort.java]
public static void merge(int arr[], int p, int q, int r){
    int n1 = q - p + 1; int n2 = r - q;
    int[] L = new int[n1]; int[] R = new int[n2];
    for(int i=0; i<n1; i++) L[i] = arr[p+i];
    for(int j=0; j<n2; j++) R[j] = arr[q+1+j];
    
    int i=0, j=0, k=p;
    while(i<n1 && j<n2) {
        if(L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while(i<n1) arr[k++] = L[i++];
    while(j<n2) arr[k++] = R[j++];
}`,
  },
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    signature: "void insertion_sort(int[] a)",
    hint: "Take element at i, shift elements > key to the right, insert key.",
    solve: (data) => {
      const arr = [...data];
      const k = arr[1];
      let j = 0;
      while (j >= 0 && arr[j] > k) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = k;
      return arr.join(", ");
    },
    question:
      "Perform just the FIRST pass of Insertion Sort (insert 2nd element). Result?",
    code: `// [Source: Sort.java]
public static void insertion_sort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int k = a[i]; int j = i - 1;
        while (j >= 0 && a[j] > k) {
            a[j + 1] = a[j]; j--;
        }
        a[j + 1] = k;
    }
}`,
  },
  stack_ops: {
    name: "Stack Operations",
    category: "Linear",
    signature: "void push(T val) / T pop()",
    hint: "LIFO: Last In, First Out. Push to head, Pop from head.",
    solve: (data) => {
      // Data is [A, B, C, D] (D is top)
      // Sim: Pop (D), Pop (C), Push 99. Top is 99.
      return "99";
    },
    question:
      "Given Stack (Top on right), perform: Pop(), Pop(), Push(99). What is Top?",
    code: `// [Source: LinkedListStack.java]
public void push(T value) {
    Node<T> newNode = new Node<>(value);
    newNode.next = top; top = newNode;
}
public T pop() {
    if (isEmpty()) throw new EmptyStackException();
    T data = top.data; top = top.next;
    return data;
}`,
  },
  complexity_quiz: {
    name: "Time Complexity Quiz",
    category: "Complexity",
    signature: "Big-O Notation",
    hint: "Analyze loops (n) and splits (log n).",
    solve: (data) => data.answer,
    question: (data) =>
      `What is the worst-case Time Complexity of ${data.algo}?`,
    code: `// Cheat Sheet:
// Merge Sort: O(n log n)
// Bubble/Insertion Sort: O(n^2)
// Binary Search: O(log n)
// Array Access: O(1)
// BST Search: O(h)`,
  },
};

// --- VISUALIZERS ---

// 1. Original Tree Visualizer (Restored)
const TreeVisualizer = ({ root, highlight }) => {
  if (!root) return null;
  const levels = [];
  const traverse = (node, depth, x, spread) => {
    if (!node) return;
    if (!levels[depth]) levels[depth] = [];
    const pos = {
      x,
      y: 40 + depth * 60,
      val: node.val,
      color: node.color,
      id: node.id,
    };
    levels[depth].push(pos);
    node.pos = pos;
    traverse(node.left, depth + 1, x - spread, spread / 2);
    traverse(node.right, depth + 1, x + spread, spread / 2);
  };
  traverse(root, 0, 200, 100);
  const renderLines = (node) => {
    if (!node) return [];
    const lines = [];
    if (node.left) {
      lines.push(
        <line
          key={`${node.id}-L`}
          x1={node.pos.x}
          y1={node.pos.y}
          x2={node.left.pos.x}
          y2={node.left.pos.y}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      );
      lines.push(...renderLines(node.left));
    }
    if (node.right) {
      lines.push(
        <line
          key={`${node.id}-R`}
          x1={node.pos.x}
          y1={node.pos.y}
          x2={node.right.pos.x}
          y2={node.right.pos.y}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      );
      lines.push(...renderLines(node.right));
    }
    return lines;
  };
  const renderNodes = (node) => {
    if (!node) return [];
    const nodesArr = [];
    const isTarget = node.val === highlight;
    const isRed = node.color === "red";
    const fill = isTarget
      ? "#fef3c7"
      : isRed
      ? "#fee2e2"
      : node.color === "black"
      ? "#334155"
      : "white";
    const stroke = isTarget
      ? "#d97706"
      : isRed
      ? "#ef4444"
      : node.color === "black"
      ? "#0f172a"
      : "#3b82f6";
    const textFill = node.color === "black" ? "white" : "#1e293b";
    nodesArr.push(
      <g key={node.id}>
        <circle
          cx={node.pos.x}
          cy={node.pos.y}
          r="16"
          fill={fill}
          stroke={stroke}
          strokeWidth={isTarget ? 3 : 2}
        />
        <text
          x={node.pos.x}
          y={node.pos.y}
          dy="5"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={textFill}
        >
          {node.val}
        </text>
      </g>
    );
    nodesArr.push(...renderNodes(node.left));
    nodesArr.push(...renderNodes(node.right));
    return nodesArr;
  };
  return (
    <svg width="400" height="350" className="mx-auto overflow-visible">
      {renderLines(root)}
      {renderNodes(root)}
    </svg>
  );
};

// 2. Original Graph Visualizer (Restored)
const GraphVisualizer = ({ data, directed }) => {
  if (!data) return null;
  const { nodes, edges } = data;
  const radius = 100;
  const centerX = 200;
  const centerY = 150;
  const getNodePos = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };
  return (
    <svg width="400" height="300" className="mx-auto overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="26"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
      </defs>
      {edges.map((e, i) => {
        const start = getNodePos(e.source, nodes.length);
        const end = getNodePos(e.target, nodes.length);
        return (
          <g key={i}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#94a3b8"
              strokeWidth="2"
              markerEnd={directed ? "url(#arrowhead)" : ""}
            />
            {e.weight > 1 && (
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2}
                fill="#ef4444"
                fontSize="12"
                fontWeight="bold"
                dy="4"
                textAnchor="middle"
                className="bg-white"
              >
                {e.weight}
              </text>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const pos = getNodePos(i, nodes.length);
        return (
          <g key={n.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="18"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x={pos.x}
              y={pos.y}
              dy="5"
              textAnchor="middle"
              fontWeight="bold"
              fill="#1e293b"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// 3. NEW Visualizers (Array & List)
const ArrayVisualizer = ({ data }) => {
  if (!data) return null;
  const maxVal = Math.max(...data, 50);
  return (
    <div className="flex items-end justify-center gap-1 h-full w-full px-4 pb-4">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-1 w-8 group">
          <div
            className="w-full bg-indigo-500 rounded-t transition-all duration-300"
            style={{ height: `${(val / maxVal) * 100}%` }}
          ></div>
          <span className="text-xs font-mono text-slate-500">{val}</span>
        </div>
      ))}
    </div>
  );
};

const ListVisualizer = ({ data }) => {
  if (!data) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-4 mt-12">
      {data.map((val, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-bold text-slate-700 ${
              i === data.length - 1
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-white"
            }`}
          >
            {val}
          </div>
          {i < data.length - 1 && (
            <ArrowRight size={16} className="text-slate-400" />
          )}
        </React.Fragment>
      ))}
      <span className="text-xs font-bold text-indigo-600 ml-2">← TOP</span>
    </div>
  );
};

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

  const currentAlgo = algorithms[activeAlgo];

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

    if (activeAlgo === "complexity_quiz") {
      const opts = [
        { algo: "Merge Sort", answer: "O(n log n)" },
        { algo: "Insertion Sort", answer: "O(n^2)" },
        { algo: "Binary Search", answer: "O(log n)" },
        { algo: "Access Array Index", answer: "O(1)" },
      ];
      setProblemData(opts[Math.floor(Math.random() * opts.length)]);
    } else if (currentAlgo.category === "Graphs") {
      setProblemData(
        generateGraph(5, activeAlgo === "dfs", activeAlgo === "dijkstra")
      );
    } else if (currentAlgo.category === "Trees") {
      if (activeAlgo === "rbt_props") {
        setProblemData(generateRBTData());
      } else {
        const data = generateBSTData(7);
        // Ensure valid targets for Find/Pred/Succ
        if (activeAlgo.includes("successor")) {
          data.target = data.values.sort((a, b) => a - b)[0]; // Smallest has successor
        } else if (activeAlgo.includes("predecessor")) {
          data.target = data.values.sort((a, b) => a - b)[
            data.values.length - 1
          ]; // Largest has pred
        } else {
          data.target = data.values[0];
        }
        setProblemData(data);
      }
    } else if (currentAlgo.category === "Sorting") {
      setProblemData(generateSortData(7));
    } else if (currentAlgo.category === "Linear") {
      setProblemData(generateListData(4));
    }
  };

  useEffect(() => {
    generateNewProblem();
  }, [activeAlgo]);

  const checkAnswer = () => {
    if (!problemData) return;
    const correctAnswer = String(currentAlgo.solve(problemData));
    const userClean = String(userAnswer)
      .replace(/[^a-zA-Z0-9,^()]/g, "")
      .toLowerCase();
    const correctClean = correctAnswer
      .replace(/[^a-zA-Z0-9,^()]/g, "")
      .toLowerCase();

    if (userClean === correctClean) setFeedback("correct");
    else setFeedback("incorrect");

    if (currentAlgo.category !== "Complexity") {
      setCodeReport(analyzeCode(userCode, activeAlgo));
    }
  };

  const getQuestionText = () => {
    return typeof currentAlgo.question === "function"
      ? currentAlgo.question(problemData)
      : currentAlgo.question;
  };

  const renderVisualizer = () => {
    if (activeAlgo === "complexity_quiz")
      return (
        <div className="text-6xl text-slate-200 font-bold flex items-center justify-center h-full">
          O(n)
        </div>
      );
    if (currentAlgo.category === "Graphs")
      return (
        <GraphVisualizer data={problemData} directed={activeAlgo === "dfs"} />
      );
    if (currentAlgo.category === "Trees")
      return (
        <TreeVisualizer
          root={problemData?.root}
          highlight={problemData?.target}
        />
      );
    if (currentAlgo.category === "Sorting")
      return <ArrayVisualizer data={problemData} />;
    if (currentAlgo.category === "Linear")
      return <ListVisualizer data={problemData} />;
    return null;
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Activity /> <span>DSA Prep</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <SidebarSection
            title="Graphs"
            items={["bfs", "dfs", "dijkstra"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<GitBranch size={16} />}
          />
          <SidebarSection
            title="Traversals"
            items={["bst_preorder", "bst_inorder", "bst_postorder"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Database size={16} />}
          />
          <SidebarSection
            title="Tree Ops"
            items={[
              "bst_successor",
              "bst_predecessor",
              "bst_parent",
              "rbt_props",
            ]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Layers size={16} />}
          />
          <SidebarSection
            title="Sorting"
            items={["merge_sort", "insertion_sort"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<BarChart size={16} />}
          />
          <SidebarSection
            title="Linear"
            items={["stack_ops"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<List size={16} />}
          />
          <SidebarSection
            title="Theory"
            items={["complexity_quiz"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Cpu size={16} />}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
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
            {/* LEFT COLUMN */}
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
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                    <BookOpen size={20} className="text-indigo-500" /> Question
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTrace(!showTrace)}
                      className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition bg-slate-100 px-2 py-1 rounded"
                    >
                      <Eye size={14} />{" "}
                      {showTrace ? "Hide Answer" : "Reveal Answer"}
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition bg-slate-100 px-2 py-1 rounded"
                    >
                      <Lightbulb size={14} /> Hint
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  {problemData && getQuestionText()}
                </p>
                {showHint && (
                  <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded border border-amber-200 flex gap-2">
                    <HelpCircle size={16} className="shrink-0 mt-0.5" />
                    {currentAlgo.hint}
                  </div>
                )}
                {showTrace && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <span className="font-bold text-slate-500 block mb-1">
                      Answer:
                    </span>
                    {String(currentAlgo.solve(problemData))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setFeedback(null);
                      setCodeReport(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    placeholder="Enter answer..."
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <button
                    onClick={checkAnswer}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition"
                  >
                    Check
                  </button>
                </div>

                {feedback === "correct" && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
                    <CheckCircle size={20} />
                    <span className="font-medium">Correct!</span>
                  </div>
                )}
                {feedback === "incorrect" && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                    <XCircle size={20} />
                    <span className="font-medium">Incorrect.</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-slate-700 min-h-0">
                <div className="bg-[#252526] p-3 border-b border-[#333] flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Terminal size={16} className="text-purple-400" />
                    <span className="font-mono text-xs text-purple-400">
                      Code Editor
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-xs px-3 py-1 bg-[#333] text-slate-300 hover:text-white rounded border border-[#444] transition"
                  >
                    {showSolution ? "Hide Key" : "Reveal Code Key"}
                  </button>
                </div>
                <div className="flex-1 relative font-mono text-sm overflow-hidden">
                  {showSolution ? (
                    <div className="absolute inset-0 p-4 text-[#d4d4d4] overflow-auto whitespace-pre-wrap leading-relaxed">
                      <span className="text-green-600 block mb-2">
                        // Reference Implementation
                      </span>
                      {currentAlgo.code}
                    </div>
                  ) : (
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 resize-none outline-none leading-relaxed overflow-auto"
                      spellCheck="false"
                    />
                  )}
                </div>
              </div>

              {codeReport && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 shrink-0 max-h-[40%] overflow-y-auto animate-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Search size={18} className="text-blue-500" /> Code
                      Analysis
                    </h3>
                    <div className="text-xs font-mono px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-500">
                      {codeReport.detectedLang}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          codeReport.percentage > 80
                            ? "bg-green-500"
                            : codeReport.percentage > 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${codeReport.percentage}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm text-slate-600">
                      {codeReport.percentage}% Match
                    </span>
                  </div>
                  <div className="space-y-2">
                    {codeReport.feedback.map((item, i) => (
                      <div
                        key={i}
                        className={`text-xs p-2 rounded flex items-center gap-2 ${
                          item.success
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {item.success ? (
                          <CheckCircle size={14} />
                        ) : (
                          <AlertTriangle size={14} />
                        )}{" "}
                        {item.text}
                      </div>
                    ))}
                  </div>
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
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((id) => (
        <button
          key={id}
          onClick={() => set(id)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
            active === id
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          {icon}{" "}
          <span>
            {id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>{" "}
          {active === id && <ArrowRight size={14} className="ml-auto" />}
        </button>
      ))}
    </div>
  </div>
);
