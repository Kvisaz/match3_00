/**
 * Created by Work on 29.11.2017.
 *
 * модель уровня для Match-3
 */
function JewelLevel(cols, rows) {
    this.length = cols * rows;
    this.cols = cols;
    this.rows = rows;
    this.jewels = [];

    // для быстрого вычисления
    this.directionsDelta = [
        {column: -1, row: 0}, //LEFT: 0,
        {column: 0, row: -1},//UP: 1,
        {column: 1, row: 0},//RIGHT: 2,
        {column: 0, row: 1},//DOWN: 3,
    ];

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
JewelLevel.prototype.fill = function (fn, context) {
    this.forEach(function (jewelModel) {
        jewelModel.type = fn.call(context);
    });
    return this;
};


JewelLevel.prototype.forEach = function (fn, context) {
    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.rows; j++) {
            fn.call(context, this.jewels[i][j]);
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
    this.resetDispatched();
    var sameJewels = []; // сюда будем сохранять результат
    sameJewels.push(jewel); // добавляем в кэш текущий

    var sameNearIndex = 0; // текущий элемент для поиска следующих
    var next; // курсор для перебора группы одного цвета
    var nears; // соседи
    do {
        next = sameJewels[sameNearIndex];
        nears = this.getNears(next); // берем всех соседей у очередного элемента
        nears.forEach(function (near) {
            // сосед есть && сосед не обработан && сосед того же цвета
            if (near && !(near.isDispatched) && near.type === jewel.type) {
                next.isDispatched = true; // помечаем соседа обработанным
                sameJewels.push(near); // добавляем соседа
            }
        });

        sameNearIndex++;

        if (sameNearIndex > this.length) {
            console.log("sameNearIndex = " + sameNearIndex);
            console.log("this.jewels.length = " + this.length);
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

// сбрасывает все пустые вниз
JewelLevel.prototype.selectNearByDirection = function (jewel, direction) {
    var column = jewel.column + this.directionsDelta[direction].column;
    var row = jewel.row + this.directionsDelta[direction].row;
    if (column < 0 || row < 0 || column >= this.cols || row >= this.rows) return undefined;
    return this.jewels[column][row];
};

// сбросить поле обработки
JewelLevel.prototype.resetDispatched = function () {
    var col, row;
    for (col = 0; col < this.cols; col++) {
        for (row = 0; row < this.rows; row++) {
            this.jewels[col][row].isDispatched = false;
        }
    }
};

// найти, сколько выигрышных комбинаций на уровне сейчас, при заданном числе в группе
JewelLevel.prototype.countGroups = function (minimalAmount) {
    this.resetDispatched();
    var col, row, jewel;
    var groups = [];
    var nextCombo = [];
    for (col = 0; col < this.cols; col++) {
        for (row = 0; row < this.rows; row++) {
            jewel = this.jewels[col][row];
            if (jewel.isDispatched) continue;
            // ищем всех одного цвета
            nextCombo = this.getSameNears(jewel); // помечает isDispatched для всех в комбо
            if (nextCombo.length >= minimalAmount) {
                groups.push(nextCombo);
            }
        }
    }
    return groups;
};

// поиск всех возможных решений, т.е. замен, при которых образуются выигрышные комбинации
JewelLevel.prototype.getSolutions = function (minimalAmount) {
    var col, row, colMax = this.cols - 1, rowMax = this.rows - 1;
    var solutions = []; // массив пар, образующих замены
    for (col = 0; col <= colMax; col++) {
        for (row = 0; row <= rowMax; row++) {
            if (col < colMax) { // 1. свопаем с соседом справа и проверяем
                this.checkSolution(this.jewels[col][row], this.jewels[col + 1][row], minimalAmount, solutions);
            }
            if (row < rowMax) { // 2. свопаем с соседом снизу и проверяем
                this.checkSolution(this.jewels[col][row], this.jewels[col][row + 1], minimalAmount, solutions);
            }
        }
    }
    // проверка углового нижнего - его свопаем в обратном порядке
    this.checkSolution(this.jewels[colMax][rowMax], this.jewels[colMax - 1][rowMax], minimalAmount, solutions);
    this.checkSolution(this.jewels[colMax][rowMax], this.jewels[colMax][rowMax - 1], minimalAmount, solutions);
    return solutions;
};

// временная функция
// проверить наличие решений для пары камней (предполагается, что они соседи)
JewelLevel.prototype.checkSolution = function (jewel1, jewel2, minimalAmount, solutions) {
    this.swap(jewel1, jewel2); // меняем камни местами
    var comboLength = this.getSameNears(jewel1).length;
    if (comboLength >= minimalAmount) {
        solutions.push({hint: jewel1, target: jewel2, length: comboLength});
    } else {
        comboLength = this.getSameNears(jewel2).length;
        if (comboLength >= minimalAmount) solutions.push({hint: jewel2, target: jewel1, length: comboLength});
    }
    this.swap(jewel1, jewel2); // возвращаем все на место
};