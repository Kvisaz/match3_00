/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.COLORS_AMOUNT = 8;
    this.JEWEL_SIZE = 64;
    this.CURSOR_SIZE = 66;
    this.GRID_STEP = 66;
    this.COMBO_AMOUNT_MIN = 3;

    this.selectedJewel = undefined;
    this.isSwapping = false;
    this.swipe = new Swipe(this.GRID_STEP);

    this.data = { // индекс наших камней для быстрого поиска соседей
        jewels: [],
        cols: cols,
        rows: rows,
    };

    this.cache = {
        combo1: [],
        combo2: [],
        nears: [], // просто соседи
    };

    var col, row, jewel, jewelType;
    for (col = 0; col < cols; col++) {
        this.data.jewels[col] = [];
        for (row = 0; row < rows; row++) {
            jewelType = Math.floor(Math.random() * this.COLORS_AMOUNT);
            jewel = JewelGenerator.createJewel(game, jewelType); // jewelType сохраняется как поле в jewel
            jewel.x = col * this.GRID_STEP;
            jewel.y = row * this.GRID_STEP;
            jewel.jewelType = jewelType;
            jewel.jewelCounted = false; // флаг для обработки в поиске групп
            jewel.tweenTarget = {x: 0, y: 0}; // цель анимации
            jewel.tween = game.add.tween(jewel); // анимация, которую запустим потом
            jewel.tween.to(jewel.tweenTarget, 250); // программируем анимацию
            this.group.add(jewel);
            this.data.jewels[col][row] = jewel; // непременно сохраняем ссылку в индексе
            jewel.jewelCol = col;
            jewel.jewelRow = row;
        }
    }

    this.cursor = ImageBuilder.createStrokedRectangleImage(game, 0, 0,
        this.CURSOR_SIZE,
        this.CURSOR_SIZE,
        "#00ffff",
        "cursor", 6);
    this.cursor.kill();
    this.group.add(this.cursor);

    this.group.onChildInputDown.add(this.onDown, this);
    game.input.onUp.add(this.onUp, this);
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    if (this.isSwapping) return;
    this.swipe.start(pointer.x, pointer.y); // для проверки свайпа
    console.log("jewel = " + jewel.jewelCol + ", " + jewel.jewelRow);
    if (jewel.jewelType !== undefined) { // undefined - курсор
        this.select(jewel);
    }
    else {
        this.unselect();
    }
};

// проверяем  на свайп
BejeweledGroup.prototype.onUp = function (pointer) {
    if (this.isSwapping || this.selectedJewel === undefined) return;
    if (this.swipe.check(pointer.x, pointer.y) == false) return; // меньше допустимого значения - выходим

    var jewel1 = this.selectedJewel;
    this.unselect();
    var jewel2 = this.selectNearByDirection(jewel1, this.swipe.direction);
    if (jewel2 === undefined) {
        this.unselect();
        return;
    }
    this.swap(jewel1, jewel2);
};

BejeweledGroup.prototype.selectNearByDirection = function (jewel, direction) {
    var nearJewel;
    switch (direction) {
        case this.swipe.directions.LEFT:
            if (this.data.jewels[jewel.jewelCol - 1] === undefined) return undefined;
            return this.data.jewels[jewel.jewelCol - 1][jewel.jewelRow];
        case this.swipe.directions.UP:
            return this.data.jewels[jewel.jewelCol][jewel.jewelRow - 1];
        case this.swipe.directions.RIGHT:
            if (this.data.jewels[jewel.jewelCol + 1] === undefined) return undefined;
            return this.data.jewels[jewel.jewelCol + 1][jewel.jewelRow];
        case this.swipe.directions.DOWN:
            return this.data.jewels[jewel.jewelCol][jewel.jewelRow + 1];
    }
};

// Поиск всех граничащих соседей одного типа

BejeweledGroup.prototype.getSameNears = function (jewel) {
    console.log("getSameNears started....");

    // сбрасываем флаг обработки у всех камней
    // выбрана группа, потому что одна одномерная, в отличие от индекса this.data.jewels
    this.group.forEach(function (jewel) {
        jewel.jewelCounted = false;
    });

    var sameJewels = []; // сюда будем сохранять результат
    sameJewels.push(jewel); // добавляем в кэш текущий
    var sameNearIndex = 0; // текущий элемент для поиска следующих
    var next; // курсор для перебора группы одного цвета

    do {
        next = sameJewels[sameNearIndex];
        console.log("current index : " + sameNearIndex);
        this.getNears(next); // берем всех соседей у очередного элемента
        this.cache.nears.forEach(function (near) {
            // сосед есть && сосед не обработан && сосед того же цвета
            if (near && !(near.jewelCounted) && near.jewelType === next.jewelType) {
                sameJewels.push(near); // добавляем соседа
            }
        });
        next.jewelCounted = true; // помечаем соседа обработанным
        console.log("sameNearIndex = " + sameNearIndex + " sameJewels.length = " + sameJewels.length);
        sameNearIndex++;
    } while (sameNearIndex < sameJewels.length)

    return sameJewels;
};

