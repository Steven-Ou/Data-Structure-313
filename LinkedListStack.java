import java.lang.classfile.components.ClassPrinter.Node;
import java.util.EmptyStackException;

class Node<T>{
    T data;
    Node<T> next;

    public Node(T data){
        this.data = data;
        this.next =null;
    }
}
public class LinkedListStack {
    
}
