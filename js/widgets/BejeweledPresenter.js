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
    var blasted = this.getBlastedJewels(jewel1, jewel2); // смотрим, сколько взорвалось
    if (blasted.length > 0) { // взрывы есть
        this.jewelLevel.makeFall();  // в модели выполняем падение пустых элементов, то есть сортировку
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
};

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
};

BejeweledPresenter.prototype.onBlastFinished = function () {
    console.log("onBlastFinished");
    this.jewelLevel.makeFall();  // fall all jewels
    this.view.refreshJewels(this.jewelLevel.jewels);
};

BejeweledPresenter.prototype.onFallFinished = function () {
    console.log("onFallFinished");
};