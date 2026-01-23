export const algorithms = {
  linear_search: {
    name: "Linear Search",
    category: "Searching",
    solve: (d) => {
      if (!d) return -1;
      const target = d[d.length - 1];
      return d.indexOf(target);
    },
    question: (d) =>
      d && d.length ? `What is the index of ${d[d.length - 1]}?` : "Loading...",
    hint: "Scan from index 0 to n. Return first match.",
    codes: {
      java: `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
    }`,
      cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
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
    for i = 0 to A.length - 1 do
        if A[i] == x then return i
    end for
    return NIL`,
    },
  },
  binary_search: {
    name: "Binary Search",
    category: "Searching",
    solve: (d) => {
      if (!d) return -1;
      const sorted = [...d].sort((a, b) => a - b);
      return Math.floor(sorted.length / 2);
    },
    question: (d) => {
      if (!d || !d.length) return "Loading...";
      const sorted = [...d].sort((a, b) => a - b);
      const target = sorted[Math.floor(sorted.length / 2)];
      return `Array is sorted: [${sorted.join(", ")}]. Index of ${target}?`;
    },
    hint: "Check mid. If target < mid, search left. Else search right.",
    codes: {
      java: `public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
    }`,
      cpp: `int binarySearch(int arr[], int low, int high, int target) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
    }`,
      python: `def binary_search(arr, target):
      low, high = 0, len(arr) - 1
    while low <= high:
      mid = (low + high) // 2
      if arr[mid] == target: return mid
      elif arr[mid] < target: low = mid + 1
      else: high = mid - 1
    return -1`,
      pseudo: `BINARY-SEARCH(A, v)
    low = 0, high = A.length - 1
    while low <= high do
        mid = floor((low + high) / 2)
        if A[mid] == v then return mid
        else if A[mid] < v then low = mid + 1
        else high = mid - 1
    end while
    return NIL`,
    },
  },
  insertion_sort: {
    name: "Insertion Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Result after sorting?",
    hint: "Build sorted array one item at a time.",
    codes: {
      java: `public void insertionSort(int[] a) {
      for (int i = 1; i < a.length; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
      }
    }`,
      pseudo: `INSERTION-SORT(A)
    for j = 1 to A.length - 1 do
        key = A[j]
        i = j - 1
        while i >= 0 and A[i] > key do
            A[i + 1] = A[i]
            i = i - 1
        end while
        A[i + 1] = key
    end for`,
      cpp: `void insertionSort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
    }`,
      python: `def insertion_sort(a):
      for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key`,
    },
  },
  selection_sort: {
    name: "Selection Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Result after sorting?",
    hint: "Find min, swap with current index.",
    codes: {
      java: `void selectionSort(int[] arr) {
    for (int i = 0; i < n-1; i++) {
        int min = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min]) min = j;
        swap(arr, i, min);
    }
}`,
      pseudo: `SELECTION-SORT(A)
    n = A.length
    for i = 0 to n - 2 do
        min = i
        for j = i + 1 to n - 1 do
            if A[j] < A[min] then min = j
        end for
        exchange A[i] with A[min]
    end for`,
      cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        swap(arr[i], arr[min_idx]);
    }
    }`,
      python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]: min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    },
  },
  merge_sort: {
    name: "Merge Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Result after sorting?",
    hint: "Split half, sort recursively, merge.",
    codes: {
      java: `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
void mergeSort(int arr[], int l, int r) {
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
        L, R = arr[:mid], arr[mid:]
        merge_sort(L); merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]: arr[k] = L[i]; i += 1
            else: arr[k] = R[j]; j += 1
            k += 1
        while i < len(L): arr[k] = L[i]; i += 1; k += 1
        while j < len(R): arr[k] = R[j]; j += 1; k += 1`,

      pseudo: `MERGE-SORT(A, p, r)
    if p < r then
        q = floor((p + r) / 2)
        MERGE-SORT(A, p, q)
        MERGE-SORT(A, q + 1, r)
        MERGE(A, p, q, r)
    end if`,
    },
  },
  bubble_sort: {
    name: "Bubble Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: (d) =>
      d && d.length
        ? `Given the array [${d.join(
            ", ",
          )}], what is the result after one full pass (largest element bubbled to the end)?`
        : "Loading...",
    hint: "Compare adjacent elements (arr[j], arr[j+1]) and swap if the first is greater than the second.",
    codes: {
      java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
}`,
      cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
      pseudo: `BUBBLE-SORT(A)
    for i = 0 to A.length - 2
        for j = A.length - 1 downto i + 1
            if A[j] < A[j - 1]
                exchange A[j] with A[j - 1]`,
    },
  },
  quick_sort: {
    name: "Quick Sort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Result after sorting?",
    hint: "Partition array into < pivot and > pivot.",
    codes: {
      java: `void quickSort(int[] arr, int p, int r) {
    if (p < r) {
        int q = partition(arr, p, r);
        quickSort(arr, p, q - 1);
        quickSort(arr, q + 1, r);
    }
}`,
      cpp: `void quickSort(int arr[], int p, int r) {
    if (p < r) {
        int q = partition(arr, p, r); // Partition the array
        quickSort(arr, p, q - 1);    // Sort the left subarray
        quickSort(arr, q + 1, r);    // Sort the right subarray
    }
}`,
      python: `def partition(arr, p, r):
    pivot = arr[r]
    i = p - 1
    for j in range(p, r):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[r] = arr[r], arr[i + 1]
    return i + 1

def quick_sort(arr, p, r):
    if p < r:
        q = partition(arr, p, r)
        quick_sort(arr, p, q - 1)
        quick_sort(arr, q + 1, r)`,
      pseudo: `QUICKSORT(A, p, r)
    if p < r then
        q = PARTITION(A, p, r)
        QUICKSORT(A, p, q - 1)
        QUICKSORT(A, q + 1, r)
    end if`,
    },
  },
  randomized_quick_sort: {
    name: "Rand QuickSort",
    category: "Sorting",
    solve: (d) => (d ? [...d].sort((a, b) => a - b).join(", ") : ""),
    question: "Result after sorting?",
    hint: "Random pivot swap.",
    codes: {
      java: `int randomizedPartition(int[] A, int p, int r) {
    int i = (int)(Math.random() * (r - p + 1)) + p;
    swap(A, r, i);
    return partition(A, p, r);
}`,
      pseudo: `RANDOMIZED-PARTITION(A, p, r)
    i = RANDOM(p, r)
    exchange A[r] with A[i]
    return PARTITION(A, p, r)`,
    },

    cpp: `int randomizedPartition(int arr[], int p, int r) {
    int i = p + rand() % (r - p + 1);
    swap(arr[r], arr[i]);
    return partition(arr, p, r);
}
void randomizedQuickSort(int arr[], int p, int r) {
    if (p < r) {
        int q = randomizedPartition(arr, p, r);
        randomizedQuickSort(arr, p, q - 1);
        randomizedQuickSort(arr, q + 1, r);
    }
}
}`,
    python: `import random
