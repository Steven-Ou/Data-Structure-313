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
    }
}
