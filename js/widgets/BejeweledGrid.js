/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows, gridStep) {
    this.game = game;
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.SWAP_ANIMATION_DURATION = 200;
    this.GRID_STEP_FALL_DURATION = 140;
    this.BLAST_ANIMATION_DURATION = 100;

    this.GRID_STEP = gridStep || 66;

    this.width = this.GRID_STEP * cols;
    this.height = this.GRID_STEP * rows;

    this.selectedJewel = undefined;
    this.isUiBlocked = false; // блокировка на случай анимаций и эффектов
    this.swipe = new Swipe(this.GRID_STEP);

    this.jewelGenerator = CristmasJewelGenerator;
    this.jewelGenerator.init(game);

    this.cursor = this.jewelGenerator.getCursor();
    this.cursor.kill();

    this.group.onChildInputDown.add(this.onDown, this);
    this.game.input.onUp.add(this.onUp, this);
    this.presenter = new BejeweledPresenter(this, cols, rows);

    this.callbacks = {
        select: function (jewel) {
        },
        swap: function (jewel1, jewel2, hasCombo) {
        },
        levelGenerated: function () {
        }, // уровень сгенерирован
        hintShown: function (solution) {
        }, // показали подсказку {hint: jewel2, target: jewel1, length: comboLength}

        // начало взрыва всех камней, аргумент - массив камней
        blastStart: function (blastedJewels) {
        },
        totalBlastFinish: function () {
        }, // конец взрыва всех камней
        singleFallStart: function (jewel) {
        }, // начало падения камня
        singleFallFinish: function (jewel) {
        },  // окончание падения камня
        singleBornStart: function (jewel) {
        }, // генерация нового камня
        noMoves: function () {
        }, // нет больше ходов
    }
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
    jewelModel.view = this.jewelGenerator.createJewel(jewelModel.type);
    jewelModel.view.x = jewelModel.column * this.GRID_STEP;
    jewelModel.view.y = jewelModel.row * this.GRID_STEP;
    jewelModel.view.model = jewelModel;
    this.group.add(jewelModel.view);
};

// обновляем вьюху для сгенерированного камня
BejeweledGroup.prototype.setJewelViewType = function (jewel) {
    this.jewelGenerator.changeJewelTexture(jewel.view, jewel.type);
};

// обновляем вьюху для сгенерированного камня
BejeweledGroup.prototype.regenerateJewelView = function (jewel) {
    this.setJewelViewType(jewel);
    this.game.add.tween(jewel.view)
        .to({alpha: 1}, this.GRID_STEP_FALL_DURATION) // показываем новый камень быстро
        .delay(this.GRID_STEP_FALL_DURATION) // с задержкой, чтобы предыдущий успел упасть
        .start()
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

BejeweledGroup.prototype.lockUi = function () {
    this.isUiBlocked = true;
};

BejeweledGroup.prototype.unlockUi = function () {
    this.isUiBlocked = false;
};

// ------------------- Анимации --------------------

BejeweledGroup.prototype.makeSwapAnimation = function (jewel1Model, jewel2Model, makeUndoSwap) {
    if (makeUndoSwap == undefined) makeUndoSwap = false;
    this.game.add.tween(jewel1Model.view)
        .to({x: jewel2Model.view.x, y: jewel2Model.view.y}, this.SWAP_ANIMATION_DURATION, Phaser.Easing.Cubic.InOut)
        .yoyo(makeUndoSwap)
        .start();
    this.game.add.tween(jewel2Model.view)
        .to({x: jewel1Model.view.x, y: jewel1Model.view.y}, this.SWAP_ANIMATION_DURATION, Phaser.Easing.Cubic.InOut)
        .yoyo(makeUndoSwap)
        .start();
};

// катим вьюху на актуальные координаты
BejeweledGroup.prototype.makeFallingJewelView = function (jewel) {
    this.game.add.tween(jewel.view)
        .to({y: jewel.row * this.GRID_STEP}, this.GRID_STEP_FALL_DURATION, Phaser.Easing.Cubic.InOut)
        .start()
};


BejeweledGroup.prototype.makeBlastAnimation = function (jewelModel) {
    this.game.add.tween(jewelModel.view)
        .to({alpha: 0}, this.BLAST_ANIMATION_DURATION) // убираем
        .to({y: 0}, 1) // откатываем вьюху на первую свободную позицию - иначе не будет падения
        .start()
};

BejeweledGroup.prototype.makeHintAnimation = function (hintJewel, targetJewel) {
    if(this.isUiBlocked) return;
    this.lockUi();
    this.game.add.tween(hintJewel.view)
        .to({y: hintJewel.view.y - 10}, 50)
        .to({y: hintJewel.view.y + 10}, 80)
        .to({y: hintJewel.view.y}, 80)
        .start();

    this.game.add.tween(targetJewel.view)
        .to({y: targetJewel.view.y - 10}, 50)
        .to({y: targetJewel.view.y + 10}, 80)
        .to({y: targetJewel.view.y}, 80)
        .delay(225)
        .start()
        .onComplete.add(function () {
            this.unlockUi();
    }, this);
};

// ------------------- Интерфейс внешний --------------------

// перегенерить уровень, раздать новые случайные типы для камней
BejeweledGroup.prototype.restart = function () {
    this.presenter.unselect();
    this.presenter.generateLevel();
};

// показать подсказку, если maximizeCombo = true - с максимальной длиной
BejeweledGroup.prototype.showHint = function (maximizeCombo) {
    this.presenter.showHint(maximizeCombo);
};

// убрать подсказку
BejeweledGroup.prototype.hideHint = function () {
    this.presenter.unselect();
};

// взять число решений
BejeweledGroup.prototype.getSolutionsAmount = function () {
    return this.presenter.solutions.length;
};