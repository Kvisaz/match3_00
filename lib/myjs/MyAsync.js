/**
 * Created by Work on 30.11.2017.
 */

function myAsyncTest() {
    async1();
};


function async1() {
    console.log("async1 func");
    setTimeout(async2, 1000);
}

function async2() {
    console.log("async2 func");
    setTimeout(async3, 1000);
}

function async3() {
    console.log("async3 func");
    setTimeout(result, 1000);
}

function result() {
    console.log("result func");
}


function myAsyncTest_1() {
    new AsyncChain()
        .add(async1_1)
        .add(async2_1)
        .add(async3_1)
        .add(function (async, arg1) {
            console.log("custom func arg1 = " + arg1);
            setTimeout(async.getNext("Hello, RESULT"), 2000);
        })
        .add(result)
        .onError(function (e) {
            alert(e);
        })
        .start();
}

function AsyncChain() {
    this.index = 0; // индекс для выборки следующего асинхронного коллбэка
    this.callbacks = []; // массив обратных вызовов
    this.onErrorData = {
        callback: function (e) { console.log("onError: " + e.name);},
        context : undefined
    };
}

AsyncChain.prototype.onError = function (onErrorFn, context) {
    this.onError.callback = onErrorFn;
    this.onError.context = context;
    return this;
};

AsyncChain.prototype.start = function () {
    this.index = 0; // обновляем индекс
    this.getNext()();
};

AsyncChain.prototype.add = function (callback, context) {
    this.callbacks.push({callback: callback, context: context});
    return this;
};

AsyncChain.prototype.getNext = function () {
    if(this.index >= this.callbacks.length) { // проверка - есть ли коллбэки
        throw "No more callbacks in asyncChain"
    }
    var args = [].slice.call(arguments); // вызов arr.slice() скопирует все элементы из this в новый массив
    args.unshift(this); // добавляем в начало ссылку на асинхрон-мастера
    var next = this.callbacks[this.index++]; // берем следующий коллбэк и сдвигаем индекс на следующий
    return function () {
        try {
            return next.callback.apply(next.context, args);
        }
        catch (e) {
            console.log("e =" + e);
            args[0].onErrorData.callback.call(args[0].onErrorData .context, e); // вместо this, ведь в args теперь хранится ссылка на контекст нашего AsyncMaster
        }
    }
};


function async1_1(async) {
    console.log("async1_1 func");
    //  throw "Very low value."; // для теста OnError
    setTimeout(async.getNext("Hello, next func"), 1000);
}

function async2_1(async, arg1, arg2) {
    console.log("async2_1 func");
    console.log("arg1 = " + arg1 + " arg2 =" + arg2);
    setTimeout(async.getNext(1000, 2000), 1000);
}

function async3_1(async, arg1, arg2) {
    console.log("async3_1 func");
    console.log("arg1 = " + arg1 + " arg2 =" + arg2);
    setTimeout(async.getNext(314), 1000);
}

function result_1(async, arg1) {
    console.log("result func");
    console.log("arg1 = " + arg1);
}