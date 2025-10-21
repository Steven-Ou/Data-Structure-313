public class Insertion {
    public static void insertion_sort(int[] a) {
        for (int i = 2; i < a.length; i++) {
            int k = a[i];
            int j = i-1; 
            while(j>0 && a[j]>k){
                a[j+1]=a[j];
                j=j+1;
            }
            a[j+1] = k; 
        }
    }
}