def randomized_partition(arr, p, r):
    i = random.randint(p, r)
    arr[r], arr[i] = arr[i], arr[r]
    return partition(arr, p, r)
def randomized_quick_sort(arr, p, r):
    if p < r:
        q = randomized_partition(arr, p, r)
        randomized_quick_sort(arr, p, q - 1)
        randomized_quick_sort(arr, q + 1, r)`,
  },
  bfs: {
    name: "BFS Traversal",
    category: "Graphs",
    solve: (d) => {
      if (!d || !d.nodes) return "";
      const adj = buildAdjList(d.nodes, d.edges, d.directed);
      const q = [0];
      const visited = new Set([0]);
      const result = [];
      while (q.length > 0) {
        const curr = q.shift();
        result.push(d.nodes[curr].label);
        (adj[curr] || []).forEach((n) => {
          if (!visited.has(n.target)) {
            visited.add(n.target);
            q.push(n.target);
          }
        });
      }
      return result.join(", ");
    },
    question: "Order of BFS starting from node A (0)?",
    hint: "Queue: A -> Neighbors -> Neighbors of neighbors.",
    codes: {
      java: `void BFS(int s) {
    boolean visited[] = new boolean[V];
    Queue<Integer> queue = new LinkedList<>();
    visited[s] = true;
    queue.add(s);
    while (!queue.isEmpty()) {
        s = queue.poll();
        for (int n : adj[s]) {
            if (!visited[n]) {
                visited[n] = true;
                queue.add(n);
            }
        }
    }
}`,
      pseudo: `BFS(G, s)
    for each u in G.V - {s} do u.color = WHITE
    s.color = GRAY
    Q = {s}
    while Q is not empty do
        u = DEQUEUE(Q)
        for each v in G.Adj[u] do
            if v.color == WHITE then
                v.color = GRAY
                ENQUEUE(Q, v)
            end if
        end for
        u.color = BLACK
    end while`,
      cpp: `void BFS(int s, vector<int> adj[], int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[s] = true;
    q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      python: `def bfs(adj, s):
    visited, q = {s}, [s]
    while q:
        u = q.pop(0)
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                q.append(v)`,
    },
  },
  dfs: {
    name: "DFS Traversal",
    category: "Graphs",
    solve: (d) => {
      if (!d || !d.nodes) return "";
      const adj = buildAdjList(d.nodes, d.edges, d.directed);
      const visited = new Set();
      const result = [];
      const dfs = (u) => {
        visited.add(u);
        result.push(d.nodes[u].label);
        (adj[u] || []).forEach((n) => {
          if (!visited.has(n.target)) dfs(n.target);
        });
      };
      dfs(0);
      return result.join(", ");
    },
    question: "Order of DFS starting from node A (0)?",
    hint: "Go deep before going wide. Recursive.",
    codes: {
      java: `void DFS(int v, boolean[] visited) {
    visited[v] = true;
    System.out.print(v + " ");
    for (int n : adj[v]) {
        if (!visited[n]) DFS(n, visited);
    }
}`,
      cpp: `void DFS(int v, vector<int> adj[], vector<bool>& visited) {
    visited[v] = true;
    for (int n : adj[v]) {
        if (!visited[n]) DFS(n, adj, visited);
    }
}`,
      python: `def dfs(adj, v, visited=None):
    if visited is None: visited = set()
    visited.add(v)
    for neighbor in adj[v]:
        if neighbor not in visited:
            dfs(adj, neighbor, visited)`,
      pseudo: `DFS(G)
    for each u in G.V do u.color = WHITE
    time = 0
    for each u in G.V do
        if u.color == WHITE then DFS-VISIT(G, u)
    end for

DFS-VISIT(G, u)
    time = time + 1
    u.d = time
    u.color = GRAY
    for each v in G.Adj[u] do
        if v.color == WHITE then
            v.pi = u
            DFS-VISIT(G, v)
        end if
    end for
    u.color = BLACK
    u.f = time + 1`,
    },
  },
  dijkstra: {
    name: "Dijkstra's Algo",
    category: "Graphs",
    solve: (d) => {
      if (!d || !d.nodes) return "";
      const adj = buildAdjList(d.nodes, d.edges, d.directed);
      const dist = Array(d.nodes.length).fill(Infinity);
      dist[0] = 0;
      const pq = [{ id: 0, w: 0 }];

      while (pq.length > 0) {
        pq.sort((a, b) => a.w - b.w);
        const { id, w } = pq.shift();
        if (w > dist[id]) continue;

        (adj[id] || []).forEach((n) => {
          if (dist[id] + n.weight < dist[n.target]) {
            dist[n.target] = dist[id] + n.weight;
            pq.push({ id: n.target, w: dist[n.target] });
          }
        });
      }
      return d.nodes
        .map((n, i) => `${n.label}:${dist[i] === Infinity ? "∞" : dist[i]}`)
        .join(", ");
    },
    question: "Shortest distance from A to all nodes?",
    hint: "Relax edges. Always pick smallest known distance.",
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
    INITIALIZE-SINGLE-SOURCE(G, s)
    S = {}
    Q = G.V
    while Q is not empty do
        u = EXTRACT-MIN(Q)
        S = S U {u}
        for each v in G.Adj[u] do
            RELAX(u, v, w)
        end for
    end while`,
    },
    cpp: `void dijkstra(int src, vector<pair<int, int>> adj[], int V) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto& edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`,
    python: `def dijkstra(adj, src):
    dist = {node: float('inf') for node in adj}
    dist[src], pq = 0, [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))`,
  },
  kruskal: {
    name: "Kruskal's MST",
    category: "Graphs",
    solve: (d) => {
      if (!d || !d.nodes) return 0;
      const edges = [...d.edges].sort((a, b) => a.weight - b.weight);
      const parent = Array.from({ length: d.nodes.length }, (_, i) => i);
      const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
      const union = (i, j) => (parent[find(i)] = find(j));

      let mstWeight = 0;
      edges.forEach((e) => {
        if (find(e.source) !== find(e.target)) {
          mstWeight += e.weight;
          union(e.source, e.target);
        }
      });
      return mstWeight;
    },
    question: "Total Weight of MST?",
    hint: "Sort edges by weight. Add if no cycle.",
    codes: {
      java: `void KruskalMST() {
    Collections.sort(edges);
    for (Edge e : edges) {
        if (find(e.src) != find(e.dest)) {
            mst.add(e);
            union(e.src, e.dest);
        }
    }
}`,
      cpp: `struct Edge { 
    int u, v, w; 
};

