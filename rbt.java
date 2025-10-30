public class rbt {
    enum Color{
        red, black
    }
    class Node{
        int key;
        Color color;
        Node p;
        Node left;
        Node right; 

        Node(int key){
            this.key =key;
        }
    }
}
