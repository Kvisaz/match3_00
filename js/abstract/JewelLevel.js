/**
 * Created by Work on 29.11.2017.
 *
 * модель уровня для Match-3
 */
function JewelLevel(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.jewels = [];

    for (var i = 0; i < cols; i++) {
        this.jewels[i] = [];
        for (var j = 0; j < rows; j++) {
            this.jewels[i][j] = new JewelModel();
            this.jewels[i][j].column = i;
            this.jewels[i][j].row = j;
        }
    }
}

// заполнить уровень случайным распределением значений из typeArray
JewelLevel.prototype.fill = function (typeArray) {
    this.forEach(function (jewelModel) {
        jewelModel.type = typeArray.getRandom();
    });
    return this;
};

JewelLevel.prototype.forEach = function (fn, context) {
    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.rows; j++) {
            fn(this.jewels[i][j]);
        }
    }

    return this;
};

// проверка на допустимых соседей (по вертикали и горизонтали)
JewelLevel.prototype.isNear = function (jewel1, jewel2) {
    var inRow = jewel1.row == jewel2.row && Math.abs(jewel1.column - jewel2.column) == 1;
    var inColumn = jewel1.column == jewel2.column && Math.abs(jewel1.row - jewel2.row) == 1;
    return inRow || inColumn;
};

// Поиск всех соседей по данной модели
JewelLevel.prototype.getNears = function (jewel) {
    var nears = [];
    if (jewel.column > 0) nears.push(this.jewels[jewel.column - 1][jewel.row]);
    if (jewel.column < this.cols - 1) nears.push(this.jewels[jewel.column + 1][jewel.row]);
    if (jewel.row > 0) nears.push(this.jewels[jewel.column][jewel.row - 1]);
    if (jewel.row < this.rows - 1) nears.push(this.jewels[jewel.column][jewel.row + 1]);
    return nears;
};

// Поиск всех граничащих соседей одного типа
JewelLevel.prototype.getSameNears = function (jewel) {
    console.log("getSameNears started....");
    this.forEach(function (jewel) { // сбрасываем флаг обработки у всех камней
        jewel.isDispatched = false;
    });
    var sameJewels = []; // сюда будем сохранять результат
    sameJewels.push(jewel); // добавляем в кэш текущий

    var sameNearIndex = 0; // текущий элемент для поиска следующих
    var next; // курсор для перебора группы одного цвета
    var nears; // соседи
    do {
        next = sameJewels[sameNearIndex];
        console.log("current index : " + sameNearIndex);
        nears = this.getNears(next); // берем всех соседей у очередного элемента
        nears.forEach(function (near) {
            // сосед есть && сосед не обработан && сосед того же цвета
            if (near && !(near.isDispatched) && near.type === jewel.type) {
                console.log("near.type = " + near.type);
                console.log("jewel.type = " + jewel.type);
                sameJewels.push(near); // добавляем соседа
            }
        });
        next.isDispatched = true; // помечаем соседа обработанным
        console.log("sameNearIndex = " + sameNearIndex + " sameJewels.length = " + sameJewels.length);
        sameNearIndex++;
        if (sameNearIndex > this.jewels.length) {
            console.log("NONSENSE SAME NEAR LENTGH, BREAK THE LOOP");
            break;
        }

    } while (sameNearIndex < sameJewels.length)

    return sameJewels;
};

// меняем местами два камня (не зависимо от их расположения)
JewelLevel.prototype.swap = function (jewel1, jewel2) {
    var tmpColumn = jewel1.column;
    var tmpRow = jewel1.row;

    jewel1.column = jewel2.column;
    jewel1.row = jewel2.row;

    jewel2.column = tmpColumn;
    jewel2.row = tmpRow;


    this.jewels[jewel1.column][jewel1.row] = jewel1;
    this.jewels[jewel2.column][jewel2.row] = jewel2;

    return this;
};