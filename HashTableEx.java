import java.util.Arrays;

public class HashTableEx {
    static class OpenAddressingHashTable{
        Integer[] table;
        int m;
        String strategy;

        public OpenAddressingHashTable(int size, String strategy){
            this.m = size;
            this.table = new Integer[size];
            this.strategy = strategy;
            Arrays.fill(table,null);
        }
    }
}
