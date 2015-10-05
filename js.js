/**
 * Created by zjy on 2015/10/4.
 */
//我现在用的是js,和你学的oc不一样，别搅浑了

//声明一个变量,相当oc的 BOOL b = YES，
// 这里BOOL 是声明变量类型，
// b是变量名称，
// =  是赋值符号，
// YES是给b的值， 以后b就表示YES
var n='i am from quanta';

//声明一个函数
//function是声明 ，
// printName是变量名，name是参数，下面会说
function printName(name){
    //console.log()是打印函数，把name放进去表示打印name变量的值
    console.log(name);
}

//调用函数
//这里调用前面自己写的printName()函数,
// 把n放()里,(n),表示把n变量传进函数里,这是后,上面声明函数里的name,(name),表示name会接过n闯进来的值
printName(n);


//声明函数
// 这次声明一个有两个参数的变量
function add(num1,num2){
    //num1和num2做加法，把值传给声明的变量re
    var re=num1+num2;

    //把re传回去
    return re;
}

//调用函数
//这时候result就等于函数add() return 回来的值
var result=add(10,5);

//打印出来看看
console.log(result);
