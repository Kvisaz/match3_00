/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.game = game;
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.BLAST_ANIMATION_DURATION = 150;
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
        removed: [],
        combo1: [],
        combo2: [],
        nears: [], // просто соседи
    };

    this.cursor = ImageBuilder.createStrokedRectangleImage(game, 0, 0,
        this.CURSOR_SIZE,
        this.CURSOR_SIZE,
        "#00ffff",
        "cursor", 6);
    this.cursor.kill();

    this.group.onChildInputDown.add(this.onDown, this);
    // game.input.onUp.add(this.onUp, this);
    this.presenter = new BejeweledPresenter(this, cols, rows);

    // todo test
    myAsyncTest_1();
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    this.swipe.start(pointer.x, pointer.y); // для проверки свайпа
    this.presenter.onJewelClickDown(jewel.model);
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
    var nears; // соседи
    do {
        next = sameJewels[sameNearIndex];
        console.log("current index : " + sameNearIndex);
        nears = this.getNears(next); // берем всех соседей у очередного элемента
        nears.forEach(function (near) {
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
    var inRow = jewel1.model.row == jewel2.model.row && Math.abs(jewel1.model.column - jewel2.model.column) == 1;
    var inColumn = jewel1.model.column == jewel2.model.column && Math.abs(jewel1.model.row - jewel2.model.row) == 1;
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

BejeweledGroup.prototype.swap___Old = function (jewel1, jewel2) {
    console.log("SWAP!");
    if (jewel1.model.type === jewel2.model.type)  return; // запрет на своп одинакового цвета - упрощает вычисление групп
    this.isSwapping = true; // блокируем ввод

    // меняем данные, чтобы сработала проверка комбо
    this.swapInModel(jewel1, jewel2);

    // проверяем есть ли комбо для всех, кроме NONE
    //this.cache.combo1 = jewel1.model.type != JewelType.NONE ? this.getSameNears(jewel1) : [];
    //this.cache.combo2 = jewel2.model.type != JewelType.NONE ? this.getSameNears(jewel2) : [];

    var combo1 = jewel1.model.type != JewelType.NONE ? this.getSameNears(jewel1) : [];
    var combo2 = jewel2.model.type != JewelType.NONE ? this.getSameNears(jewel2) : [];

    // комбо хотя бы 1 есть
    if (this.cache.combo1.length >= this.COMBO_AMOUNT_MIN
        || this.cache.combo2.length >= this.COMBO_AMOUNT_MIN) {
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
    this.cache.removed = [];
    this.blast(this.cache.combo1);
    this.blast(this.cache.combo2);

    this.checkVoid();

    // разблокируем ввод
    this.isSwapping = false;
};

BejeweledGroup.prototype.blast = function (jewelArr) {
    if (jewelArr.length < this.COMBO_AMOUNT_MIN) return; // минимальные не взрываем
    this.cache.removed = this.cache.removed.concat(jewelArr);
    var me = this;
    jewelArr.forEach(function (jewel) {
        jewel.jewelType = JewelType.NONE;
        jewel.kill();
        me.data.jewels[jewel.jewelCol][jewel.jewelRow] = undefined;
    });
};

// проверить пустые места, если есть - сдвинуть соседей сверху на 1
// на конец анимации - вызвать себя еще раз
// вернуть true
// если пустых мест нет - вернуть false
BejeweledGroup.prototype.checkVoid = function () {
    var hasVoids = false;
    var nextJewel, fallJewel, col, row;
    for (col = 0; col < this.data.cols; col++) {
        for (row = 0; row < this.data.rows; row++) {
            nextJewel = this.data.jewels[col][row];
            if (nextJewel === undefined) {
                if (row == 0) { // первый ряд - создаем новый
                    nextJewel.jewelType = JewelType.getRandomCommon();
                    nextJewel.revive();
                }
                else {
                    this.data.jewels[col][row - 1] = nextJewel; // поднимаем пустой выше
                    nextJewel.jewelRow--;

                    fallJewel = this.data.jewels[col][row - 1];
                    fallJewel.tweenTarget.x = nextJewel.x;
                    fallJewel.tweenTarget.y = nextJewel.y;

                    this.data.jewels[col][row] = fallJewel; // поднимаем пустой выше
                    fallJewel.jewelRow = row; // поднимаем пустой выше
                    fallJewel.jewelCol = col; // поднимаем пустой выше

                    fallJewel.tween.start();
                    hasVoids = true;
                }
            }
        }
    }
    // когда последняя анимация завершится - проверяем снова
    if (fallJewel !== undefined) {
        fallJewel.tween.onComplete.add(this.checkVoid, this);
    }
};


//  Падение в Match-3
// передаем 2D-массив, в котором записаны фишки
// jewels[col][row] - то есть у нас просто массив
BejeweledGroup.prototype.fallAll = function (jewels) {
    for (var i = 0; i < jewels.length; i++) {
        this.fallColumn(jewels[i]);
    }
};

//  Падение в Match-3 для 1 колонки
BejeweledGroup.prototype.fallColumn = function (jewelsColumn) {
    // суть - назначаем всем фишкам время и расстояние "падения"
    // эти переменные зависят от числа найденных "пустых фишек" под текущей фишкой
    var deltaY = 0;  // расстояние падения по дефолту
    var deltaTime = 0; // время падения по дефолту

    var stepY = this.GRID_STEP;
    var stepTime = 100; //ms
    var next;
    for (var i = jewelsColumn.length - 1; i > 0; i--) {
        next = jewelsColumn[i];
        if (next == undefined) {
            deltaY += stepY;
            deltaTime += stepTime;
        }
        else {
            // next.tweenTarget
            // todo нужна модель
        }

    }
};

// ------------------- for presenter --------------------
BejeweledGroup.prototype.addJewelView = function (jewelModel) {
    var jewelImage = JewelGenerator.createJewel(this.game, jewelModel.type);
    jewelImage.x = jewelModel.column * this.GRID_STEP;
    jewelImage.y = jewelModel.row * this.GRID_STEP;
    jewelImage.model = jewelModel;
    jewelImage.tweenTarget = {x: 0, y: 0, alpha: 1};
    jewelImage.tween = this.game.add.tween(jewelImage);
    jewelImage.tween.to(jewelImage.tweenTarget, 250);
    jewelModel.view = jewelImage;
    this.group.add(jewelImage);
};

BejeweledGroup.prototype.showCursor = function (jewelModel) {
    this.cursor.alignIn(jewelModel.view, Phaser.CENTER);
    this.cursor.x += this.group.x;
    this.cursor.y += this.group.y;
    this.cursor.revive();
};

BejeweledGroup.prototype.hideCursor = function () {
    this.cursor.kill();
};

BejeweledGroup.prototype.swap = function (jewelModel1, jewelModel2, callback, callbackContext) {
    // меняем позиции
    jewelModel1.view.tweenTarget.x = jewelModel2.view.x;
    jewelModel1.view.tweenTarget.y = jewelModel2.view.y;
    jewelModel2.view.tweenTarget.x = jewelModel1.view.x;
    jewelModel2.view.tweenTarget.y = jewelModel1.view.y;
    jewelModel1.view.tween.start();
    jewelModel2.view.tween.start();

    // передача аргументов в addOnce не работает, идет мусор - image, tween   и тд
    jewelModel2.view.tween.onComplete.addOnce(callback, callbackContext, 0);
};

BejeweledGroup.prototype.blast = function (jewelModelArray) {
    var i, tween, max = jewelModelArray.length - 1;
    for (var i = 0; i <= max; i++) {
        tween = this.game.add.tween(jewelModelArray[i].view).to({alpha: 0}, this.BLAST_ANIMATION_DURATION).start();
        if (i == max) {
            tween.onComplete.add(this.presenter.onBlastFinished, this.presenter);
        }
    }
};