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
    private Node<T> top;

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

        System.out.println("Pushed: "+value);
    }

}

