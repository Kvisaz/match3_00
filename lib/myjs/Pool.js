/**
 * Created by Work on 24.11.2017.
 *
 * Universal object Pool
 *  - нужно передать функцию для создания объекта
 *  - динамически растет, если не хватает
 *  - выдает свободные объекты с хвоста
 */

function Pool(size, objectCreateFunction) {
    this.freeAmount = 0;
    this.objects = [];

    this.add = function (object) {
        this.objects[this.freeAmount++] = object;
    };

    for (var i = 0; i < size; i++) {
        this.add(objectCreateFunction()); // заполняем пул
    }

    this.get = function () {
        var newObj = null;
        // the pool contains objects : grab one
        if (this.freeAmount > 0) {
            this.freeAmount--;
            newObj = this.objects[this.freeAmount];
            this.objects[this.freeAmount] = null; // очищаем массив
        }
        else { // the pool is empty : create new object
            newObj = objectCreateFunction();
        }
        return newObj;
    };

    this.free = function (object) {
        if (this.objects.indexOf(object) == -1) {
            this.add(object);
        }
    };
}
