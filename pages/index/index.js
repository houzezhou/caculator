//index.js
//获取应用实例
var exp
var operFlag

var app = getApp() ;
Page({
    data: {
        motto: exp,
        userInfo: {},


    },

    //数字按钮事件
    pressNum: function(e) {
        var c=0;
        if (operFlag == '0') {
            exp = exp + e.target.id;
            exp = parseInt(exp);

            this.setData({
                motto: parseInt(exp)
            })
        }
        if (operFlag != '0') {
            c = c + e.target.id;

            this.setData({
                motto: exp + parseInt(c)
            }) 
            ;exp = exp + parseInt(c);
        }
    },
    

    //符号按钮事件
    pressOper: function(e) {
        operFlag = '1';
        if(exp==0){
                this.setData(
        {
            motto: e.target.id
        }) ;
        exp = e.target.id;
        }else{
        this.setData(
        {
            motto: exp + e.target.id
        }) ;
        exp = exp + e.target.id;
        }
    },
    backspace: function(e) {
        var length=exp.toString().length;
        if(length==1){
            exp=0;
             this.setData(
        {
            motto: exp
        }) ;
        operFlag=0;
        }
        else{
        if(this.isOperator(exp.toString()[length-1])){
                operFlag=0;
        }
        exp=exp.toString().substring(0, length -1);
        this.setData(
        {
            motto: exp
        }) ;
        }
    },

    //等于按钮事件  计算
    getRes: function(e) {
        exp = exp;
        var inputStack = this.getOperArry(exp);
        var outputQueue = this.getRPn(inputStack);
        //  this.setData({
        //     motto: outputQueue
        // });
        var result=this.evalRpn(outputQueue);
           var re = /([0-9]+\.[0-9]{6})[0-9]*/;
        this.setData({
            motto: result.toString().replace(re,"$1")
        });
        exp = result.toString().replace(re,"$1");
    },
    //获得符号优先级 乘除高于加减
getyxj: function(x) {
        var v1
        if (x == '+' || x == '-') {
            v1 = 1;
        } else if (x == '×' || x == '/') {
            v1 = 2;
        } else {
            v1 = 0
        }
        return v1;
    },

    //判断是不是操作符
    isOperator: function(exp) {
        var operatorString = "+-×/()";
        return (operatorString.indexOf(exp) > -1) ? true: false;

    }
  
    ,
    //得出因数栈
    getOperArry: function(exp) {
            var inputStack = [];
             var tlast = 0;
             var cur;
           for(var i=0,len = exp.length; i < len; i++) {
            cur = exp[i];
            if (this.isOperator(cur)) {
                if(this.isOperator(exp[i-1])||i==0)
                {
                    inputStack.push(cur);
                    tlast = 0;
                }
                else{
                inputStack.push(parseInt(tlast));
                tlast = cur;
                tlast = 0;
                inputStack.push(cur);
                }
            } else {
                tlast = tlast + cur;
            }
        }
        if(!this.isOperator(cur)){
         inputStack.push(tlast);
        }
         return inputStack;

    }
    ,
    getRPn(inputStack){
        var outputQueue = [];
        var outputStack=[];
        while (inputStack.length > 0) {
            var cur = inputStack.shift();
            if (this.isOperator(cur)) {
                if (cur == '(') {
                    outputStack.push(cur);
                } else if (cur == ')') {
                    var po = outputStack.pop();
                    while (po != '(' && outputStack.length > 0) {
                        outputQueue.push(po);
                        po = outputStack.pop();
                    }
                    if (po != '(') {
                        throw "error: unmatched ()";
                    }
                } else {

                    var o1 = cur;
                    var o2 = outputStack[outputStack.length - 1];
                    var t1;

                    var v1 = 0;
                    var v2 = 0;
                    v1 = this.getyxj(o1);
                    v2 = this.getyxj(o2);
                    t1 = (v1 <= v2);

                    while (t1 && outputStack.length > 0) {
                        outputQueue.push(outputStack.pop());
                    }
                    outputStack.push(cur);
                }
            } else {
                outputQueue.push(new Number(cur));
            }
        }
        console.log('step two');
        if (outputStack.length > 0) {
            if (outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '(') {
                throw "error: unmatched ()";
            }
            while (outputStack.length > 0) {
                outputQueue.push(outputStack.pop());
            }
        }
        return outputQueue;
    }
    ,

    //运算
    getResult(fir, sec, cur) {
        var resTemp = 0;
        if (cur == '+') {
            resTemp = fir + sec;
        } else if (cur == '-') {
            resTemp = fir - sec;
        } else if (cur == '×') {
            resTemp = fir * sec;
        } else if (cur == '/') {
            resTemp = fir / sec;
        }
        return resTemp;
    },
 //初始化
    onLoad: function() {
        console.log('onLoad');
        exp = '0';
        operFlag = '0';
        this.setData({
            motto: exp
        }) ;
        var that = this;
        //调用应用实例的方法获取全局数据
    },


//逆波兰表达式求值
    evalRpn(rpnQueue) {
        var outputStack = [];
        while (rpnQueue.length > 0) {
            var cur = rpnQueue.shift();

            if (!this.isOperator(cur)) {
                outputStack.push(cur);
            } else {
                if (outputStack.length < 2) {
                    throw "unvalid stack length";
                }
                var sec = outputStack.pop();
                var fir = outputStack.pop();

                outputStack.push(this.getResult(fir, sec, cur));
            }
        }

        return outputStack[0];

    }

})