function Sort() {
    // 定义冒泡排序的方法
    this.bubbleSort = function (arr,flag) {
        for(var i=0;i<arr.length;i++) {
            for(var j=0;j<i;j++) {
                if(arr[i]>arr[j]) {
                    var center = null;// 中间变量用于交换数据
                    center = arr[i];
                    arr[i] = arr[j];
                    arr[j] = center;
                    center = null;
                }
            }
        }
        if(flag == 1) {
            // 降序
            return arr;
        }else {
            // 升序
            return arr.reverse();
        }
    }

    // 使用数组的排序方法进行排序
    this.arrSort = function (arr,flag) {
        return arr.sort(function (a,b) {
            if(flag == 1) {
                // 降序
                if(a < b) {
                    // 如果a<b则a和b交换位置，即数组中大的值放到前面（b大），故是降序。
                    return 1;
                }
            }else {
                // 升序
                if(a > b) {return 1;}
            }
        });
    }
}