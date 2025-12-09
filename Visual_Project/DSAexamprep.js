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
    .replace(/[^\x20-\x7E\s]/g, " ") // Replace non-ASCII with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .toLowerCase();

  const feedback = [];
  let score = 0;
  let maxScore = 0;
  let detectedLang = "Pseudo-code";

  // 1. Language Detection
  if (
    codeLower.includes("->") ||
    codeLower.includes("::") ||
    codeLower.includes("cout") ||
    codeLower.includes("#include") ||
    codeLower.includes("<vector>")
  ) {
    detectedLang = "C++";
  } else if (
    codeLower.includes("system.out") ||
    codeLower.includes("public void") ||
    codeLower.includes("arraylist")
  ) {
    detectedLang = "Java";
  } else if (
    codeLower.includes("def ") ||
    codeLower.includes("print(") ||
    codeLower.includes("self.")
  ) {
    detectedLang = "Python";
  }

  // Helper to check requirements
  const check = (keywords, message, weight = 1) => {
    maxScore += weight;
    // Check if ANY of the keywords exist in the sanitized string
    // We trim keywords to ensure no accidental spaces in definitions match
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

  // 2. Algorithm Specific Logic Fingerprinting
  if (algoType === "bfs") {
    check(["queue", "deque", "list"], "Queue Declaration", 2);
    check(["push", "add", "enqueue", "offer"], "Enqueue (push/add)", 2);
    check(
      ["front", "pop", "poll", "dequeue", "remove"],
      "Dequeue (front/pop)",
      2
    );
    check(["while", "empty", "isempty"], "Main Loop", 2);
    check(["visited", "seen", "vector<bool>", "set<"], "Visited Tracking", 2);
    check(["for", "adj", "neighbors"], "Neighbor Iteration", 1);
  } else if (algoType === "dfs") {
    if (codeLower.includes("stack")) {
      check(["stack", "push", "pop"], "Stack Data Structure", 2);
      check(["while", "empty"], "Main Loop", 2);
    } else {
      check(["dfs", "recurse", "solve"], "Recursive Function Call", 3);
    }
    check(["visited", "seen"], "Visited Mechanism", 2);
  } else if (algoType === "dijkstra") {
    check(
      ["priority_queue", "priorityqueue", "minheap", "heap"],
      "Priority Queue",
      3
    );
    check(["dist", "distance"], "Distance Array", 1);
    check(["inf", "infinity", "max_value"], "Infinity Init", 1);
    check(["<", ">", "if"], "Relaxation Logic", 3);
  } else if (algoType.includes("bst_")) {
    if (algoType.includes("order")) {
      check(["left", "right"], "Child Access", 2);
      check(["print", "cout", "val", "data"], "Node Processing", 2);
    } else if (
      algoType.includes("successor") ||
      algoType.includes("predecessor")
    ) {
      check(["if", "<", ">"], "Comparison Logic", 2);
      check(["left", "right"], "Traversal", 1);
      check(["parent", "succ", "pred", "temp", "return"], "Result Tracking", 1);
    } else if (algoType.includes("parent")) {
      check(["left", "right"], "Child Access", 2);
      check(["==", "val"], "Equality Check", 2);
    }
  }

  // 3. Generic Checks
  check(["return", "void"], "Function Structure", 1);

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

const algorithms = {
  //Turing Machine!!!
  bfs: {
    name: "BFS (Breadth-First Search)",
    category: "Graphs",
    signature: "void bfs(Graph* G, int startNode) {",
    hint: "Use a Queue<int>. Push start, mark visited. While !q.empty(), front(), pop(), then visit neighbors.",
    solve: (data) => {
      const { matrix } = data;
      const start = 0;
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
      return result.join(", ");
    },
    question:
      "Perform BFS starting from Node A. List visited nodes. (Tie-breaker: Visit lower letter neighbors first).",
    code: `void bfs(Graph* G, int startNode) {
    queue<int> q;
    vector<bool> visited(G->V, false);
    
    q.push(startNode);          // Enqueue
    visited[startNode] = true;
    
    while (!q.empty()) {
        int u = q.front();      // Peek
        q.pop();                // Dequeue
        cout << u << " ";
        
        // Iterate neighbors
        for (auto v : G->adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
  },
  dfs: {
    name: "DFS (Depth-First Search)",
    category: "Graphs",
    signature: "void dfs(Graph* G, int u, vector<bool>& visited) {",
    hint: "Use Recursion. Mark u as visited, print u. Loop through unvisited neighbors and recurse.",
    solve: (data) => {
      const { matrix } = data;
      const visited = new Set();
      const result = [];
      const recurse = (u) => {
        visited.add(u);
        result.push(String.fromCharCode(65 + u));
        for (let v = 0; v < matrix.length; v++) {
          if (matrix[u][v] > 0 && !visited.has(v)) recurse(v);
        }
      };
      recurse(0);
      return result.join(", ");
    },
    question:
      "Perform Pre-Order DFS starting from Node A. List visited nodes. (Tie-breaker: lower letter first).",
    code: `// Recursive DFS
void dfs(Graph* G, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    
    for (auto v : G->adj[u]) {
        if (!visited[v]) {
            dfs(G, v, visited);
        }
    }
}

// Driver
void startDFS(Graph* G) {
    vector<bool> visited(G->V, false);
    dfs(G, 0, visited);
}`,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    signature: "void dijkstra(Graph* G, int s) {",
    hint: "Use priority_queue<pair<int, int>> (dist, u). Relax edges: if (dist[u] + w < dist[v]) update.",
    solve: (data) => {
      const { matrix, nodes } = data;
      const dist = Array(nodes.length).fill(Infinity);
      dist[0] = 0;
      const visited = new Array(nodes.length).fill(false);
      for (let i = 0; i < nodes.length; i++) {
        let u = -1;
        let minVal = Infinity;
        for (let k = 0; k < nodes.length; k++) {
          if (!visited[k] && dist[k] < minVal) {
            minVal = dist[k];
            u = k;
          }
        }
        if (u === -1) break;
        visited[u] = true;
        for (let v = 0; v < nodes.length; v++) {
          if (matrix[u][v] > 0 && !visited[v]) {
            if (dist[u] + matrix[u][v] < dist[v]) {
              dist[v] = dist[u] + matrix[u][v];
            }
          }
        }
      }
      return dist[nodes.length - 1] === Infinity
        ? "INF"
        : dist[nodes.length - 1];
    },
    question:
      "What is the shortest path distance from Node A to the last Node (highest letter)?",
    code: `void dijkstra(Graph* G, int s) {
    // Min-heap via greater comparator
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    vector<int> dist(G->V, INF);
    
    dist[s] = 0;
    pq.push({0, s});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto edge : G->adj[u]) {
            int v = edge.dest;
            int weight = edge.weight;
            
            // Relaxation
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
  },
  bst_inorder: {
    name: "In-Order Traversal",
    category: "Trees",
    signature: "void inorder(Node* root) {",
    hint: "Left -> Print(Root) -> Right. Produces sorted output for BST.",
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
    question:
      "List the values of the tree in In-Order sequence (comma separated).",
    code: `void inorder(Node* root) {
    if (root == nullptr) return;
    
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}`,
  },
  bst_preorder: {
    name: "Pre-Order Traversal",
    category: "Trees",
    signature: "void preorder(Node* root) {",
    hint: "Print(Root) -> Left -> Right.",
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
    question:
      "List the values of the tree in Pre-Order sequence (comma separated).",
    code: `void preorder(Node* root) {
    if (root == nullptr) return;
    
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}`,
  },
  bst_postorder: {
    name: "Post-Order Traversal",
    category: "Trees",
    signature: "void postorder(Node* root) {",
    hint: "Left -> Right -> Print(Root).",
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
    question:
      "List the values of the tree in Post-Order sequence (comma separated).",
    code: `void postorder(Node* root) {
    if (root == nullptr) return;
    
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}`,
  },
  bst_successor: {
    name: "In-Order Successor",
    category: "Trees",
    signature: "Node* successor(Node* root, int val) {",
    hint: "Smallest node > val. Go right then left-most, OR traverse from root.",
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
        if (val < root->val) {
            succ = root;
            root = root->left;
        } else {
            root = root->right;
        }
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
        if (val > root->val) {
            pred = root;
            root = root->right;
        } else {
            root = root->left;
        }
    }
    return pred;
}`,
  },
  bst_parent: {
    name: "Find Parent Node",
    category: "Trees",
    signature: "Node* findParent(Node* root, int val) {",
    hint: "Traverse. If root->left == val OR root->right == val, root is parent.",
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
      `Find the Parent of node ${data.target}. (Return None if it's the root)`,
    code: `Node* findParent(Node* root, int val) {
    if (!root || root->val == val) return nullptr;
    while(root) {
        if((root->left && root->left->val == val) || 
           (root->right && root->right->val == val)) return root;
        if(val < root->val) root = root->left;
        else root = root->right;
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
};

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
    <svg width="400" height="350" className="mx-auto">
      {renderLines(root)}
      {renderNodes(root)}
    </svg>
  );
};

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
    <svg width="400" height="300" className="mx-auto">
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
    setUserCode(currentAlgo.signature + "\n    // Write your implementation here...\n    // Use standard C++ STL (e.g., q.push, q.front)\n    \n");
  };

  if (currentAlgo.category === "Graphs") {
      setProblemData(generateGraph(5, activeAlgo === "dfs", activeAlgo === 'dijkstra'));
    } else if (currentAlgo.category === "Trees") {
      if (activeAlgo === "rbt_props") {
        setProblemData(generateRBTData());
      } else {
        const data = generateBSTData(7);
        if (activeAlgo === "bst_successor") {
          const valid = data.values.sort((a,b)=>a-b).slice(0, -1);
          data.target = valid[Math.floor(Math.random()*valid.length)];
        } else if (activeAlgo === "bst_predecessor") {
          const valid = data.values.sort((a,b)=>a-b).slice(1);
          data.target = valid[Math.floor(Math.random()*valid.length)];
        } else if (activeAlgo === "bst_parent") {
          data.target = data.values.filter(v => v !== data.root.val)[Math.floor(Math.random()*(data.values.length-1))];
        } else {
          data.target = data.values[0]; 
        }
        setProblemData(data);
      }
    }
}