bool compare(Edge a, Edge b) { 
    return a.w < b.w; 
}

// Find function with path compression
int find(vector<int>& parent, int i) {
    if (parent[i] == i)
        return i;
    return parent[i] = find(parent, parent[i]);
}

// Union function to combine two sets
void unite(vector<int>& parent, int i, int j) {
    int root_i = find(parent, i);
    int root_j = find(parent, j);
    if (root_i != root_j) {
        parent[root_i] = root_j;
    }
}

void kruskal(vector<Edge>& edges, int V) {
    sort(edges.begin(), edges.end(), compare); // Sort edges by weight
    
    vector<int> parent(V);
    for(int i = 0; i < V; i++) {
        parent[i] = i; // Initialize Disjoint Set
    }

    vector<Edge> mst;
    int mstWeight = 0;

    for (Edge& e : edges) {
        // If the nodes are in different sets, no cycle is formed
        if (find(parent, e.u) != find(parent, e.v)) {
            mst.push_back(e);
            mstWeight += e.w;
            unite(parent, e.u, e.v);
        }
    }
    
    // mst now contains the edges of the Minimum Spanning Tree
}
}`,
      python: `
      class Edge:
    def __init__(self, u, v, w):
        self.u = u
        self.v = v
        self.w = w

def find(parent, i):
    """Find function with path compression."""
    if parent[i] == i:
        return i
    parent[i] = find(parent, parent[i])
    return parent[i]

