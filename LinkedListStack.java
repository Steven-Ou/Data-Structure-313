import java.util.EmptyStackException;

class Node<T>{
    T data;
    Node<T> next;

    public Node(T data){
        this.data = data;
        this.next =null;
    }
}
public class LinkedListStack<T> {
    private static class B{
        int key;
        B left;
        B right;

        public B(int key){
            this.key=key;
            this.left = null;
            this.right = null;
        }
    }
    private Node<T> top;
    private Node<T> head;
    public LinkedListStack(){
        this.top =null;
    }

    public boolean isEmpty(){
        return top ==null;
    }

    public void push(T value){
        Node<T> newNode = new Node<>(value);

        newNode.next=top;
        top = newNode;
        System.out.println("Pushed:" + value);
    }

    public T pop(){
        if(isEmpty()){
            throw new EmptyStackException();
        }

        T dataToReturn = top.data; //storing the data to return
        top = top.next; // Update top to point to the next node

        System.out.println("Popped: "+ dataToReturn);
        return dataToReturn;
    }
    public T peek(){
        if (isEmpty()){
            throw new EmptyStackException();
        }
        return top.data;
    }
    public void insertAtHead(T value){
        Node<T> newNode = new Node<>(value);
        newNode.next = this.head;
        this.head= newNode;
    }
    public T deleteHead(){
        if(isEmpty()){
            return null;
        }
        T data = head.data;
        head = head.next;

        return data;
    }
    public T deleteTail(){
        if(isEmpty()){
            return null;
        }
        if(head.next == null){
            T data = head.data;
            head = null;
            return data; 
        }

        Node<T> current =head;
        Node<T> previous =null;

        while(current.next != null){
            previous = current ;
            current = current.next;
        }

        T data = current.data;
        previous.next = null;

        return data;
    }
    public boolean deleteByValue(T value){
        if(isEmpty()){
            return false;
        }
        if (head.data.equals(value)){
            head = head.next;
            return true;
        }

        Node<T> current= head;
        Node<T> previous = null;

        while((current !=null && !current.data.equals(value))){
            previous =current;
            current = current.next;
        }
        
        if(current ==null){
            return false;
        }
        previous.next = current.next;
        return true;
    }
    public static B treeMinimumRecursive(B x){
        if(x ==null){
            return null;
        }
    }
    public static void main(String[] args){
        LinkedListStack<Integer> stack = new LinkedListStack<>();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Current top (peek): "+ stack.peek());

        try{
            stack.pop();
            stack.pop();
            System.out.println("Current top (peek): "+ stack.peek());
            stack.pop();
            stack.pop();
        }catch(EmptyStackException e){
            System.out.println("Error: Stack is empty!");
        }
    }
}

