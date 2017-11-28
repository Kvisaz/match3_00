/**
 * Created by Work on 27.11.2017.
 *
 *  Объект для показа всплывающих объектов
 *
 */

function MonsterDamageFloaterPool(game) {
    this.POOL_SIZE = 30;

    this.pool = new Pool(this.POOL_SIZE, function () {
        return new MonsterDamageFloater(game);
    });
}

// если нужна операция по завершению всплывания - устаналивать тут
MonsterDamageFloaterPool.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalCallbackContext = context;
};

// запуск анимации
MonsterDamageFloaterPool.prototype.float = function (x, y, damageText) {
    console.log("damageText = " + damageText);
    var floater = this.pool.get(); // берем из пула
    console.log("floating pool size = "+this.pool.objects.length);
    console.log("floating pool freeAmount = "+this.pool.freeAmount);

    // коллбэк по завершении анимации всплывания
    floater.setCallback(function () {
        this.pool.add(floater); // возвращаем в пул
        if (this.globalCallback) {
            this.globalCallback.call(this.globalCallbackContext, x, y);
        }
    }, this);

    floater.float(x, y, damageText); // старт анимации
};