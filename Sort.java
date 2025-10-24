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
        int n1 = q-p +1;
        int n2 = r-q;

        int L[n1];
        int R[n2];

        for(int i=0;i<n1;i++){
            L[i]=arr[p+1];
        }
        for(int j=0;j<n2;j++){
            R[j]=arr[q+1+j];
        }
        int i =0;
        int j=0;
        int k=p;

        while(i<n1&&j<n2){
            if(L[i]<=R[i]){
                arr[k]=L[i];
                i++;
            }else{
                arr[k]=R[j];
                j++;
            }
            k++;
        }

        while(i<n1){
            arr[k]=L[i];
            i++;
            k++;
        }
    }
}