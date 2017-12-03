/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.game = game;
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.BLAST_ANIMATION_DURATION = 150;
    this.JEWEL_SIZE = 64;
    this.FALL_SPEED_PIXELS_PER_MS = 0.6;
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

    this.cursor = ImageBuilder.strokeRect(0, 0,
        this.CURSOR_SIZE, this.CURSOR_SIZE,
        "#00ffff", 6);
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
    var tween, me = this;
    jewelModelArray.forEach(function (jewel) {
        tween = me.game.add.tween(jewel.view).to({alpha: 0}, me.BLAST_ANIMATION_DURATION).start();
    });
    tween.onComplete.add(this.presenter.onBlastFinished, this.presenter);
};

BejeweledGroup.prototype.refreshJewels = function (jewels) {
    var jewel, x, y, duration, col, row, tween, maxCol = jewels.length - 1, maxRow = jewels[0].length - 1;
    for (col = 0; col <= maxCol; col++) {
        for (row = 0; row <= maxRow; row++) {
            jewel = jewels[col][row];
            x = col * this.GRID_STEP;
            y = row * this.GRID_STEP;
            duration = Math.floor((y - jewel.view.y) / this.FALL_SPEED_PIXELS_PER_MS);
            tween = this.game.add.tween(jewel.view).to({x: x, y: y}, duration).start();
        }
    }
    // в последний твин пишем коллбэк презентер
    tween.onComplete.add(this.presenter.onFallFinished, this.presenter);
};