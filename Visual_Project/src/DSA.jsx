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
  return { nodes, edges, matrix, directed, weighted };
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
      java: `public static int linear_search(int arr[], int target){
    for(int i = 0; i < arr.length; i++){
        if(arr[i] == target){
            return i;
        }
    }
    return -1;
}`,
      cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
      pseudo: `LINEAR-SEARCH(A, x)
  1. for i = 1 to A.length
  2.     if A[i] == x
  3.         return i
  4. return NIL`,
    },
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    solve: (d) => (d ? Math.floor(d.length / 2) : -1),
    question: "Index of median element in sorted list?",
    hint: "Sorted input required. Check mid. Recurse Left or Right.",
    codes: {
      java: `public static int binary_Search(int arr[], int n, int target ){
    int low = 0;
    int high = n-1;
    while(low <= high){
        int mid = low + (high-low)/2;
        if(arr[mid] == target){
            return mid;
        }else if(arr[mid] < target){
            low = mid + 1;
        }else{
            high = mid - 1;
        }
    }
    return -1;
}`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      pseudo: `BINARY-SEARCH(A, v)
  1. low = 1
  2. high = A.length
  3. while low <= high
  4.     mid = floor((low + high) / 2)
  5.     if A[mid] == v
  6.         return mid
  7.     elseif A[mid] < v
  8.         low = mid + 1
  9.     else
 10.         high = mid - 1
 11. return NIL`,
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
      java: `public static void insertion_sort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int k = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > k) {
            a[j + 1] = a[j];
            j = j - 1;
        }
        a[j + 1] = k;
    }
}`,
      cpp: `void insertionSort(vector<int>& a) {
    for (int i = 1; i < a.size(); i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j = j - 1;
        }
        a[j + 1] = key;
    }
}`,
      python: `def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key`,
      pseudo: `INSERTION-SORT(A)
  1. for j = 2 to A.length
  2.     key = A[j]
  3.     // Insert A[j] into the sorted sequence A[1..j-1]
  4.     i = j - 1
  5.     while i > 0 and A[i] > key
  6.         A[i + 1] = A[i]
  7.         i = i - 1
  8.     A[i + 1] = key`,
    },
  },
  selection_sort: {
    name: "Selection Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Find min element, swap with current.",
    codes: {
      java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        // Swap
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
      pseudo: `SELECTION-SORT(A)
  1. n = A.length
  2. for i = 1 to n - 1
  3.     min = i
  4.     for j = i + 1 to n
  5.         if A[j] < A[min]
  6.             min = j
  7.     exchange A[i] with A[min]`,
    },
  },
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Divide into halves. Recursively sort. Merge.",
    codes: {
      java: `public static void merge(int arr[], int p, int q, int r){
    int n1 = q - p + 1;
    int n2 = r - q;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for(int i = 0; i < n1; i++) L[i] = arr[p + i];
    for(int j = 0; j < n2; j++) R[j] = arr[q + 1 + j];
    
    int i = 0, j = 0, k = p;
    while(i < n1 && j < n2){
        if(L[i] <= R[j]) { arr[k] = L[i]; i++; }
        else { arr[k] = R[j]; j++; }
        k++;
    }
    while(i < n1) { arr[k] = L[i]; i++; k++; }
    while(j < n2) { arr[k] = R[j]; j++; k++; }
}`,
      pseudo: `MERGE-SORT(A, p, r)
  1. if p < r
  2.     q = floor((p + r) / 2)
  3.     MERGE-SORT(A, p, q)
  4.     MERGE-SORT(A, q + 1, r)
  5.     MERGE(A, p, q, r)`,
    },
  },
  quick_sort: {
    name: "Quick Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    hint: "Partition around a pivot x.",
    codes: {
      java: `public static int partition(int arr[], int p, int r){
    int x = arr[r]; // Pivot
    int i = p-1;
    for(int j=p; j<r; j++){
        if(arr[j] <= x){
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i+1]; arr[i+1] = arr[r]; arr[r] = temp;
    return i+1; 
}`,
      pseudo: `QUICKSORT(A, p, r)
  1. if p < r
  2.     q = PARTITION(A, p, r)
  3.     QUICKSORT(A, p, q - 1)
  4.     QUICKSORT(A, q + 1, r)

PARTITION(A, p, r)
  1. x = A[r]
  2. i = p - 1
  3. for j = p to r - 1
  4.     if A[j] <= x
  5.         i = i + 1
  6.         exchange A[i] with A[j]
  7. exchange A[i + 1] with A[r]
  8. return i + 1`,
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
    int i = (int)(Math.random() * (r - p + 1)) + p;
    swap(A, r, i);
    return partition(A, p, r);
}`,
      pseudo: `RANDOMIZED-PARTITION(A, p, r)
  1. i = RANDOM(p, r)
  2. exchange A[r] with A[i]
  3. return PARTITION(A, p, r)`,
    },
  },

  // === RECURRENCES (DIVIDE & CONQUER) ===
  recurrence_a: {
    name: "Recurrence 1(a)",
    category: "Recurrences",
    question: "Analyze T(n) = 2T(n/4) + sqrt(n)",
    hint: "a=2, b=4. f(n) = n^0.5. Compare n^{log_b a} vs f(n).",
    expected: {
      height: "log_4 n",
      size: "n / 4^i",
      work: "sqrt(n) log n",
      complexity: "Theta(sqrt(n) log n)",
    },
    codes: {
      pseudo: `MASTER THEOREM ANALYSIS:
T(n) = 2T(n/4) + n^(1/2)
1. a = 2, b = 4, f(n) = n^0.5
2. log_b(a) = log_4(2) = 0.5
3. f(n) = Theta(n^(log_b a))
4. Case 2 applies.
5. T(n) = Theta(n^0.5 * log n)`,
    },
  },
  recurrence_c: {
    name: "Recurrence 1(c)",
    category: "Recurrences",
    question: "Analyze T(n) = 4T(n/2) + sqrt(n)",
    hint: "a=4, b=2. f(n) = n^0.5. Compare n^{log_b a}.",
    expected: {
      height: "log_2 n",
      size: "n / 2^i",
      work: "n^2",
      complexity: "Theta(n^2)",
    },
    codes: {
      pseudo: `MASTER THEOREM ANALYSIS:
T(n) = 4T(n/2) + n^(1/2)
1. a = 4, b = 2, f(n) = n^0.5
2. log_b(a) = log_2(4) = 2
3. n^2 vs n^0.5
4. Case 1 applies (Root dominates).
5. T(n) = Theta(n^2)`,
    },
  },
  recurrence_j: {
    name: "Recurrence 1(j)",
    category: "Recurrences",
    question: "Analyze J(n) = J(n/2) + J(n/3) + J(n/6) + n",
    hint: "Akra-Bazzi or Tree Method. Sum of coeffs: 1/2+1/3+1/6=1.",
    expected: {
      height: "log n",
      size: "varies",
      work: "n log n",
      complexity: "Theta(n log n)",
    },
    codes: {
      pseudo: `ANALYSIS (Tree Method):
1. Sum of work fractions: 1/2 + 1/3 + 1/6 = 1
2. Since sum = 1, the total work per level is constant (n).
3. The depth of the tree is logarithmic (dominated by slowest branch log_6/5 n).
4. Total Work = Work per level * Number of levels
5. T(n) = Theta(n log n)`,
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
      java: `public void push(T value) {
    Node<T> newNode = new Node<>(value);
    newNode.next = top;
    top = newNode;
}
public T pop() {
    if (isEmpty()) throw new EmptyStackException();
    T data = top.data;
    top = top.next;
    return data;
}`,
      pseudo: `PUSH(S, x)
  1. S.top = S.top + 1
  2. S[S.top] = x

POP(S)
  1. if STACK-EMPTY(S)
  2.     error "underflow"
  3. else S.top = S.top - 1
  4.     return S[S.top + 1]`,
    },
  },
  postfix_eval: {
    name: "Postfix Eval",
    category: "Linear",
    solve: (d) => (d ? evalPostfixHelper(d.expr) : 0),
    question: (d) => `Evaluate: ${d ? d.expr : ""}`,
    hint: "Stack: Push numbers. Op: Pop 2, Calc, Push.",
    codes: {
      java: `public int evalPostfix(String exp) {
    Stack<Integer> stack = new Stack<>();
    for(char c: exp.toCharArray()) {
        if(Character.isDigit(c)) stack.push(c - '0');
        else {
            int val1 = stack.pop();
            int val2 = stack.pop();
            switch(c) {
                case '+': stack.push(val2+val1); break;
                //...
            }
        }
    }
    return stack.pop();
}`,
      pseudo: `EVAL-POSTFIX(E)
  1. S = empty stack
  2. for each token t in E
  3.     if t is operand
  4.         PUSH(S, t)
  5.     else (t is operator)
  6.         y = POP(S)
  7.         x = POP(S)
  8.         r = APPLY(t, x, y)
  9.         PUSH(S, r)
 10. return POP(S)`,
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
        for (int n : adj[s]) {
            if (!visited[n]) {
                visited[n] = true;
                queue.add(n);
            }
        }
    }
}`,
      pseudo: `BFS(G, s)
  1. for each vertex u in G.V - {s}
  2.     u.color = WHITE
  3.     u.d = INF
  4.     u.pi = NIL
  5. s.color = GRAY, s.d = 0, s.pi = NIL
  6. Q = {}
  7. ENQUEUE(Q, s)
  8. while Q != {}
  9.     u = DEQUEUE(Q)
 10.    for each v in G.Adj[u]
 11.        if v.color == WHITE
 12.            v.color = GRAY
 13.            v.d = u.d + 1
 14.            v.pi = u
 15.            ENQUEUE(Q, v)
 16.    u.color = BLACK`,
    },
  },
  dfs: {
    name: "DFS",
    category: "Graphs",
    solve: (d) => "A, B, C...",
    question: "DFS Traversal Order?",
    hint: "Use Recursion or Stack.",
    codes: {
      java: `void DFSUtil(int v, boolean visited[]) {
    visited[v] = true;
    System.out.print(v + " ");
    for (int n : adj[v]) {
        if (!visited[n]) DFSUtil(n, visited);
    }
}`,
      pseudo: `DFS(G)
  1. for each vertex u in G.V
  2.     u.color = WHITE
  3.     u.pi = NIL
  4. time = 0
  5. for each vertex u in G.V
  6.     if u.color == WHITE
  7.         DFS-VISIT(G, u)

DFS-VISIT(G, u)
  1. time = time + 1
  2. u.d = time
  3. u.color = GRAY
  4. for each v in G.Adj[u]
  5.     if v.color == WHITE
  6.         v.pi = u
  7.         DFS-VISIT(G, v)
  8. u.color = BLACK
  9. time = time + 1
 10. u.f = time`,
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
    while (!pq.isEmpty()) {
        int u = pq.poll().v;
        for (Node v : adj.get(u)) {
            if (dist[v.v] > dist[u] + v.w) {
                dist[v.v] = dist[u] + v.w;
                pq.add(new Node(v.v, dist[v.v]));
            }
        }
    }
}`,
      pseudo: `DIJKSTRA(G, w, s)
  1. INITIALIZE-SINGLE-SOURCE(G, s)
  2. S = {}
  3. Q = G.V
  4. while Q != {}
  5.     u = EXTRACT-MIN(Q)
  6.     S = S U {u}
  7.     for each vertex v in G.Adj[u]
  8.         RELAX(u, v, w)`,
    },
  },
  kruskal: {
    name: "Kruskal's MST",
    category: "Graphs",
    solve: (d) => "MST Weight",
    question: "Weight of MST?",
    hint: "Sort edges by weight. Union-Find.",
    codes: {
      java: `void KruskalMST() {
    // 1. Sort all edges
    // 2. Iterate edges, if find(u) != find(v), union(u, v) & add to MST
}`,
      pseudo: `MST-KRUSKAL(G, w)
  1. A = {}
  2. for each vertex v in G.V
  3.     MAKE-SET(v)
  4. sort the edges of G.E into nondecreasing order by weight w
  5. for each edge (u, v) in G.E, taken in nondecreasing order by weight
  6.     if FIND-SET(u) != FIND-SET(v)
  7.         A = A U {(u, v)}
  8.         UNION(u, v)
  9. return A`,
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
      java: `public static B insertRecursive(B root, int key) {
    if (root == null) {
        return new B(key);
    }
    if (key < root.key) {
        root.left = insertRecursive(root.left, key);
    } else {
        root.right = insertRecursive(root.right, key);
    }
    return root;
}`,
      pseudo: `TREE-INSERT(T, z)
  1. y = NIL
  2. x = T.root
  3. while x != NIL
  4.     y = x
  5.     if z.key < x.key
  6.         x = x.left
  7.     else x = x.right
  8. z.p = y
  9. if y == NIL
 10.    T.root = z
 11. elseif z.key < y.key
 12.    y.left = z
 13. else y.right = z`,
    },
  },
  // --- ADDED ROTATIONS FOR QC CSCI 313 ---
  left_rotate: {
    name: "Left Rotate",
    category: "Trees",
    solve: (d) => "Rotated",
    question: "Implement Left-Rotate(T, x).",
    hint: "x's right child becomes x's parent.",
    codes: {
      java: `void leftRotate(Node x) {
    Node y = x.right;
    x.right = y.left;
    if (y.left != null) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent == null) root = y;
    else if (x == x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
}`,
      pseudo: `LEFT-ROTATE(T, x)
 1. y = x.right             // Set y
 2. x.right = y.left        // Turn y's left subtree into x's right subtree
 3. if y.left != NIL
 4.     y.left.p = x
 5. y.p = x.p               // Link x's parent to y
 6. if x.p == NIL
 7.     T.root = y
 8. elseif x == x.p.left
 9.     x.p.left = y
10. else x.p.right = y
11. y.left = x              // Put x on y's left
12. x.p = y`,
    },
  },
  right_rotate: {
    name: "Right Rotate",
    category: "Trees",
    solve: (d) => "Rotated",
    question: "Implement Right-Rotate(T, y).",
    hint: "y's left child becomes y's parent.",
    codes: {
      java: `void rightRotate(Node y) {
    Node x = y.left;
    y.left = x.right;
    if (x.right != null) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent == null) root = x;
    else if (y == y.parent.right) y.parent.right = x;
    else y.parent.left = x;
    x.right = y;
    y.parent = x;
}`,
      pseudo: `RIGHT-ROTATE(T, y)
 1. x = y.left              // Set x
 2. y.left = x.right        // Turn x's right subtree into y's left subtree
 3. if x.right != NIL
 4.     x.right.p = y
 5. x.p = y.p               // Link y's parent to x
 6. if y.p == NIL
 7.     T.root = x
 8. elseif y == y.p.right
 9.     y.p.right = x
