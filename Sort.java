public class Sort {
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
    public static int linear_search(int arr[], int target){
        for(int i=0;i<target;i++){
            if(arr[i]==target){
                return i;
            }
        }
        return -1;
    }
    public static void merge(int arr[], int p, int q, int r){
    
    }
}