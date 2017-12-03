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
    this.swapPair = {jewel1: undefined, jewel2: undefined};

};

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    console.log("presenter.onJewelClickDown - jewel col: " + jewel.column + " row: " + jewel.row);
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
    // запрет на своп одинакового цвета - упрощает вычисление групп
    return jewel1.type !== jewel2.type;
};

BejeweledPresenter.prototype.swap = function (jewel1, jewel2, undo) {
    // this.isAnimationWorking = true;
    // меняем местами два разных цвета в модели
    this.jewelLevel.swap(jewel1, jewel2);
    // смотрим, сколько взорвалось
    var blasted = this.getBlastedJewels(jewel1, jewel2);
    if (blasted.length > 0) { // взрывы
        this.jewelLevel.makeFall();  // в модели выполняем падение пустых элементов
        // затем показываем сложную анимацию
        //      1. своп двух камней jewel1, jewel2
        //      2. взрывы для blasted
        //      3. падение для всех
        this.view.animateSwapBlast(jewel1, jewel2, blasted);
    }
    else { // обратный своп
        this.jewelLevel.swap(jewel1, jewel2); // возвращаем логику обратно
        this.view.animateSwapUnswap(jewel1, jewel2); // показываем cанимацию
    }
    /*

     var callback = undo ? this.onUndoSwapFinished : this.onSwapFinished;
     this.view.swap(jewel1, jewel2, callback, this);
     if (undo) this.isAnimationWorking = false;*/
};

/*BejeweledPresenter.prototype.selectNearByDirection = function (jewel, direction) {
    var nearJewel;
    switch (direction) {
        case SwipeDirections.LEFT:
            if (this.data.jewels[jewel.jewelCol - 1] === undefined) return undefined;
            return this.data.jewels[jewel.jewelCol - 1][jewel.jewelRow];
        case SwipeDirections.UP:
            return this.data.jewels[jewel.jewelCol][jewel.jewelRow - 1];
        case SwipeDirections.RIGHT:
            if (this.data.jewels[jewel.jewelCol + 1] === undefined) return undefined;
            return this.data.jewels[jewel.jewelCol + 1][jewel.jewelRow];
        case SwipeDirections.DOWN:
            return this.data.jewels[jewel.jewelCol][jewel.jewelRow + 1];
    }
};*/

/*BejeweledPresenter.prototype.onUndoSwapFinished = function (jewel1, jewel2) {
 this.isAnimationWorking = false;
 };*/

/*BejeweledPresenter.prototype.onSwapFinished = function () {

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
 };*/


BejeweledPresenter.prototype.getBlastedJewels = function (jewel1, jewel2) {
    var jewelArray = [];
    // проверяем, есть ли комбо
    var combo1 = this.jewelLevel.getSameNears(jewel1);
    var combo2 = this.jewelLevel.getSameNears(jewel2);
    var hasCombo = combo1.length >= this.COMBO_AMOUNT_MIN || combo2.length >= this.COMBO_AMOUNT_MIN;

    if (hasCombo === false) return jewelArray; // комбо нет, пустой массив


    if (combo1.length >= this.COMBO_AMOUNT_MIN) jewelArray = jewelArray.concat(jewelArray, combo1);
    if (combo2.length >= this.COMBO_AMOUNT_MIN) jewelArray = jewelArray.concat(jewelArray, combo2);
    jewelArray.forEach(function (jewel) {
        jewel.type = JewelType.NONE;
    });

    return jewelArray; // комбо есть возвращаем массив "взорванных"
    // this.view.blast(jewelArray);
};

BejeweledPresenter.prototype.onBlastFinished = function () {
    console.log("onBlastFinished");
    this.jewelLevel.makeFall();  // fall all jewels
    this.view.refreshJewels(this.jewelLevel.jewels);
};

BejeweledPresenter.prototype.onFallFinished = function () {
    console.log("onFallFinished");
    console.log("this.levels  = " + this.jewelLevel);
};