10. else y.p.left = x
11. x.right = y             // Put y on x's right
12. y.p = x`,
    },
  },
  rbt_ops: {
    name: "RBT Ops",
    category: "Trees",
    solve: (d) => "Black-Height",
    question: "Insert/Fixup logic.",
    hint: "Recolor and Rotate to maintain properties.",
    codes: {
      java: `void insertFixup(Node k) {
    while (k.parent.color == RED) {
        if (k.parent == k.parent.parent.right) {
            Node u = k.parent.parent.left; // uncle
            if (u.color == RED) { 
                // Case 1
            } else { 
                // Case 2 & 3
            }
        }
    }
    root.color = BLACK;
}`,
      pseudo: `RB-INSERT-FIXUP(T, z)
  1. while z.p.color == RED
  2.     if z.p == z.p.p.left
  3.         y = z.p.p.right
  4.         if y.color == RED
  5.             z.p.color = BLACK            // Case 1
  6.             y.color = BLACK              // Case 1
  7.             z.p.p.color = RED            // Case 1
  8.             z = z.p.p                    // Case 1
  9.         else if z == z.p.right
 10.             z = z.p                      // Case 2
 11.             LEFT-ROTATE(T, z)            // Case 2
 12.         z.p.color = BLACK                // Case 3
 13.         z.p.p.color = RED                // Case 3
 14.         RIGHT-ROTATE(T, z.p.p)           // Case 3
 15. T.root.color = BLACK`,
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
      pseudo: `MAX-HEAPIFY(A, i)
  1. l = LEFT(i)
  2. r = RIGHT(i)
  3. if l <= A.heap-size and A[l] > A[i]
  4.     largest = l
  5. else largest = i
  6. if r <= A.heap-size and A[r] > A[largest]
  7.     largest = r
  8. if largest != i
  9.     exchange A[i] with A[largest]
 10.    MAX-HEAPIFY(A, largest)`,
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
      java: `int hashInsert(Integer[] T, int k) {
    int i = 0;
    do {
        int j = h(k, i);
        if (T[j] == null) {
            T[j] = k;
            return j;
        }
        i++;
    } while (i < m);
    throw new Exception("Overflow");
}`,
      pseudo: `HASH-INSERT(T, k)
  1. i = 0
  2. repeat
  3.     j = h(k, i)
  4.     if T[j] == NIL
  5.         T[j] = k
  6.         return j
  7.     i = i + 1
  8. until i == m
  9. error "hash table overflow"`,
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

// --- NEW GRAPH VISUALIZER FOR CSCI 313 ---
const GraphVisualizer = ({ data }) => {
  if (!data || !data.nodes) return <div>No Graph Data</div>;
  const { nodes, edges } = data;
  const width = 400;
  const height = 300;
  const cx = 200;
  const cy = 150;
  const r = 100;

  // Simple circular layout for nodes
  const getNodePos = (i, total) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  return (
    <svg width={width} height={height} className="mx-auto overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="24"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
        </marker>
      </defs>
      {edges.map((e, i) => {
        const start = getNodePos(e.source, nodes.length);
        const end = getNodePos(e.target, nodes.length);
        return (
          <g key={`e-${i}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#cbd5e1"
              strokeWidth="2"
              markerEnd={data.directed ? "url(#arrowhead)" : ""}
            />
            {e.weight > 1 && (
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2}
                dy="-5"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="10"
                fontWeight="bold"
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
          <g key={`n-${n.id}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="16"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x={pos.x}
              y={pos.y}
              dy="5"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#1e40af"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// --- MAIN COMPONENT ---

export default function DSAExamPrep() {
  const [activeAlgo, setActiveAlgo] = useState("linear_search");
  const [codeLang, setCodeLang] = useState("java");
  const [problemData, setProblemData] = useState(null);

  // Generic single-input answer state
  const [userAnswer, setUserAnswer] = useState("");

  // Specific multi-field state for Recurrences
  const [recInputs, setRecInputs] = useState({
    height: "",
    size: "",
    work: "",
    complexity: "",
  });

  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [codeReport, setCodeReport] = useState(null);

  const currentAlgo = algorithms[activeAlgo] || algorithms["linear_search"];

  const generateNewProblem = () => {
    setFeedback(null);
    setShowSolution(false);
    setShowHint(false);
    setShowTrace(false);
    setUserAnswer("");
    setRecInputs({ height: "", size: "", work: "", complexity: "" });
    setCodeReport(null);

    // START BLANK - The user has to click "Reveal Key" to see the code.
    const starter = `// Write your ${currentAlgo.name} in ${
      codeLang === "pseudo" ? "Pseudo-code" : codeLang
    } here...\n\n`;
    setUserCode(starter);

    const cat = currentAlgo.category;
    if (cat === "Graphs")
      setProblemData(
        generateGraph(5, true, true)
      ); // defaulting to directed for viz
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
    if (currentAlgo.category === "Recurrences") {
      // Validate all 4 fields for Recurrences
      const expected = currentAlgo.expected || {};

      const clean = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

      const isHeightCorrect = clean(recInputs.height).includes(
        clean(expected.height)
      );
      const isSizeCorrect =
        clean(recInputs.size).includes(clean(expected.size)) ||
        clean(expected.size) === "varies";
      const isWorkCorrect = clean(recInputs.work).includes(
        clean(expected.work)
      );
      const isComplexCorrect = clean(recInputs.complexity).includes(
        clean(expected.complexity)
      );

      if (
        isHeightCorrect &&
        isSizeCorrect &&
        isWorkCorrect &&
        isComplexCorrect
      ) {
        setFeedback("correct");
      } else {
        setFeedback("incorrect");
      }
    } else {
      // Standard single-field check
      const correct = String(currentAlgo.solve(problemData));
      const userClean = userAnswer.toLowerCase().replace(/[^a-z0-9]/g, "");
      const correctClean = correct.toLowerCase().replace(/[^a-z0-9]/g, "");
      setFeedback(userClean === correctClean ? "correct" : "incorrect");
      setCodeReport(analyzeCode(userCode, activeAlgo));
    }
  };

  const renderVisualizer = () => {
    if (!problemData) return <div>Loading...</div>;
    const cat = currentAlgo.category;
    // --- UPDATED: Use new GraphVisualizer ---
    if (cat === "Graphs") return <GraphVisualizer data={problemData} />;
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
            items={[
              "bst_ops",
              "left_rotate",
              "right_rotate",
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

                {/* Conditional Inputs based on Category */}
                {currentAlgo.category === "Recurrences" ? (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Height of Tree
                      </label>
                      <input
                        type="text"
                        value={recInputs.height}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, height: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                        placeholder="e.g. log_b n"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Size of ith Subproblem
                      </label>
                      <input
                        type="text"
                        value={recInputs.size}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, size: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                        placeholder="e.g. n / b^i"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Total Work Done
                      </label>
                      <input
                        type="text"
                        value={recInputs.work}
                        onChange={(e) =>
                          setRecInputs({ ...recInputs, work: e.target.value })
                        }
                        className="w-full border p-2 rounded mt-1"
                        placeholder="Summation or expression"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Time Complexity
                      </label>
                      <input
                        type="text"
                        value={recInputs.complexity}
                        onChange={(e) =>
                          setRecInputs({
                            ...recInputs,
                            complexity: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded mt-1"
                        placeholder="Theta(...)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center mb-4">
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
                  </div>
                )}

                {/* Reveal Answer Section */}
                {showTrace && currentAlgo.category !== "Recurrences" && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <span className="font-bold">Answer: </span>
                    {String(currentAlgo.solve(problemData))}
                  </div>
                )}

                {showTrace && currentAlgo.category === "Recurrences" && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono">
                    <div className="font-bold border-b border-slate-300 pb-1 mb-1">
                      Expected:
                    </div>
                    <div>Height: {currentAlgo.expected.height}</div>
                    <div>Size: {currentAlgo.expected.size}</div>
                    <div>Work: {currentAlgo.expected.work}</div>
                    <div>Complexity: {currentAlgo.expected.complexity}</div>
                  </div>
                )}

                <div className="flex gap-3 items-center">
                  <button
                    onClick={checkAnswer}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Check
                  </button>
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
              {codeReport && currentAlgo.category !== "Recurrences" && (
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
