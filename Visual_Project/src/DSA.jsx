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
  if (algoType.includes("quick_sort")) {
    check(["partition", "pivot"], "Partition Logic", 2);
    check(["swap", "temp"], "Swap Logic", 2);
    check(["<", ">"], "Comparison", 2);
  } else if (algoType === "linear_search") {
    check(["for", "while"], "Loop", 2);
    check(["==", "equals"], "Comparison", 2);
  } else if (algoType === "hashing") {
    check(["%", "mod"], "Modulo Operator", 2);
    check(["while", "for"], "Probing Loop", 2);
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

// NEW: Generator for Hash Table Data with Strategy
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

const generatePostfixData = () => {
  const ops = ["+", "-", "*"];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  const op1 = ops[Math.floor(Math.random() * ops.length)];
  const op2 = ops[Math.floor(Math.random() * ops.length)];
  return {
    expr: `${a} ${b} ${op1} ${c} ${op2}`,
    hint: "Push operands. Pop 2 on operator.",
  };
};

// --- ALGORITHMS & MULTI-LANGUAGE CODES ---

const algorithms = {
  // === SEARCHING ===
  linear_search: {
    name: "Linear Search",
    category: "Searching",
    signature: "linearSearch(arr, target)",
    hint: "Iterate 0 to n-1.",
    solve: (d) => {
      if (!d) return -1;
      const t = d[Math.floor(d.length / 2)];
      return d.indexOf(t);
    },
    question: (d) => `Index of ${d ? d[Math.floor(d.length / 2)] : "x"}?`,
    codes: {
      java: `public class Search {
    public static int linearSearch(int[] arr, int target) {
        for(int i=0; i<arr.length; i++) {
            if(arr[i] == target) return i;
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] data = {5, 2, 9, 1, 5, 6}; 
        int target = 9;
        System.out.println("Index: " + linearSearch(data, target));
    }
}`,
      cpp: `int linearSearch(vector<int>& arr, int target) {
    for(int i=0; i<arr.size(); i++) {
        if(arr[i] == target) return i;
    }
    return -1;
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
      pseudo: `LINEAR-SEARCH(A, v)
  for i = 1 to A.length
      if A[i] == v
          return i
  return NIL`,
    },
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    signature: "Binary-Search(A, t)",
    hint: "Sorted array. Compare mid.",
    solve: (d) => (d ? Math.floor(d.length / 2) : -1),
    question: "Index of median element (in sorted array)?",
    codes: {
      java: `int binarySearch(int[] arr, int t) {
    int l=0, r=arr.length-1;
    while (l <= r) {
        int mid = l + (r-l)/2;
        if (arr[mid] == t) return mid;
        if (arr[mid] < t) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
      cpp: `int binarySearch(vector<int>& arr, int t) {
    int l=0, r=arr.size()-1;
    while(l <= r) {
        int mid = l + (r-l)/2;
        if(arr[mid] == t) return mid;
        if(arr[mid] < t) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, t):
    l, r = 0, len(arr)-1
    while l <= r:
        mid = (l + r) // 2
        if arr[mid] == t: return mid
        elif arr[mid] < t: l = mid + 1
        else: r = mid - 1
    return -1`,
      pseudo: `BINARY-SEARCH(A, t)
  low = 1, high = A.length
  while low <= high
      mid = floor((low+high)/2)
      if A[mid] == t return mid
      if A[mid] < t low = mid + 1
      else high = mid - 1
  return NIL`,
    },
  },

  // === SORTING ===
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    signature: "Insertion-Sort(A)",
    hint: "Insert A[j] into sorted A[0..j-1].",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    codes: {
      java: `void insertionSort(int[] arr) {
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
      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
      pseudo: `INSERTION-SORT(A)
  for j = 2 to A.length
      key = A[j]
      i = j - 1
      while i > 0 and A[i] > key
          A[i+1] = A[i]
          i = i - 1
      A[i+1] = key`,
    },
  },
  selection_sort: {
    name: "Selection Sort",
    category: "Sorting",
    signature: "Selection-Sort(A)",
    hint: "Find min in unsorted part, swap to end of sorted part.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    codes: {
      java: `void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < arr.length; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
      cpp: `void selectionSort(vector<int>& arr) {
    for (int i = 0; i < arr.size()-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < arr.size(); j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
      python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
      pseudo: `SELECTION-SORT(A)
  n = A.length
  for i = 1 to n - 1
      min = i
      for j = i + 1 to n
          if A[j] < A[min]
              min = j
      exchange A[i] with A[min]`,
    },
  },
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    signature: "Merge-Sort(A, p, r)",
    hint: "Divide, Conquer, Combine.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    codes: {
      java: `void mergeSort(int arr[], int l, int r) {
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
        mid = len(arr)//2
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
    signature: "QuickSort(A, p, r)",
    hint: "Partition around pivot.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    codes: {
      java: `int partition(int arr[], int low, int high) {
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
}`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
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
    signature: "Randomized-Partition(A, p, r)",
    hint: "Swap pivot with random element first.",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Sort the array.",
    codes: {
      java: `int randomizedPartition(int arr[], int low, int high) {
    int r = (int)(Math.random() * (high-low+1)) + low;
    int temp = arr[r]; arr[r] = arr[high]; arr[high] = temp;
    return partition(arr, low, high);
}`,
      cpp: `int randomizedPartition(vector<int>& arr, int low, int high) {
    int r = low + rand() % (high - low);
    swap(arr[r], arr[high]);
    return partition(arr, low, high);
}`,
      python: `import random
def rand_partition(arr, low, high):
    r = random.randint(low, high)
    arr[r], arr[high] = arr[high], arr[r]
    return partition(arr, low, high)`,
      pseudo: `RANDOMIZED-PARTITION(A, p, r)
  i = RANDOM(p, r)
  exchange A[i] with A[r]
  return PARTITION(A, p, r)`,
    },
  },

  // === RECURRENCES (UPDATED WITH SHOW WORK) ===
  recurrence_a: {
    name: "Recurrence 1(a)",
    category: "Recurrences",
    signature: "T(n) = 2T(n/4) + sqrt(n)",
    hint: "Master Theorem. a=2, b=4, f(n)=n^0.5.",
    solve: (d) => "Theta(sqrt(n) log n)",
    question: "Solve T(n) = 2T(n/4) + sqrt(n)",
    getWork: (d) => `Master Theorem Analysis:
1. Identify coefficients:
   a = 2, b = 4, f(n) = n^(0.5) = sqrt(n)

2. Calculate n^(log_b a):
   log_4(2) = 0.5
   So, n^(log_b a) = n^0.5

3. Compare f(n) with n^(log_b a):
   f(n) = n^0.5
   n^(log_b a) = n^0.5
   
   They are equal! This is Case 2 of the Master Theorem.

4. Solution:
   T(n) = Theta(n^0.5 * log n) = Theta(sqrt(n) log n)`,
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
    signature: "T(n) = 4T(n/2) + sqrt(n)",
    hint: "Master Theorem. a=4, b=2. Compare n^2 vs n^0.5.",
    solve: (d) => "Theta(n^2)",
    question: "Solve T(n) = 4T(n/2) + sqrt(n)",
    getWork: (d) => `Master Theorem Analysis:
1. Identify coefficients:
   a = 4, b = 2, f(n) = n^(0.5)

2. Calculate n^(log_b a):
   log_2(4) = 2
   So, n^(log_b a) = n^2

3. Compare f(n) with n^(log_b a):
   f(n) = n^0.5
   n^2 vs n^0.5
   
   n^0.5 is polynomially smaller than n^2 (n^(2 - 1.5)).
   This is Case 1 of the Master Theorem.

4. Solution:
   T(n) = Theta(n^2)`,
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
    signature: "J(n) = J(n/2)+J(n/3)+J(n/6)+n",
    hint: "Sum of coeffs (1/2 + 1/3 + 1/6 = 1).",
    solve: (d) => "Theta(n log n)",
    question: "Solve J(n) = J(n/2) + J(n/3) + J(n/6) + n",
    getWork: (d) => `Partition Analysis (Akra-Bazzi):
1. Look at coefficients of subproblems:
   1/2, 1/3, 1/6

2. Sum them up:
   1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1

3. Analysis:
   Since the sum of the split factors is exactly 1, and the cost term is linear (n), this recurrence behaves like QuickSort or MergeSort where the problem is split into parts that sum to the whole.

4. Solution:
   T(n) = Theta(n log n)`,
    codes: {
      java: "// Theta(n log n)",
      cpp: "// Theta(n log n)",
      python: "# Theta(n log n)",
      pseudo:
        "Sum of coefficients = 1\nBehaves like QuickSort split\nT(n) = Theta(n log n)",
    },
  },

  // === STACKS & QUEUES ===
  stack_ops: {
    name: "Stack Operations",
    category: "Linear",
    signature: "Push(S, x)",
    hint: "LIFO.",
    solve: (d) => "99",
    question: "Push(99). What is Top?",
    codes: {
      java: `stack.push(99); \nint top = stack.peek();`,
      cpp: `stack.push(99); \nint top = stack.top();`,
      python: `stack.append(99) \ntop = stack[-1]`,
      pseudo: `PUSH(S, 99)\nreturn S.top`,
    },
  },
  queue_ops: {
    name: "Queue Operations",
    category: "Linear",
    signature: "Enqueue(Q, x)",
    hint: "FIFO.",
    solve: (d) => (d && d.length > 1 ? d[1] : ""),
    question: "Dequeue(), new Head?",
    codes: {
      java: `queue.add(x); \nint head = queue.peek();`,
      cpp: `q.push(x); \nint head = q.front();`,
      python: `q.append(x) \nhead = q[0]`,
      pseudo: `ENQUEUE(Q, x)\nreturn Q.head`,
    },
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
    codes: {
      java: `public int eval(String[] tokens) {
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
      cpp: `int eval(vector<string> tokens) {
    stack<int> s;
    for(string t : tokens) {
        if(isdigit(t[0])) s.push(stoi(t));
        else {
            int b = s.top(); s.pop();
            int a = s.top(); s.pop();
            // calc...
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
            # calc...`,
      pseudo: `EVAL-POSTFIX(E)
  S = empty stack
  for each token t in E
      if t is operand PUSH(S, t)
      else
          b = POP(S)
          a = POP(S)
          PUSH(S, calc(a, t, b))`,
    },
  },

  // === TREES & HASHING ===
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
    codes: {
      java: `void inorder(Node x) { if(x!=null) { inorder(x.left); print(x.val); inorder(x.right); } }`,
      cpp: `void inorder(Node* x) { if(x) { inorder(x->left); cout<<x->val; inorder(x->right); } }`,
      python: `def inorder(x): if x: inorder(x.left); print(x.val); inorder(x.right)`,
      pseudo: `INORDER(x)
  if x != NIL
      INORDER(x.left)
      print x.key
      INORDER(x.right)`,
    },
  },
  bst_search: {
    name: "BST Search",
    category: "Trees",
    signature: "Search(x, k)",
    hint: "k < x.key ? left : right",
    solve: (d) => (d && d.values.includes(d.target) ? "Found" : "Not Found"),
    question: (d) => `Search for ${d ? d.target : "x"}.`,
    codes: {
      java: `Node search(Node x, int k) { 
    if (x==null || k==x.key) return x;
    if (k < x.key) return search(x.left, k);
    else return search(x.right, k); 
}`,
      cpp: `Node* search(Node* x, int k) {
    if (x==NULL || k==x->key) return x;
    if (k < x->key) return search(x->left, k);
    else return search(x->right, k);
}`,
      python: `def search(x, k):
    if x is None or k == x.key: return x
    if k < x.key: return search(x.left, k)
    else: return search(x.right, k)`,
      pseudo: `TREE-SEARCH(x, k)
  if x == NIL or k == x.key
      return x
  if k < x.key
      return TREE-SEARCH(x.left, k)
  else return TREE-SEARCH(x.right, k)`,
    },
  },
  bst_ops: {
    name: "BST Insert/Delete",
    category: "Trees",
    signature: "Tree-Insert(T, z)",
    hint: "Standard BST insertion logic.",
    solve: (d) => "Varies",
    question: "Code the Tree-Insert logic.",
    codes: {
      java: `void insert(Node root, int key) {
    if(key < root.key) { if(root.left==null) root.left=new Node(key); else insert(root.left,key); }
    else { if(root.right==null) root.right=new Node(key); else insert(root.right,key); }
}`,
      cpp: `void insert(Node* root, int key) { ... }`,
      python: `def insert(root, key): ...`,
      pseudo: `TREE-INSERT(T, z)
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
  },
  rbt_ops: {
    name: "Red-Black Tree",
    category: "Trees",
    signature: "RB-Insert(T, z)",
    hint: "Insert Red, then Fixup.",
    solve: (d) => "Balanced",
    question: "Write logic for RB-Insert-Fixup.",
    codes: {
      java: `// Fixup Logic`,
      cpp: `// Fixup Logic`,
      python: `# Fixup Logic`,
      pseudo: `RB-INSERT-FIXUP(T, z)
  while z.p.color == RED
      if z.p == z.p.p.left
          y = z.p.p.right
          if y.color == RED
              z.p.color = BLACK; y.color = BLACK
              z.p.p.color = RED; z = z.p.p
          else if z == z.p.right
              z = z.p; LEFT-ROTATE(T, z)
          else ...`,
    },
  },
  heap_ops: {
    name: "Max-Heapify",
    category: "Trees",
    signature: "Max-Heapify(A, i)",
    hint: "Float down largest.",
    solve: (d) => (d && d.length ? d[0] : ""),
    question: "Root after Heapify?",
    codes: {
      java: `void maxHeapify(int[] A, int i) { ... }`,
      cpp: `void maxHeapify(vector<int>& A, int i) { ... }`,
      python: `def max_heapify(A, i): ...`,
      pseudo: `MAX-HEAPIFY(A, i)
   l = left(i); r = right(i);
   largest = (A[l] > A[i]) ? l : i;
   if (A[r] > A[largest]) largest = r;
   if (largest != i) { swap(A[i], A[largest]); MaxHeapify(A, largest); }`,
    },
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
    // NEW: SHOW WORK FOR HASHING
    getWork: (d) => {
      if (!d) return "";
      const { table, key, size, strategy } = d;
      let log = [
        `Strategy: ${strategy}`,
        `Key: ${key}`,
        `Table Size (m): ${size}`,
        "",
      ];
      let i = 0;
      let idx = key % size;
      const h2 = 1 + (key % (size - 1));

      log.push(`Attempt 0: h(${key}, 0) = ${idx}`);
      if (table[idx] === null) {
        log.push(`-> Slot ${idx} is Empty. Insert here.`);
        return log.join("\n");
      }
      log.push(`-> Slot ${idx} is Occupied. Probing...`);

      while (table[idx] !== null && i < size) {
        i++;
        let expr = "";
        let val = 0;
        if (strategy === "Linear") {
          val = (key + i) % size;
          expr = `(${key} + ${i}) % ${size}`;
        } else if (strategy === "Quadratic") {
          val = (key + i * i) % size;
          expr = `(${key} + ${i}^2) % ${size}`;
        } else {
          val = (key + i * h2) % size;
          expr = `(${key} + ${i}*${h2}) % ${size}`;
        }
        idx = val;
        let status = table[idx] === null ? "Empty -> Insert" : "Occupied";
        log.push(
          `Attempt ${i}: h(${key}, ${i}) = ${expr} = ${val} [${status}]`
        );
        if (table[idx] === null) break;
      }
      return log.join("\n");
    },
    question: (d) => `Insert ${d ? d.key : 0} using ${d ? d.strategy : ""}.`,
    codes: {
      java: `int hashInsert(int[] T, int k) { ... }`,
      cpp: `int hashInsert(vector<int>& T, int k) { ... }`,
      python: `def hash_insert(T, k): ...`,
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
  complexity: {
    name: "Complexity Quiz",
    category: "Recurrences",
    signature: "Big-O",
    hint: "Analyze loops.",
    solve: (d) => (d ? d.answer : ""),
    question: (d) => `Complexity of ${d ? d.algo : ""}?`,
    codes: {
      java: `// O(n log n)`,
      cpp: `// O(n log n)`,
      python: `# O(n log n)`,
      pseudo: `// Cheat Sheet
// Merge Sort: O(n log n)
// Quick Sort: O(n^2) worst, O(n log n) avg
// Heapsort: O(n log n)`,
    },
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
  const [codeLang, setCodeLang] = useState("java"); // State for Language Switcher
  const [problemData, setProblemData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTrace, setShowTrace] = useState(false); // Used for "Reveal Answer"
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
    // Dynamic starter code based on language
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
        activeAlgo.includes("heap") ? generateHeapData() : generateBSTData(7)
      );
    else if (cat === "Sorting" || cat === "Searching")
      setProblemData(generateSortData(7));
    else if (cat === "Linear" && activeAlgo.includes("stack"))
      setProblemData(generateListData(4));
    else if (cat === "Hashing")
      setProblemData(generateHashData(7)); // New Hashing Data
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
            items={["insertion_sort", "merge_sort", "quick_sort"]}
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
            items={["stack_ops", "bfs", "bst_ops"]}
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

                {/* Reveal Answer / Show Work Section */}
                {showTrace && (
                  <div className="mb-4 p-3 bg-slate-100 text-slate-700 text-sm rounded border border-slate-200 font-mono whitespace-pre-wrap">
                    <span className="font-bold">Answer / Work: </span>
                    {currentAlgo.getWork
                      ? currentAlgo.getWork(problemData)
                      : String(currentAlgo.solve(problemData))}
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