// Поиск всех соседей
BejeweledGroup.prototype.getNears = function (jewel) {
    this.cache.nears[0] = jewel.jewelCol > 0 ?
        this.data.jewels[jewel.jewelCol - 1][jewel.jewelRow]
        : undefined;
    this.cache.nears[1] = jewel.jewelCol < this.data.cols - 1 ?
        this.data.jewels[jewel.jewelCol + 1][jewel.jewelRow]
        : undefined;
    this.cache.nears[2] = jewel.jewelRow > 0 ?
        this.data.jewels[jewel.jewelCol][jewel.jewelRow - 1]
        : undefined;
    this.cache.nears[3] = jewel.jewelRow < this.data.rows - 1 ?
        this.data.jewels[jewel.jewelCol][jewel.jewelRow + 1]
        : undefined;
    return this.cache.nears;
};

// проверка на допустимых соседей (по вертикали и горизонтали)
BejeweledGroup.prototype.isNear = function (jewel1, jewel2) {
    var inRow = jewel1.jewelRow == jewel2.jewelRow && Math.abs(jewel1.jewelCol - jewel2.jewelCol) == 1;
    var inColumn = jewel1.jewelCol == jewel2.jewelCol && Math.abs(jewel1.jewelRow - jewel2.jewelRow) == 1;
    return inRow || inColumn;
};

BejeweledGroup.prototype.select = function (jewel) {
    if (this.selectedJewel && this.isNear(this.selectedJewel, jewel)) { // проверка на соседство
        // swap
        var selectedJewel = this.selectedJewel;
        this.unselect();
        this.swap(selectedJewel, jewel);
    }
    else { // select new
        this.selectedJewel = jewel;
        this.cursor.alignIn(jewel, Phaser.CENTER);
        this.cursor.revive();
    }
};

BejeweledGroup.prototype.unselect = function () {
    this.selectedJewel = undefined;
    this.cursor.kill();
};

BejeweledGroup.prototype.swap = function (jewel1, jewel2) {
    console.log("SWAP!");
    if(jewel1.jewelType === jewel2.jewelType)  return; // запрет на своп одинакового цвета - упрощает вычисление групп
    this.isSwapping = true; // блокируем ввод

    // меняем данные, чтобы сработала проверка комбо
    this.swapInModel(jewel1, jewel2);

    // проверяем есть ли комбо для всех, кроме NONE
    this.cache.combo1 = jewel1.jewelType != JewelType.NONE ? this.getSameNears(jewel1) : [];
    this.cache.combo2 = jewel2.jewelType != JewelType.NONE ? this.getSameNears(jewel2) : [];

    // комбо хотя бы 1 есть
    if(this.cache.combo1.length >= this.COMBO_AMOUNT_MIN
    || this.cache.combo2.length >= this.COMBO_AMOUNT_MIN){
        // настраиваем цели движения для камней ...........
        jewel2.tweenTarget.x = jewel1.x;
        jewel2.tweenTarget.y = jewel1.y;
        jewel1.tweenTarget.x = jewel2.x;
        jewel1.tweenTarget.y = jewel2.y;

        // отдаем приказ на движение
        jewel1.tween.start();
        jewel2.tween.start();
        jewel2.tween.onComplete.add(this.onSwapComplete, this);
    }
    else {
        // отменить логику
        this.swapInModel(jewel1, jewel2);
        this.isSwapping = false; // разблокируем ввод
    }
};

BejeweledGroup.prototype.swapInModel = function (jewel1, jewel2) {
    // меняем данные о колонке и ряде для камней ...........
    var tmpCol = jewel2.jewelCol;
    var tmpRow = jewel2.jewelRow;
    jewel2.jewelCol = jewel1.jewelCol;
    jewel2.jewelRow = jewel1.jewelRow;
    jewel1.jewelCol = tmpCol;
    jewel1.jewelRow = tmpRow;

    // обновляем индекс
    this.data.jewels[jewel2.jewelCol][jewel2.jewelRow] = jewel2;
    this.data.jewels[jewel1.jewelCol][jewel1.jewelRow] = jewel1;
};

BejeweledGroup.prototype.onSwapComplete = function () {
    this.blast(this.cache.combo1);
    this.blast(this.cache.combo2);

    // разблокируем ввод
    this.isSwapping = false;
};

BejeweledGroup.prototype.blast = function (jewelArr) {
    if(jewelArr.length < this.COMBO_AMOUNT_MIN) return; // минимальные не взрываем
    jewelArr.forEach(function (jewel) {
        jewel.jewelType = JewelType.NONE;
        // todo blast
        jewel.kill();
    });
};

// проверить пустые места, если есть - сдвинуть соседей сверху на 1
// на конец анимации - вызвать себя еще раз
// вернуть true
// если пустых мест нет - вернуть false
BejeweledGroup.prototype.checkVoid = function () {

};