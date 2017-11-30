/**
 * Created by Work on 30.11.2017.
 */
function BejeweledPresenter(view, cols, rows) {
    this.isAnimationWorking = false;
    this.JEWEL_SIZE = 64;
    this.CURSOR_SIZE = 66;
    this.GRID_STEP = 66;
    this.COMBO_AMOUNT_MIN = 3;
    // запоминаем наше большое вью
    this.view = view;
    // создаем модель уровня
    this.jewelLevel = new JewelLevel(cols, rows)
        .fill(JewelType.getCommonTypeArray()) // заполняем модель всеми доступными общими типами
        .forEach(view.addJewelView.bind(view)); // добавляем соответствующий камень на поле

    this.selectedJewel = undefined;
    this.swapPair = {jewel1: undefined, jewel2: undefined};
};

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    console.log("presenter.onJewelClickDown - jewel col: " + jewel.column + " row: " + jewel.row);
    if (this.isAnimationWorking) return; // блокировка анимаций
    // есть выделение и это соседи
    if (this.hasSelection() && this.jewelLevel.isNear(this.selectedJewel, jewel)) {
        if (this.isSwapAllowed(this.selectedJewel, jewel)) {
            this.swap(this.selectedJewel, jewel);
        }
        this.unselect();
    }
    else { // нет выделения или кликнули на далеко отстоящем - переносим выделение на новый
        this.select(jewel);
    }
};

BejeweledPresenter.prototype.select = function (jewel) {
    this.selectedJewel = jewel;
    this.view.showCursor(jewel);
};

BejeweledPresenter.prototype.unselect = function () {
    this.view.hideCursor();
    this.selectedJewel = undefined;
};

BejeweledPresenter.prototype.hasSelection = function () {
    return this.selectedJewel !== undefined
};

BejeweledPresenter.prototype.isSwapAllowed = function (jewel1, jewel2) {
    // запрет на своп одинакового цвета - упрощает вычисление групп
    return jewel1.type !== jewel2.type;
};

BejeweledPresenter.prototype.swap = function (jewel1, jewel2, undo) {
    this.isAnimationWorking = true;
    this.jewelLevel.swap(jewel1, jewel2);
    this.swapPair.jewel1 = jewel1;
    this.swapPair.jewel2 = jewel2;
    var callback = undo ? this.onUndoSwapFinished : this.onSwapFinished;
    this.view.swap(jewel1, jewel2, callback, this);
    if(undo) this.isAnimationWorking = false;
};

BejeweledPresenter.prototype.onUndoSwapFinished = function (jewel1, jewel2) {
    this.isAnimationWorking = false;
};

BejeweledPresenter.prototype.onSwapFinished = function () {
    var combo1 = this.jewelLevel.getSameNears(this.swapPair.jewel1); // 1. проверить, есть ли комбо
    var combo2 = this.jewelLevel.getSameNears(this.swapPair.jewel2);
    console.log("combo1.length = " + combo1.length + " / combo2.length" + combo2.length);

    if (combo1.length < this.COMBO_AMOUNT_MIN && combo2.length < this.COMBO_AMOUNT_MIN) {
        this.swap(this.swapPair.jewel1, this.swapPair.jewel2, true); // undo Swap
        return;
    }
    else {
        this.blast(combo1, combo2);
    }
    // 2. отыграть комбо или свопнуть обратно
    this.swapPair.jewel1 = undefined;
    this.swapPair.jewel2 = undefined;
};

BejeweledPresenter.prototype.blast = function (combo1, combo2) {
    var jewelArray = [];
    if(combo1.length >= this.COMBO_AMOUNT_MIN) jewelArray = jewelArray.concat(jewelArray, combo1);
    if(combo2.length >= this.COMBO_AMOUNT_MIN) jewelArray = jewelArray.concat(jewelArray, combo2);
    jewelArray.forEach(function (jewel) {
        jewel.type = JewelType.NONE;
    });
    this.view.blast(jewelArray);
};

BejeweledPresenter.prototype.onBlastFinished = function () {
    console.log("onBlastFinished");
    this.jewelLevel.makeFall();  // fall all jewels
    this.view.refreshJewels(this.jewelLevel.jewels);
};

BejeweledPresenter.prototype.onFallFinished = function () {
    console.log("onFallFinished");
    this.isAnimationWorking = false; // check all
};