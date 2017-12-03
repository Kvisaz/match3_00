/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.game = game;
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.SWAP_ANIMATION_DURATION = 200;
    this.BLAST_ANIMATION_DURATION = 150;
    this.JEWEL_SIZE = 64;
    this.FALL_SPEED_PIXELS_PER_MS = 0.6;
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

    // todo test
    myAsyncTest_1();
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

// анимация своп и обратный своп
BejeweledGroup.prototype.animateSwapUnswap = function (jewel1, jewel2) {
    this.lockUi();
    this.game.add.tween(jewel1.view)
        .to({x: jewel2.view.x, y: jewel2.view.y}, this.SWAP_ANIMATION_DURATION)
        .yoyo(true)
        .start();

    this.game.add.tween(jewel2.view)
        .to({x: jewel1.view.x, y: jewel1.view.y}, this.SWAP_ANIMATION_DURATION)
        .yoyo(true)
        .start()
        .onComplete.add(this.unlockUi, this); // только в конце, так как не возвращает ссылку на tween
};

BejeweledGroup.prototype.animateSwapBlast = function (jewel1, jewel2) {
    console.log("BejeweledGroup.prototype.animateSwapBlast");
    this.lockUi();
    this.game.add.tween(jewel1.view)
        .to({x: jewel2.view.x, y: jewel2.view.y}, this.SWAP_ANIMATION_DURATION)
        .start();

    this.game.add.tween(jewel2.view)
        .to({x: jewel1.view.x, y: jewel1.view.y}, this.SWAP_ANIMATION_DURATION)
        .start()
        // только в конце, так onComplete.add как не возвращает ссылку на tween
        .onComplete.add(function () {
        this.blastAndFall();
    }, this);
};

BejeweledGroup.prototype.blastAndFall = function () {
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
    tween.onComplete.add(this.newFall, this); // переходим к падению после последнего обновления
};

BejeweledGroup.prototype.newFall = function () {
    console.log("BejeweledGroup.prototype.newFall");
    var i, x, y, jewel, duration, tween, length = this.group.children.length;
    for (i = 0; i < length; i++) {
        jewel = this.group.children[i];
        if (jewel.model.type !== JewelType.NONE) {
            x = jewel.model.column * this.GRID_STEP;
            y = jewel.model.row * this.GRID_STEP;
            duration = Math.floor((y - jewel.y) / this.FALL_SPEED_PIXELS_PER_MS);
            tween = this.game.add.tween(jewel).to({x: x, y: y}, duration).start();
        }
    }
    // в последний твин пишем коллбэк презентер
    var me = this;
    tween.onComplete.add(function () {
        me.unlockUi();
        me.presenter.onFallFinished.call(me.presenter);
    });
};

BejeweledGroup.prototype.lockUi = function () {
    this.isUiBlocked = true;
};

BejeweledGroup.prototype.unlockUi = function () {
    this.isUiBlocked = false;
};