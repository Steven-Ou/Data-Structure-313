import java.util.EmptyStackException;

class Node<T> {
    T data;
    Node<T> next;

    public Node(T data) {
        this.data = data;
        this.next = null;
    }
}

public class LinkedListStack<T> {
    private static class B {
        int key;
        B left;
        B right;
        B parent;

        public B(int key) {
            this.key = key;
            this.left = null;
            this.right = null;
            this.parent = null;
        }
    }

    private Node<T> top;
    private Node<T> head;

    public LinkedListStack() {
        this.top = null;
    }

    public boolean isEmpty() {
        return top == null;
    }

    public void push(T value) {
        Node<T> newNode = new Node<>(value);

        newNode.next = top;
        top = newNode;
        System.out.println("Pushed:" + value);
    }

    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }

        T dataToReturn = top.data; // storing the data to return
        top = top.next; // Update top to point to the next node

        System.out.println("Popped: " + dataToReturn);
        return dataToReturn;
    }

    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.data;
    }

    public void insertAtHead(T value) {
        Node<T> newNode = new Node<>(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    public T deleteHead() {
        if (isEmpty()) {
            return null;
        }
        T data = head.data;
        head = head.next;

        return data;
    }

    public T deleteTail() {
        if (isEmpty()) {
            return null;
        }
        if (head.next == null) {
            T data = head.data;
            head = null;
            return data;
        }

        Node<T> current = head;
        Node<T> previous = null;

        while (current.next != null) {
            previous = current;
            current = current.next;
        }

        T data = current.data;
        previous.next = null;

        return data;
    }

    public boolean deleteByValue(T value) {
        if (isEmpty()) {
            return false;
        }
        if (head.data.equals(value)) {
            head = head.next;
            return true;
        }

        Node<T> current = head;
        Node<T> previous = null;

        while ((current != null && !current.data.equals(value))) {
            previous = current;
            current = current.next;
        }

        if (current == null) {
            return false;
        }
        previous.next = current.next;
        return true;
    }

    public static B treeMinimumRecursive(B x) {
        if (x == null) {
            return null;
        }
        if (x.left == null) {
            return x;
        }
        return treeMinimumRecursive(x.left);
    }

    public static B treeMaximumRecursive(B x) {
        if (x == null) {
            return null;
        }
        if (x.right == null) {
            return x;
        }
        return treeMaximumRecursive(x.right);
    }

    public static B treePredecessor(B x) {
        if (x == null) {
            return null;
        }
        if (x.left != null) {
            return treeMaximumRecursive(x.left);
        }

        B y = x.parent;
        B current = x;

        while (y != null && current == y.left) {
            current = y;
            y = y.parent;
        }
        return y;
    }

    public static B insertRecursive(B root, int key) {
        return insertRecHelper(root, null, key);
    }

    private static B insertRecHelper(B current, B p, int key) {
        if (current == null) {
            B newNode = new B(key);
            newNode.parent = p;
            return newNode;
        }
        if (key < current.key) {
            current.left = insertRecHelper(current.left, current, key);
        } else {
            current.right = insertRecHelper(current.right, current, key);
        }
        return current;
    }
    // inorder
    public static void inorder(B root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.key + " ");
            inorder(root.right);
        }
    }

    // a. Count total nodes
    public static int countNodes(B t) {
        if (t == null)
            return 0;
        return 1 + countNodes(t.left) + countNodes(t.right);
    }

    // Counting the leaves
    public static int countLeaves(B t) {
        if (t == null)
            return 0;
        if (t.left == null && t.right == null)
            return 1;
        return countLeaves(t.left) + countLeaves(t.right);
    }

    // Count full nodes
    public static int countFullNodes(B t) {
        if (t == null)
            return 0;
        int isFull = (t.left != null && t.right != null) ? 1 : 0;
        return isFull + countFullNodes(t.left) + countFullNodes(t.right);
    }

    static class SuccNode {
        int key;
        SuccNode left, right;
        SuccNode succ;

        public SuccNode(int key) {
            this.key = key;
        }
    }

    static class SuccessorBST {
        SuccNode root;

        private SuccNode getPredecessor(SuccNode target) {
            if (target.left != null) {
                SuccNode curr = target.left;
                while (curr.right != null)
                    curr = curr.right;
                return curr;
            }
            SuccNode pred = null;
            SuccNode curr = root;
            while (curr != null && curr != target) {
                if (target.key > curr.key) {
                    pred = curr;
                    curr = curr.right;
                } else {
                    curr = curr.left;
                }
            }
            return pred;
        }

        public SuccNode search(int key) {
            SuccNode x = root;
            while (x != null && key != x.key) {
                if (key < x.key)
                    x = x.left;
                else
                    x = x.right;
            }
            return x;
        }

        public void insert(int key) {
            SuccNode z = new SuccNode(key);
            SuccNode y = null;
            SuccNode x = root;
            while (x != null) {
                y = x;
                if (z.key < x.key)
                    x = x.left;
                else
                    x = x.right;
            }
            if (y == null) {
                root = z;
                z.succ = null;
            } else {
                if (z.key < y.key) {
                    y.left = z;
                    SuccNode pred = getPredecessor(y);
                    if (pred != null)
                        pred.succ = z;
                    z.succ = y;
                } else {
                    y.right = z;
                    z.succ = y.succ;
                    y.succ = z;
                }
            }
        }

        public void delete(int key) {
            SuccNode z = search(key);
            if (z == null)
                return;
            SuccNode pred = getPredecessor(z);
            SuccNode y = (z.left == null || z.right == null) ? z : z.succ;
            SuccNode x = (y.left != null) ? y.left : y.right;

            // Parent pointer logic simulated for O(h)
            SuccNode yParent = null;
            SuccNode curr = root;
            if (curr != y) {
                while (curr != null) {
                    if (y.key < curr.key) {
                        if (curr.left == y) {
                            yParent = curr;
                            break;
                        }
                        curr = curr.left;
                    } else {
                        if (curr.right == y) {
                            yParent = curr;
                            break;
                        }
                        curr = curr.right;
                    }
                }
            }

            if (yParent == null)
                root = x;
            else if (y == yParent.left)
                yParent.left = x;
            else
                yParent.right = x;

            if (y != z)
                z.key = y.key;

            if (y == z) {
                if (pred != null)
                    pred.succ = y.succ;
            } else {
                z.succ = y.succ;
            }
        }

        public void printSuccChain() {
            SuccNode current = root;
            while (current != null && current.left != null)
                current = current.left;
            System.out.print("Succ Chain: ");
            while (current != null) {
                System.out.print(current.key + " -> ");
                current = current.succ;
            }
            System.out.println("null");
        }
    }

    public static void main(String[] args) {
        LinkedListStack<Integer> stack = new LinkedListStack<>();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Current top (peek): " + stack.peek());

        try {
            stack.pop();
            stack.pop();
            System.out.println("Current top (peek): " + stack.peek());
            stack.pop();
            stack.pop();
        } catch (EmptyStackException e) {
            System.out.println("Error: Stack is empty!");
        }
        System.out.println("\n--- RECURSIVE BST & COUNTING TESTS ---");
        B root = null;
        int[] values = { 12, 5, 18, 2, 9, 15, 19, 17 };
        // Tree Structure: What we expected to get
        // 12
        // / \
        // 5 18
        // / \ / \
        // 2 9 15 19
        // \
        // 17
        for (int v : values)
            root = insertRecursive(root, v);

        System.out.print("Inorder: ");
        inorder(root);
        System.out.println();

        System.out.println("Total Nodes (Ex 4.31a): " + countNodes(root));
        System.out.println("Total Leaves (Ex 4.31b): " + countLeaves(root)); // Expect 4 (2, 9, 17, 19)
        System.out.println("Full Nodes   (Ex 4.31c): " + countFullNodes(root));   // Expect 3 (12, 5, 18)
        
        System.out.println("\n--- SUCCESSOR BST TESTS ---");
        SuccessorBST succTree = new SuccessorBST();
        int[] succValues = {15, 6, 18, 3, 7, 17, 20};
        for(int v : succValues) succTree.insert(v);
        succTree.printSuccChain(); // Expect sorted chain
        
        System.out.println("Deleting 15 (Root)...");
        succTree.delete(15);
        succTree.printSuccChain();
    }
}
