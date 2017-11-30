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
    this.swap = {jewel1: undefined, jewel2: undefined};
};

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    console.log("presenter.onJewelClickDown - jewel col: " + jewel.column + " row: " + jewel.row);
    if (this.isAnimationWorking) return; // блокировка анимаций

    // есть выделение и это соседи
    if (this.selectedJewel !== undefined && this.jewelLevel.isNear(this.selectedJewel, jewel)) {
        this.view.hideCursor();
        var selectedJewel = this.selectedJewel;
        this.selectedJewel = undefined;
        this.checkSwap(selectedJewel, jewel);
    }
    else { // нет выделения или кликнули на далеко отстоящем - переносим выделение на новый
        this.selectedJewel = jewel;
        this.view.showCursor(jewel);
    }
};

BejeweledPresenter.prototype.checkSwap = function (jewel1, jewel2) {
    console.log("checkSwap");
    if (jewel1.type === jewel2.type)  return; // запрет на своп одинакового цвета - упрощает вычисление групп
    console.log("jewel1 !== jewel2");

    this.jewelLevel.swap(jewel1, jewel2);

    this.isAnimationWorking = true;
    this.swap.jewel1 = jewel1;
    this.swap.jewel2 = jewel2;
    this.view.swap(jewel1, jewel2);
};

BejeweledPresenter.prototype.onSwapFinished = function () {
    console.log("onSwapFinished");

    // 1. проверить, есть ли комбо
    var combo1 = this.jewelLevel.getSameNears(this.swap.jewel1);
    var combo2 = this.jewelLevel.getSameNears(this.swap.jewel2);

    console.log("combo1.length = " + combo1.length + " / combo2.length" + combo2.length);

    if (combo1.length < this.COMBO_AMOUNT_MIN && combo2.length < this.COMBO_AMOUNT_MIN) {
        this.undoSwap(this.swap.jewel1, this.swap.jewel2);
        return;
    }


    // 2. отыграть комбо или свопнуть обратно
    this.swap.jewel1 = undefined;
    this.swap.jewel2 = undefined;
    this.isAnimationWorking = false;

};

BejeweledPresenter.prototype.undoSwap = function (jewel1, jewel2) {
    this.isAnimationWorking = true;
    this.jewelLevel.swap(jewel1, jewel2);
    this.view.swap(jewel1, jewel2, true);
    this.swap.jewel1 = undefined;
    this.swap.jewel2 = undefined;
};

BejeweledPresenter.prototype.onUndoSwapFinished = function (jewel1, jewel2) {
    this.isAnimationWorking = false;
};