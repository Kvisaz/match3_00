/**
 * Created by Work on 30.11.2017.
 */
function BejeweledPresenter(view, cols, rows) {
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

};

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    console.log("presenter.onJewelClickDown - jewel col: " + jewel.column + " row: " + jewel.row);

    // снимаем выделение по щелчку на том же камне
    if(jewel == this.selectedJewel) {
        this.unselect();
        return;
    }

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

// передаем сюда модель
BejeweledPresenter.prototype.onSwipe = function (swipeDirection) {
    console.log("presenter.onSwipe");
    if (!this.hasSelection()) return; // не выделили при нажатии - выходим
    var jewel = this.jewelLevel.selectNearByDirection(this.selectedJewel, swipeDirection);
    if(jewel === undefined) return;
    console.log("presenter.onSwipe - jewel col: " + jewel.column + " row: " + jewel.row);
    this.onJewelClickDown(jewel); // да, будут лишние там проверки, зато меньше тут писать
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
    return jewel1.type !== jewel2.type; // запрет на своп одинакового цвета - упрощает вычисление групп
};

BejeweledPresenter.prototype.swap = function (jewel1, jewel2, undo) {
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    if (this.checkBlastedJewels(jewel1, jewel2)) { // взрывы есть
        this.jewelLevel.makeFall();  // в модели выполняем падение пустых элементов, то есть сортировку
        // затем показываем сложную анимацию
        //      1. своп двух камней jewel1, jewel2
        //      2. взрывы для blasted
        //      3. падение для всех
        this.view.animateSwapBlast(jewel1, jewel2);
    }
    else { // обратный своп
        this.jewelLevel.swap(jewel1, jewel2); // возвращаем логику обратно
        this.view.animateSwapUnswap(jewel1, jewel2); // показываем cанимацию
    }
};

BejeweledPresenter.prototype.checkBlastedJewels = function (jewel1, jewel2) {
    // проверяем, есть ли комбо
    var hasCombo1 = this.markBlasted(jewel1);
    var hasCombo2 = this.markBlasted(jewel2);
    return hasCombo1 || hasCombo2;
};

// пометить взорванными всех соседей того же цвета, если комбо выполняется
BejeweledPresenter.prototype.markBlasted = function (jewel) {
    var hasCombo = false;
    var combo = this.jewelLevel.getSameNears(jewel);
    var i, length = combo.length;
    if(length >= this.COMBO_AMOUNT_MIN){
        hasCombo = true;
        for(i=0;i<length;i++){
            combo[i].type = JewelType.NONE;
        }
    }
    return hasCombo;
};

BejeweledPresenter.prototype.onFallFinished = function () {
    console.log("onFallFinished");
};