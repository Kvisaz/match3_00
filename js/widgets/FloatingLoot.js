/**
 * Created by Work on 22.11.2017.
 *
 *  Объект для показа всплывающих объектов
 *
 */

function FloatingLoot(game) {
    this.POOL_SIZE = 50;

    this.pool = new Pool(this.POOL_SIZE, function () {
        return new FloatingLootElement(game)
    });
}

// если нужна операция по завершению всплывания - устаналивать тут
FloatingLootElement.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalCallbackContext = context;
};

// запуск анимации лута
FloatingLoot.prototype.float = function (x, y, lootType, lootValue) {
    console.log("lootType = " + lootType + " / lootValue = " + lootValue);
    var floater = this.pool.get(); // берем из пула
    console.log("floating pool size = "+this.pool.objects.length);
    console.log("floating pool freeAmount = "+this.pool.freeAmount);
    floater.set(lootType, lootValue);

    // коллбэк по завершении анимации всплывания
    floater.setCallback(function () {
        this.pool.add(floater); // возвращаем в пул
        if (this.globalCallback) {
            this.globalCallback.call(this.globalCallbackContext, lootType, lootValue);
        }
    }, this);

    floater.float(x, y); // старт анимации
};