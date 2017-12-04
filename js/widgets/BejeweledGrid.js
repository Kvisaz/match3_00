/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.game = game;
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.SWAP_ANIMATION_DURATION = 200;
    this.GRID_STEP_FALL_DURATION = 65;
    this.BLAST_ANIMATION_DURATION = 150;
    this.JEWEL_SIZE = 64;
    this.CURSOR_SIZE = 66;
    this.GRID_STEP = 66;
    this.COMBO_AMOUNT_MIN = 3;

    this.selectedJewel = undefined;
    this.isUiBlocked = false; // блокировка на случай анимаций и эффектов
    this.swipe = new Swipe(this.GRID_STEP);

    this.cursor = ImageBuilder.strokeRect(0, 0,
        this.CURSOR_SIZE, this.CURSOR_SIZE,
        "#00ffff", 6);
    this.cursor.kill();

    this.group.onChildInputDown.add(this.onDown, this);
    this.game.input.onUp.add(this.onUp, this);
    this.presenter = new BejeweledPresenter(this, cols, rows);
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    if (this.isUiBlocked || jewel.model.type == JewelType.NONE) return;
    this.swipe.start(pointer.x, pointer.y); // для проверки свайпа
    this.presenter.onJewelClickDown(jewel.model);
};

// проверяем  на свайп
BejeweledGroup.prototype.onUp = function (pointer) {
    if (this.isUiBlocked) return;
    if (this.swipe.check(pointer.x, pointer.y) == false) return; // меньше допустимого значения - выходим
    this.presenter.onSwipe(this.swipe.direction);
};

// ------------------- for presenter --------------------
BejeweledGroup.prototype.addJewelView = function (jewelModel) {
    var jewelImage = JewelGenerator.createJewel(jewelModel.type);
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

BejeweledGroup.prototype.swap = function (jewel1Model, jewel2Model, callback, callbackContext) {
    this.lockUi();
    this.game.add.tween(jewel1Model.view)
        .to({x: jewel2Model.view.x, y: jewel2Model.view.y}, this.SWAP_ANIMATION_DURATION)
        .start();

    var me = this;
    this.game.add.tween(jewel2Model.view)
        .to({x: jewel1Model.view.x, y: jewel1Model.view.y}, this.SWAP_ANIMATION_DURATION)
        .start()
        .onComplete.add(function () { // только в конце, так как не возвращает ссылку на tween
        this.unlockUi();
        if (callback) callback.call(callbackContext, jewel1Model, jewel2Model);
    }, this);
};

// пробуем "упасть" на 1 камень - по сути просто освежить координаты у вьюх
// если все координаты валидны - значит, падение завершено, изменений нет
BejeweledGroup.prototype.tryNextFall = function () {
    this.lockUi();
    console.log("tryNextFall");
    var i, y, jewel, tween, length = this.group.children.length;
    for (i = 0; i < length; i++) {
        jewel = this.group.children[i];
        // если координаты не соответствуют ряду - обновляем
        y = jewel.model.row * this.GRID_STEP;
        if (y !== jewel.y) {
            tween = this.game.add.tween(jewel)
                .to({y: y}, this.GRID_STEP_FALL_DURATION) // катим вьюху на актуальные координаты
                .start()
        }
    }

    // в любом случае пробуем генерацию - вдруг пустота в первом ряду
    if (tween) { // падение состоялось, пробуем генерацию
        tween.onComplete.add(function () {
            this.presenter.tryGenerate();
        }, this);
    } // переходим к падению после последнего обновления
    else {
        this.presenter.tryGenerate();
    }
};

// генерируем новые камни (создаем вью)
BejeweledGroup.prototype.tryGenerate = function (jewelModelArray) {
    this.lockUi();
    console.log("tryGenerate");
    var i, y, jewelModel, duration, tween, length = jewelModelArray.length;
    for (i = 0; i < length; i++) {
        jewelModel = jewelModelArray[i];
        // грузим новую текстуру
        jewelModel.view.loadTexture(JewelGenerator.getJewelTexture(jewelModel.type));
        tween = this.game.add.tween(jewelModel.view)
            .to({alpha: 1}, this.GRID_STEP_FALL_DURATION) // катим вьюху на актуальные координаты
            .start()
    }


    // именно отсутствие генерации является признаком окончания формирования уровня
    if (tween) { // падение состоялось, возвращаемся и пробуем снова
        tween.onComplete.add(function () {
            this.presenter.tryNextFall();
        }, this);
    } // переходим к падению после последнего обновления
    else {
        this.unlockUi();
        this.presenter.onFallFinished();
    }
};

BejeweledGroup.prototype.blast = function (callback, callbackContext) {
    console.log("BejeweledGroup.prototype.blast");
    var i, x, y, jewel, duration, tween, length = this.group.children.length;
    for (i = 0; i < length; i++) {
        jewel = this.group.children[i];
        if (jewel.model.type === JewelType.NONE) {
            x = jewel.model.column * this.GRID_STEP;
            y = 0;
            tween = this.game.add.tween(jewel)
                .to({alpha: 0}, this.BLAST_ANIMATION_DURATION) // взрываем
                .to({x: x, y: y}, 1) // откатываем вьюху на первую свободную позицию
                .start()
        }
    }
    tween.onComplete.add(callback, callbackContext); // переходим к падению после последнего обновления
};

BejeweledGroup.prototype.lockUi = function () {
    this.isUiBlocked = true;
};

BejeweledGroup.prototype.unlockUi = function () {
    this.isUiBlocked = false;
};