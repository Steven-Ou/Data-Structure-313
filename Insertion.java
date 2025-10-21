public class Insertion {
    public static void insertion_sort(int[] a) {
        for (int i = 0; i < a.length; i++) {
            int k = a[i];
            int j = i-1; 
            while(i>0 && a[i]>k){
                a[i+1]=a[i];
                i=i+1;
            }
            a[i+1] = k; 
        }
    }
}