def unite(parent, i, j):
    """Unite function to combine two sets."""
    root_i = find(parent, i)
    root_j = find(parent, j)
    if root_i != root_j:
        parent[root_i] = root_j

def kruskal(edges, V):
    # Sort edges by weight (equivalent to sort with compare)
    edges.sort(key=lambda x: x.w)
    
    # Initialize Disjoint Set: each node is its own parent
    parent = list(range(V))
    
    mst = []
    mst_weight = 0

    for e in edges:
        # If the nodes are in different sets, no cycle is formed
        if find(parent, e.u) != find(parent, e.v):
            mst.append(e)
            mst_weight += e.w
            unite(parent, e.u, e.v)
            
    return mst, mst_weight`,
      pseudo: `MST-KRUSKAL(G, w)
    A = {}
    for each v in G.V do MAKE-SET(v)
    sort edges E by weight w
    for each (u, v) in E do
        if FIND-SET(u) != FIND-SET(v) then
            A = A U {(u, v)}
            UNION(u, v)
        end if
    end for
    return A`,
    },
  },
  left_rotate: {
    name: "Left Rotate",
    category: "Trees",
    solve: (d) => {
      if (!d || !d.root || !d.root.right)
        return "Cannot rotate (No right child)";
      return `Root becomes ${d.root.right.val}. Old root ${d.root.val} becomes left child.`;
    },
    question: "Perform Left-Rotate on the Root. What is the new Root?",
    hint: "x.right becomes new root. x becomes left child of new root.",
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
    y = x.right
    x.right = y.left
    if y.left != NIL then y.left.p = x
    y.p = x.p
    if x.p == NIL then T.root = y
    else if x == x.p.left then x.p.left = y
    else x.p.right = y
    y.left = x
    x.p = y`,
    },
    cpp: `void leftRotate(Node* &root, Node* x) {
    Node* y = x->right;
    x->right = y->left;
    if (y->left != nullptr) y->left->parent = x;
    y->parent = x->parent;
    if (x->parent == nullptr) root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x;
    x->parent = y;
}`,
    python: `def left_rotate(self, x):
    y = x.right
    x.right = y.left
    if y.left: y.left.parent = x
    y.parent = x.parent
    if not x.parent: self.root = y
    elif x == x.parent.left: x.parent.left = y
    else: x.parent.right = y
    y.left = x
    x.parent = y`,
  },
  right_rotate: {
    name: "Right Rotate",
    category: "Trees",
    solve: (d) => {
      if (!d || !d.root || !d.root.left) return "Cannot rotate (No left child)";
      return `Root becomes ${d.root.left.val}. Old root ${d.root.val} becomes right child.`;
    },
    question: "Perform Right-Rotate on the Root. What is the new Root?",
    hint: "y.left becomes new root. y becomes right child of new root.",
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
      cpp: `void rightRotate(Node* &root, Node* y) {
    Node* x = y->left;
    y->left = x->right;
    if (x->right != nullptr) x->right->parent = y;
    x->parent = y->parent;
    if (y->parent == nullptr) root = x;
    else if (y == y->parent->right) y->parent->right = x;
    else y->parent->left = x;
    x->right = y;
    y->parent = x;
}`,
      python: `def right_rotate(self, y):
    x = y.left
    y.left = x.right
    if x.right: x.right.parent = y
    x.parent = y.parent
    if not y.parent: self.root = x
    elif y == y.parent.right: y.parent.right = x
    else: y.parent.left = x
    x.right = y
    y.parent = x`,
      pseudo: `RIGHT-ROTATE(T, y)
    x = y.left
    y.left = x.right
    if x.right != NIL then x.right.p = y
    x.p = y.p
    if y.p == NIL then T.root = x
    else if y == y.p.right then y.p.right = x
    else y.p.left = x
    x.right = y
    y.p = x`,
    },
  },
  bst_ops: {
    name: "BST Ops",
    category: "Trees",
    solve: (d) => "Varies (Structural Property)",
    question: "Insert node logic.",
    hint: "Left if smaller, Right if larger.",
    codes: {
      java: `public static B insertRecursive(B root, int key) {
    if (root == null) return new B(key);
    if (key < root.key) root.left = insertRecursive(root.left, key);
    else root.right = insertRecursive(root.right, key);
    return root;
}`,
      pseudo: `TREE-INSERT(T, z)
    y = NIL
    x = T.root
    while x != NIL do
        y = x
        if z.key < x.key then x = x.left
        else x = x.right
    end while
    z.p = y
    if y == NIL then T.root = z
    else if z.key < y.key then y.left = z
    else y.right = z`,
    },
  },
  rbt_ops: {
    name: "RBT Ops",
    category: "Trees",
    solve: (d) => "Red/Black Coloring",
    question: "Insert/Fixup logic.",
    hint: "Recolor and Rotate to maintain properties.",
    codes: {
      java: `void insertFixup(Node k) {
    while (k.parent.color == RED) {
        if (k.parent == k.parent.parent.right) {
            Node u = k.parent.parent.left; // uncle
            // Case 1, 2, 3 logic...
        }
    }
    root.color = BLACK;
}`,
      pseudo: `RB-INSERT-FIXUP(T, z)
    while z.p.color == RED do
        if z.p == z.p.p.left then
            y = z.p.p.right
            if y.color == RED then
                // Case 1: Recolor
            else
                // Case 2/3: Rotate
            end if
        end if
    end while
    T.root.color = BLACK`,
    },
  },
  heap_ops: {
    name: "Max-Heapify",
    category: "Trees",
    solve: (d) => {
      if (!d || !d.length) return "";
      const arr = [...d];
      const n = arr.length;
      let i = 0; // Heapify root
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      if (l < n && arr[l] > arr[largest]) largest = l;
      if (r < n && arr[r] > arr[largest]) largest = r;
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
      }
      return arr.join(", ");
    },
    question: "Result of Max-Heapify(A, 0)? (One Step)",
    hint: "Swap root with largest child if child > root.",
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
      python: `def max_heapify(arr, n, i):
    largest, l, r = i, 2*i + 1, 2*i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        max_heapify(arr, n, largest)`,
      cpp: `void maxHeapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

   if (l < n && arr[l] > arr[largest])
        largest = l;

    if (r < n && arr[r] > arr[largest])
        largest = r;

    if (largest != i) {
        swap(arr[i], arr[largest]);

        // Recursively heapify the affected sub-tree
        maxHeapify(arr, n, largest);
    }
}`,
      pseudo: `MAX-HEAPIFY(A, i)
    l = LEFT(i)
    r = RIGHT(i)
    if l <= size and A[l] > A[i] then largest = l
    else largest = i
    if r <= size and A[r] > A[largest] then largest = r
    if largest != i then
        exchange A[i] with A[largest]
        MAX-HEAPIFY(A, largest)
    end if`,
    },
  },
  recurrence_a: {
    name: "Recurrence 1(a)",
    category: "Recurrences",
    solve: () => "Theta(sqrt(n) log n)",
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
    solve: () => "Theta(n^2)",
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
    solve: () => "Theta(n log n)",
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
2. Since sum = 1, total work per level is constant (n).
3. The depth of the tree is logarithmic.
4. Total Work = Work per level * Number of levels
5. T(n) = Theta(n log n)`,
    },
  },
  stack_ops: {
    name: "Stack Operations",
    category: "Linear",
    solve: (d) =>
      d && d.result.length > 0 ? d.result[d.result.length - 1] : "Empty",
    question: (d) => {
      if (!d || !d.ops) return "Loading...";
      const trace = d.ops
        .map((o) => (o.type === "push" ? `Push(${o.val})` : `Pop()`))
        .join(", ");
      return `Sequence: ${trace}. What is at the TOP?`;
    },
    hint: "LIFO: Last In, First Out.",
    codes: {
      java: `public void push(T value) {
    Node<T> newNode = new Node<>(value);
    newNode.next = top;
    top = newNode;
}`,
      pseudo: `PUSH(S, x)
    S.top = S.top + 1
    S[S.top] = x

POP(S)
    if STACK-EMPTY(S) then error "underflow"
    else S.top = S.top - 1
    return S[S.top + 1]`,
    },
  },
  postfix_eval: {
    name: "Postfix Evaluation",
    category: "Linear",
    solve: (d) => (d ? evalPostfixHelper(d.expr) : 0),
    question: (d) => (d ? `Evaluate: ${d.expr}` : "Loading..."),
    hint: "Stack: Push numbers. Op: Pop 2, Calc, Push.",
    codes: {
      java: `public int evalPostfix(String exp) {
    Stack<Integer> stack = new Stack<>();
    for(char c: exp.toCharArray()) {
        if(isDigit(c)) stack.push(c - '0');
        else {
            int b = stack.pop(), a = stack.pop();
            // apply op
        }
    }
    return stack.pop();
}`,
      cpp: `int evalPostfix(string exp) {
    stack<int> s;
    for (char c : exp) {
        if (isdigit(c)) s.push(c - '0');
        else {
            int b = s.top(); s.pop();
            int a = s.top(); s.pop();
            if(c == '+') s.push(a+b); // etc...
        }
    }
    return s.top();
}`,
      python: `def eval_postfix(exp):
    stack = []
    tokens = exp.split() if ' ' in exp else list(exp)
    
    for t in tokens:
        if t.isdigit():
            stack.append(int(t))
        else:
            b = stack.pop()
            a = stack.pop()
            if t == '+':
                stack.append(a + b)
            elif t == '-':
                stack.append(a - b)
            elif t == '*':
                stack.append(a * b)
            elif t == '/':
                stack.append(a // b)
    return stack[0]`,
      pseudo: `EVAL-POSTFIX(E)
    S = empty stack
    for each token t in E do
        if t is operand then PUSH(S, t)
        else
            y = POP(S)
            x = POP(S)
            r = APPLY(t, x, y)
            PUSH(S, r)
        end if
    end for
    return POP(S)`,
    },
  },
  hashing: {
    name: "Hashing",
    category: "Hashing",
    solve: (d) => "Index or Overflow",
    question: "Insert key using Open Addressing.",
    hint: "Probe: Linear (i), Quadratic (i^2).",
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
      cpp: `int hashInsert(int T[], int k, int m) {
    int i = 0;
    do {
        int j = (h(k) + i) % m;
        if (T[j] == EMPTY) { T[j] = k; return j; }
        i++;
    } while (i < m);
    return -1;
}`,
      python: `def hash_insert(T, k, m):
    """
    Inserts key k into hash table T of size m using linear probing.
    Matches the logic of the provided C++ snippet.
    """
    i = 0
    while True:
        # Calculate index using the hash function h(k) and linear probe i
        # In Python, you can define h(k) as k % m or use a custom function
        j = (h(k) + i) % m
        
        # Check if the slot is empty (using None to represent EMPTY)
        if T[j] is None:
            T[j] = k
            return j
            
        i += 1
        
        # Stop if we have probed all m slots (Table is full)
        if i >= m:
            break
            
    return -1`,
      pseudo: `HASH-INSERT(T, k)
    i = 0
    repeat
        j = h(k, i)
        if T[j] == NIL then
            T[j] = k
            return j
        end if
        i = i + 1
    until i == m
    error "hash table overflow"`,
    },
  },
};
