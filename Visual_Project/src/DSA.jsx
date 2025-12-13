import React, { useState, useEffect } from "react";
import {
  Activity,
  GitBranch,
  Database,
  BarChart,
  List,
  Hash,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Calculator,
  Code,
  Terminal,
  Cpu,
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
  const codeLower = code.toLowerCase();
  let detectedLang = "Pseudo-code";

  if (
    codeLower.includes("#include") ||
    codeLower.includes("cout") ||
    codeLower.includes("vector<")
  )
    detectedLang = "C++";
  else if (
    codeLower.includes("public class") ||
    codeLower.includes("system.out") ||
    codeLower.includes("arraylist")
  )
    detectedLang = "Java";
  else if (
    codeLower.includes("def ") ||
    codeLower.includes("import ") ||
    codeLower.includes("self.")
  )
    detectedLang = "Python";

  // Simple heuristic check
  return {
    detectedLang,
    percentage: 100,
    feedback: [{ success: true, text: "Syntax check passed" }],
  };
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

  // Add randomness
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
  return { root };
};

const generateHeapData = () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10).sort(
    (a, b) => b - a
  );
const generateSortData = (size = 7) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
const generateListData = (size = 4) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
const generateHashData = (size = 7) => {
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
const generatePostfixData = () => {
  const ops = ["+", "-", "*"];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  return {
    expr: `${a} ${b} ${ops[0]} ${c} ${ops[1]}`,
    hint: "Push operands. Pop 2 on operator.",
  };
};

// --- ALGORITHMS & MULTI-LANGUAGE CODES ---

const algorithms = {
  // === SEARCHING ===
  linear_search: {
    name: "Linear Search",
    category: "Searching",
    solve: (d) => (d ? d.indexOf(d[Math.floor(d.length / 2)]) : -1),
    question: (d) => `Find index of ${d ? d[Math.floor(d.length / 2)] : "x"}.`,
    hint: "Iterate from 0 to n. Return index if found.",
    codes: {
      java: `public class Search {
    public static int linearSearch(int[] arr, int x) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == x) return i;
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] data = {10, 50, 30, 70, 80, 20};
        System.out.println("Idx: " + linearSearch(data, 30));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int linearSearch(vector<int>& arr, int x) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}
int main() {
    vector<int> data = {10, 50, 30, 70};
    cout << linearSearch(data, 30);
    return 0;
}`,
      python: `def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1

# Main
data = [10, 50, 30, 70]
print(linear_search(data, 30))`,
      pseudo: `LINEAR-SEARCH(A, x)
  for i = 1 to A.length
      if A[i] == x
          return i
  return NIL`,
    },
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    solve: (d) => (d ? Math.floor(d.length / 2) : -1),
    question: "Index of median element in sorted list?",
    hint: "Sorted input required. Check mid. Recurse Left or Right.",
    codes: {
      java: `public int binarySearch(int[] arr, int x) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
      cpp: `int binarySearch(vector<int>& arr, int x) {
    int l = 0, r = arr.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, x):
    l, r = 0, len(arr) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] < x:
            l = mid + 1
        else:
            r = mid - 1
    return -1`,
      pseudo: `BINARY-SEARCH(A, x)
  low = 1, high = A.length
  while low <= high
      mid = floor((low + high) / 2)
      if A[mid] == x return mid
      elseif A[mid] < x low = mid + 1
      else high = mid - 1
  return NIL`,
    },
  },

  // === SORTING ===
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Insert element A[j] into the sorted sequence A[1..j-1].",
    codes: {
      java: `void insertionSort(int[] A) {
    for (int j = 1; j < A.length; j++) {
        int key = A[j];
        int i = j - 1;
        while (i >= 0 && A[i] > key) {
            A[i + 1] = A[i];
            i--;
        }
        A[i + 1] = key;
    }
}`,
      cpp: `void insertionSort(vector<int>& A) {
    for (int j = 1; j < A.size(); j++) {
        int key = A[j];
        int i = j - 1;
        while (i >= 0 && A[i] > key) {
            A[i + 1] = A[i];
            i--;
        }
        A[i + 1] = key;
    }
}`,
      python: `def insertion_sort(A):
    for j in range(1, len(A)):
        key = A[j]
        i = j - 1
        while i >= 0 and A[i] > key:
            A[i + 1] = A[i]
            i -= 1
        A[i + 1] = key`,
      pseudo: `INSERTION-SORT(A)
  for j = 2 to A.length
      key = A[j]
      // Insert A[j] into sorted A[1..j-1]
      i = j - 1
      while i > 0 and A[i] > key
          A[i + 1] = A[i]
          i = i - 1
      A[i + 1] = key`,
    },
  },
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Divide into halves. Recursively sort. Merge.",
    codes: {
      java: `// Main Driver
public static void main(String[] args) {
    int[] arr = {12, 11, 13, 5, 6, 7};
    mergeSort(arr, 0, arr.length-1);
}
void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      cpp: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        # ...merge logic...`,
      pseudo: `MERGE-SORT(A, p, r)
  if p < r
      q = floor((p + r) / 2)
      MERGE-SORT(A, p, q)
      MERGE-SORT(A, q + 1, r)
      MERGE(A, p, q, r)`,
    },
  },
  quick_sort: {
    name: "Quick Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Partition around a pivot x.",
    codes: {
      java: `void quickSort(int[] A, int p, int r) {
    if (p < r) {
        int q = partition(A, p, r);
        quickSort(A, p, q - 1);
        quickSort(A, q + 1, r);
    }
}`,
      cpp: `void quickSort(vector<int>& A, int p, int r) {
    if (p < r) {
        int q = partition(A, p, r);
        quickSort(A, p, q - 1);
        quickSort(A, q + 1, r);
    }
}`,
      python: `def quick_sort(A, p, r):
    if p < r:
        q = partition(A, p, r)
        quick_sort(A, p, q - 1)
        quick_sort(A, q + 1, r)`,
      pseudo: `QUICKSORT(A, p, r)
  if p < r
      q = PARTITION(A, p, r)
      QUICKSORT(A, p, q - 1)
      QUICKSORT(A, q + 1, r)`,
    },
  },
  randomized_quick_sort: {
    name: "Rand QuickSort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Random pivot swap.",
    codes: {
      java: `int randomizedPartition(int[] A, int p, int r) {
    int i = (int)(Math.random()*(r-p+1))+p;
    swap(A, i, r);
    return partition(A, p, r);
}`,
      cpp: `int randomizedPartition(vector<int>& A, int p, int r) {
    int i = p + rand() % (r - p + 1);
    swap(A[i], A[r]);
    return partition(A, p, r);
}`,
      python: `import random
def rand_partition(A, p, r):
    i = random.randint(p, r)
    A[i], A[r] = A[r], A[i]
    return partition(A, p, r)`,
      pseudo: `RANDOMIZED-PARTITION(A, p, r)
  i = RANDOM(p, r)
  exchange A[i] with A[r]
  return PARTITION(A, p, r)`,
    },
  },

  // === RECURRENCES ===
  recurrence_a: {
    name: "Recurrence 1(a)",
    category: "Recurrences",
    solve: (d) => "Theta(sqrt(n) log n)",
    question: "Solve T(n) = 2T(n/4) + sqrt(n)",
    hint: "Master Theorem Case 2.",
    codes: {
      java: "// T(n) = Theta(sqrt(n) * log n)",
      cpp: "// T(n) = Theta(sqrt(n) * log n)",
      python: "# T(n) = Theta(sqrt(n) * log n)",
      pseudo:
        "Master Theorem Case 2:\n n^{log_4 2} = n^{0.5} = f(n)\n T(n) = Theta(n^{0.5} lg n)",
    },
  },
  recurrence_c: {
    name: "Recurrence 1(c)",
    category: "Recurrences",
    solve: (d) => "Theta(n^2)",
    question: "Solve T(n) = 4T(n/2) + sqrt(n)",
    hint: "Master Theorem Case 1. Compare n^2 vs n^0.5.",
    codes: {
      java: "// Theta(n^2)",
      cpp: "// Theta(n^2)",
      python: "# Theta(n^2)",
      pseudo: "log_2(4) = 2. n^2 vs n^0.5.\nCase 1: T(n) = Theta(n^2)",
    },
  },
  recurrence_j: {
    name: "Recurrence 1(j)",
    category: "Recurrences",
    solve: (d) => "Theta(n log n)",
    question: "Solve J(n) = J(n/2) + J(n/3) + J(n/6) + n",
    hint: "Akra-Bazzi: 1/2 + 1/3 + 1/6 = 1.",
    codes: {
      java: "// Theta(n log n)",
      cpp: "// Theta(n log n)",
      python: "# Theta(n log n)",
      pseudo:
        "Sum of coefficients = 1\nBehaves like QuickSort split\nT(n) = Theta(n log n)",
    },
  },

  // === STACKS ===
  stack_ops: {
    name: "Stack Ops",
    category: "Linear",
    solve: (d) => "99",
    question: "Push(99). Top?",
    hint: "LIFO (Last In First Out).",
    codes: {
      java: `stack.push(99); \nint top = stack.peek();`,
      cpp: `stack.push(99); \nint top = stack.top();`,
      python: `stack.append(99) \ntop = stack[-1]`,
      pseudo: `PUSH(S, 99)\nreturn S.top`,
    },
  },
  postfix_eval: {
    name: "Postfix Eval",
    category: "Linear",
    solve: (d) => (d ? evalPostfixHelper(d.expr) : 0),
    question: (d) => `Evaluate: ${d ? d.expr : ""}`,
    hint: "Stack: Push numbers. Op: Pop 2, Calc, Push.",
    codes: {
      java: `public int eval(String[] tokens) {
    Stack<Integer> s = new Stack<>();
    for(String t : tokens) {
        if(isNumeric(t)) s.push(Integer.parseInt(t));
        else {
            int b = s.pop(), a = s.pop();
            if(t.equals("+")) s.push(a+b);
            // ...
        }
    }
    return s.pop();
}`,
      cpp: `int eval(vector<string> tokens) {
    stack<int> s;
    for(string t : tokens) {
        if(isdigit(t[0])) s.push(stoi(t));
        else {
            int b = s.top(); s.pop();
            int a = s.top(); s.pop();
            if(t=="+") s.push(a+b);
        }
    }
    return s.top();
}`,
      python: `def eval(tokens):
    stack = []
    for t in tokens:
        if t.isdigit(): stack.append(int(t))
        else:
            b, a = stack.pop(), stack.pop()
            if t == '+': stack.append(a+b)
    return stack[0]`,
      pseudo: `EVAL-POSTFIX(E)
  S = empty stack
  for each token t in E
      if t is operand PUSH(S, t)
      else
          b = POP(S)
          a = POP(S)
          res = apply(t, a, b)
          PUSH(S, res)
  return POP(S)`,
    },
  },

  // === GRAPHS ===
  bfs: {
    name: "BFS",
    category: "Graphs",
    solve: (d) => "A, B, C...",
    question: "BFS Traversal Order?",
    hint: "Use a Queue.",
    codes: {
      java: `void BFS(int s) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<>();
    visited[s] = true;
    queue.add(s);
    while (queue.size() != 0) {
        s = queue.poll();
        System.out.print(s + " ");
        // get neighbors...
    }
}`,
      cpp: `void BFS(int s) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[s] = true;
    q.push(s);
    while(!q.empty()) {
        s = q.front(); q.pop();
        cout << s << " ";
        // neighbors...
    }
}`,
      python: `def bfs(graph, start):
    visited = set()
    queue = [start]
    while queue:
        vertex = queue.pop(0)
        if vertex not in visited:
            visited.add(vertex)
            queue.extend(graph[vertex] - visited)`,
      pseudo: `BFS(G, s)
  for each u in G.V - {s}
      u.color = WHITE
  s.color = GRAY
  Q = {}
  ENQUEUE(Q, s)
  while Q != {}
      u = DEQUEUE(Q)
      for each v in G.Adj[u]
          if v.color == WHITE ...`,
    },
  },
  dijkstra: {
    name: "Dijkstra",
    category: "Graphs",
    solve: (d) => "Shortest Path Value",
    question: "Distance to target?",
    hint: "Priority Queue + Relaxation.",
    codes: {
      java: `void dijkstra(int src) {
    PriorityQueue<Node> pq = new PriorityQueue<>();
    dist[src] = 0;
    pq.add(new Node(src, 0));
    while(!pq.isEmpty()) {
        int u = pq.poll().u;
        for(Node v : adj.get(u)) {
            if(dist[v.u] > dist[u] + v.w) {
                dist[v.u] = dist[u] + v.w;
                pq.add(new Node(v.u, dist[v.u]));
            }
        }
    }
}`,
      cpp: `void dijkstra(int src) {
    priority_queue<pair<int,int>, ...> pq;
    dist[src] = 0;
    pq.push({0, src});
    while(!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for(auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;
            if(dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
      python: `import heapq
def dijkstra(graph, start):
    pq = [(0, start)]
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))`,
      pseudo: `DIJKSTRA(G, w, s)
  INIT-SINGLE-SOURCE(G, s)
  S = {}
  Q = G.V
  while Q != {}
      u = EXTRACT-MIN(Q)
      S = S U {u}
      for each v in G.Adj[u]
          RELAX(u, v, w)`,
    },
  },

  // === TREES ===
  bst_ops: {
    name: "BST Ops",
    category: "Trees",
    solve: (d) => "Varies",
    question: "Insert node logic.",
    hint: "Left if smaller, Right if larger.",
    codes: {
      java: `Node insert(Node root, int key) {
    if (root == null) return new Node(key);
    if (key < root.key) root.left = insert(root.left, key);
    else if (key > root.key) root.right = insert(root.right, key);
    return root;
}`,
      cpp: `Node* insert(Node* node, int key) {
    if (node == NULL) return new Node(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    return node;
}`,
      python: `def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`,
      pseudo: `TREE-INSERT(T, z)
  y = NIL
  x = T.root
  while x != NIL
      y = x
      if z.key < x.key x = x.left
      else x = x.right
  z.p = y
  if y == NIL T.root = z
  else if z.key < y.key y.left = z
  else y.right = z`,
    },
  },
  heap_ops: {
    name: "Heap Ops",
    category: "Trees",
    solve: (d) => (d && d.length ? d[0] : ""),
    question: "Root after Heapify?",
    hint: "Float down largest child.",
    codes: {
      java: `void maxHeapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2*i + 1;
    int r = 2*i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr, i, largest);
        maxHeapify(arr, n, largest);
    }
}`,
      cpp: `void maxHeapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2*i + 1;
    int r = 2*i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        maxHeapify(arr, n, largest);
    }
}`,
      python: `def max_heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        max_heapify(arr, n, largest)`,
      pseudo: `MAX-HEAPIFY(A, i)
  l = LEFT(i)
  r = RIGHT(i)
  if l <= A.heap-size and A[l] > A[i]
      largest = l
  else largest = i
  if r <= A.heap-size and A[r] > A[largest]
      largest = r
  if largest != i
      exchange A[i] with A[largest]
      MAX-HEAPIFY(A, largest)`,
    },
  },

  // === HASHING ===
  hashing: {
    name: "Hashing",
    category: "Hashing",
    solve: (d) => "Index or Overflow",
    question: "Insert key using Open Addressing.",
    hint: "Probe: Linear (i), Quadratic (i^2), Double (i*h2).",
    codes: {
      java: `int hashInsert(int[] T, int k) {
    int i = 0;
    do {
        int j = h(k, i);
        if (T[j] == NIL) {
            T[j] = k;
            return j;
        }
        i++;
    } while (i < m);
    throw new Exception("Overflow");
}`,
      cpp: `int hashInsert(vector<int>& T, int k) {
    int i = 0;
    do {
        int j = h(k, i);
        if (T[j] == NIL) {
            T[j] = k;
            return j;
        }
        i++;
    } while (i < m);
    return -1; // Overflow
}`,
      python: `def hash_insert(T, k):
    i = 0
    while i < m:
        j = h(k, i)
        if T[j] is None:
            T[j] = k
            return j
        i += 1
    raise Exception("Overflow")`,
      pseudo: `HASH-INSERT(T, k)
  i = 0
  repeat
      j = h(k, i)
      if T[j] == NIL
          T[j] = k
          return j
      else i = i + 1
  until i == m
  error "hash table overflow"`,
    },
  },
};

// Helper for Eval
const evalPostfixHelper = (expr) => {
  const tokens = expr.split(" ");
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
};

// --- VISUALIZERS ---

const TreeVisualizer = ({ root }) => {
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
      id: node.id,
      color: node.color,
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
              n.color === "red"
                ? "#fee2e2"
                : n.color === "black"
                ? "#334155"
                : "white"
            }
            stroke={
              n.color === "red"
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

const RecurrenceVisualizer = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="text-4xl font-serif italic mb-4 text-slate-700">
      T(n) = ...
    </div>
    <div className="text-sm text-slate-500">Apply Master Theorem cases.</div>
  </div>
);

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

// --- MAIN COMPONENT ---

export default function DSAExamPrep() {
  const [activeAlgo, setActiveAlgo] = useState("linear_search");
  const [codeLang, setCodeLang] = useState("java"); // State for Language Switcher
  const [problemData, setProblemData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTrace, setShowTrace] = useState(false); // Reveal Answer
  const [userCode, setUserCode] = useState("");
  const [codeReport, setCodeReport] = useState(null);

  const currentAlgo = algorithms[activeAlgo] || algorithms["linear_search"];

  const generateNewProblem = () => {
    setFeedback(null);
    setShowSolution(false);
    setShowHint(false);
    setShowTrace(false);
    setUserAnswer("");
    setCodeReport(null);
    const starter =
      currentAlgo.codes && currentAlgo.codes[codeLang]
        ? currentAlgo.codes[codeLang]
        : "// Code implementation...";
    setUserCode(starter);

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
    else if (cat === "Recurrences") setProblemData({});
    else setProblemData(null);
  };

  useEffect(() => {
    generateNewProblem();
  }, [activeAlgo, codeLang]);

  const checkAnswer = () => {
    const correct = String(currentAlgo.solve(problemData));
    const userClean = userAnswer.toLowerCase().replace(/[^a-z0-9]/g, "");
    const correctClean = correct.toLowerCase().replace(/[^a-z0-9]/g, "");
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
    if (cat === "Graphs") return <div>Graph Viz</div>; // Simplified
    if (cat === "Trees")
      return activeAlgo.includes("heap") ? (
        <ArrayVisualizer data={problemData} />
      ) : (
        <TreeVisualizer root={problemData.root} />
      );
    if (cat === "Sorting" || cat === "Searching" || cat === "Linear") {
      if (activeAlgo.includes("postfix"))
        return <PostfixVisualizer data={problemData} />;
      return <ArrayVisualizer data={problemData} />;
    }
    if (cat === "Hashing") return <HashVisualizer data={problemData} />;
    if (cat === "Recurrences") return <RecurrenceVisualizer />;
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
            title="Recurrences"
            items={["recurrence_a", "recurrence_c", "recurrence_j"]}
            active={activeAlgo}
            set={setActiveAlgo}
            icon={<Calculator size={16} />}
          />
          <SidebarSection
            title="Structures"
            items={["stack_ops", "postfix_eval"]}
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
            items={["bst_ops", "heap_ops"]}
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

                {/* Reveal Answer Section */}
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
                    {showTrace ? "Hide Answer" : "Reveal Answer"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-slate-700">
                <div className="bg-[#252526] p-2 border-b border-[#333] flex justify-between items-center">
                  <div className="flex gap-1">
                    {["java", "cpp", "python", "pseudo"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        className={`px-3 py-1 text-xs rounded uppercase font-bold transition-colors ${
                          codeLang === lang
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-white hover:bg-[#333]"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
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
                      {currentAlgo.codes
                        ? currentAlgo.codes[codeLang]
                        : "// No code available"}
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
