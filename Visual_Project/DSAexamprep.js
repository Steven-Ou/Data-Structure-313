import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Code,
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
} from "lucide-react";

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

const analyzeCode = (code, algoType) => {
  if (!code) return { detectedLang: "None", percentage: 0, feedback: [] };

  // AGGRESSIVE SANITIZATION:
  // 1. Keep only ASCII printable characters (codes 32-126) and newlines/tabs
  // 2. Collapse whitespace
  // 3. Lowercase
  const codeLower = code
    .replace(/[^\x20-\x7E\s]/g, ' ') // Replace non-ASCII with space
    .replace(/\s+/g, ' ')            // Collapse multiple spaces
    .toLowerCase();

  const feedback = [];
  let score = 0;
  let maxScore = 0;
  let detectedLang = "Pseudo-code";

  // 1. Language Detection
  if (codeLower.includes('->') || codeLower.includes('::') || codeLower.includes('cout') || codeLower.includes('#include') || codeLower.includes('<vector>')) {
    detectedLang = "C++";
  } else if (codeLower.includes('system.out') || codeLower.includes('public void') || codeLower.includes('arraylist')) {
    detectedLang = "Java";
  } else if (codeLower.includes('def ') || codeLower.includes('print(') || codeLower.includes('self.')) {
    detectedLang = "Python";
  }

  // Helper to check requirements
  const check = (keywords, message, weight = 1) => {
    maxScore += weight;
    // Check if ANY of the keywords exist in the sanitized string
    // We trim keywords to ensure no accidental spaces in definitions match
    const match = keywords.some(k => codeLower.includes(k.toLowerCase().trim()));
    
    if (match) {
      score += weight;
      feedback.push({ success: true, text: message });
    } else {
      feedback.push({ success: false, text: `Missing logic: ${message}` });
    }
  };

  // 2. Algorithm Specific Logic Fingerprinting
  if (algoType === 'bfs') {
    check(['queue', 'deque', 'list'], "Queue Declaration", 2);
    check(['push', 'add', 'enqueue', 'offer'], "Enqueue (push/add)", 2);
    check(['front', 'pop', 'poll', 'dequeue', 'remove'], "Dequeue (front/pop)", 2);
    check(['while', 'empty', 'isempty'], "Main Loop", 2);
    check(['visited', 'seen', 'vector<bool>', 'set<'], "Visited Tracking", 2);
    check(['for', 'adj', 'neighbors'], "Neighbor Iteration", 1);
  } 
  else if (algoType === 'dfs') {
    if (codeLower.includes('stack')) {
      check(['stack', 'push', 'pop'], "Stack Data Structure", 2);
      check(['while', 'empty'], "Main Loop", 2);
    } else {
      check(['dfs', 'recurse', 'solve'], "Recursive Function Call", 3);
    }
    check(['visited', 'seen'], "Visited Mechanism", 2);
  }
  else if (algoType === 'dijkstra') {
    check(['priority_queue', 'priorityqueue', 'minheap', 'heap'], "Priority Queue", 3);
    check(['dist', 'distance'], "Distance Array", 1);
    check(['inf', 'infinity', 'max_value'], "Infinity Init", 1);
    check(['<', '>', 'if'], "Relaxation Logic", 3);
  }
  else if (algoType.includes('bst_')) {
    if (algoType.includes('order')) {
      check(['left', 'right'], "Child Access", 2);
      check(['print', 'cout', 'val', 'data'], "Node Processing", 2);
    } 
    else if (algoType.includes('successor') || algoType.includes('predecessor')) {
      check(['if', '<', '>'], "Comparison Logic", 2);
      check(['left', 'right'], "Traversal", 1);
      check(['parent', 'succ', 'pred', 'temp', 'return'], "Result Tracking", 1);
    }
    else if (algoType.includes('parent')) {
      check(['left', 'right'], "Child Access", 2);
      check(['==', 'val'], "Equality Check", 2);
    }
  }

  // 3. Generic Checks
  check(['return', 'void'], "Function Structure", 1);

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { detectedLang, percentage, feedback };
};
const generateGraph = (numNodes = 5, directed = false, weighted = true) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    label: String.fromCharCode(65 + i),
  }));
  const edges = [];
  const matrix = Array(numNodes)
    .fill(null)
    .map(() => Array(numNodes).fill(0));

  // Create a spanning tree first to ensure connectivity
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
  // Hardcoded valid RBT scenarios for stability in quizzing
  const root = new TreeNode(50, "black");
  root.left = new TreeNode(25, "red");
  root.right = new TreeNode(75, "red");

  root.left.left = new TreeNode(10, "black");
  root.left.right = new TreeNode(33, "black");

  root.right.left = new TreeNode(60, "black");
  root.right.right = new TreeNode(89, "black");

  return { root };
};

const algorithms = /*turing machine*/ {
  bfs: {
    name: "BFS (Breadth-First Search)",
    category: "Graphs",
    signature: "void bfs(Graph* G, Node* start) {",
    hint: "Use a Queue<Node*>. Enqueue start, mark visited. While queue not empty, dequeue u, visit neighbors. (Tie-break: alphabetical)",
    solve: (data) => {
      const { matrix } = data;
      const start = 0; // 'A'
      const queue = [start];
      const visited = new Set([start]);
      const result = [];
      while (queue.length > 0) {
        const u = queue.shift();
        result.push(String.fromCharCode(65 + u));
        const neighbors = [];
        for (let v = 0; v < matrix.length; v++) {
          if (matrix[u][v] > 0 && !visited.has(v)) {
            neighbors.push(v);
            visited.add(v);
          }
        }
        queue.push(...neighbors);
      }
      return result.join(",");
    },
    question:
      "Perform BFS starting from Node A. List visited nodes. (Tie-breaker: Visit lower letter neighbors first).",
    code: `void bfs(Graph* G, int startNode) {
    Queue<int> q;
    bool visited[G->V] = {false};
    
    q.enqueue(startNode);
    visited[startNode] = true;
    
    while (!q.isEmpty()) {
        int u = q.dequeue();
        print(u);
        
        // Weiss: Adjacency Lists usually
        for (Node* v : G->adj[u]) {
            if (!visited[v->id]) {
                visited[v->id] = true;
                q.enqueue(v->id);
            }
        }
    }
}`,
  },
};
