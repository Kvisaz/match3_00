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
    this.GRID_STEP = 66;

    this.selectedJewel = undefined;
    this.isUiBlocked = false; // блокировка на случай анимаций и эффектов
    this.swipe = new Swipe(this.GRID_STEP);

    this.cursor = JewelGenerator.getCursor();
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

// катим вьюху на актуальные координаты
BejeweledGroup.prototype.makeFallingJewelView = function (jewel) {
    console.log("makeFallingJewelView");
    this.game.add.tween(jewel.view)
        .to({y: jewel.row * this.GRID_STEP}, this.GRID_STEP_FALL_DURATION)
        .start()
};

// обновляем вьюху для сгенерированного камня
BejeweledGroup.prototype.refreshJewelView = function (jewel) {
    console.log("refreshJewelView");
    jewel.view.loadTexture(JewelGenerator.getJewelTexture(jewel.type));
    this.game.add.tween(jewel.view)
        .to({alpha: 1}, this.GRID_STEP_FALL_DURATION) // показываем новый камень быстро
        .delay(this.GRID_STEP_FALL_DURATION) // с задержкой, чтобы предыдущий успел упасть
        .start()
};

// вызвать с задержкой. Метод здесь, потому что именно вью определяет задержку
BejeweledGroup.prototype.callWithFallStepDelay = function (callback, context) {
    console.log("callWithFallStepDelay");
    this.game.time.events.add(this.GRID_STEP_FALL_DURATION, callback, context);
};

// вызвать с задержкой. Метод здесь, потому что именно вью определяет задержку
BejeweledGroup.prototype.callWithBlastDelay = function (callback, context) {
    console.log("callWithBlastDelay");
    this.game.time.events.add(this.BLAST_ANIMATION_DURATION, callback, context);
};

BejeweledGroup.prototype.requestBlastAnimation = function (jewelModel) {
    this.game.add.tween(jewelModel.view)
        .to({alpha: 0}, this.BLAST_ANIMATION_DURATION) // убираем
        .to({y: 0}, 1) // откатываем вьюху на первую свободную позицию - иначе не будет падения
        .start()
};

BejeweledGroup.prototype.lockUi = function () {
    this.isUiBlocked = true;
};

BejeweledGroup.prototype.unlockUi = function () {
    this.isUiBlocked = false;
};