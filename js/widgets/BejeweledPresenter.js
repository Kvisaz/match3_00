/**
 * Created by Work on 30.11.2017.
 */
function BejeweledPresenter(view, cols, rows) {
    this.COMBO_AMOUNT_MIN = 3;
    this.view = view;

    this.jewelLevel = new JewelLevel(cols, rows)
        .fill(JewelType.getRandomCommon, JewelType) // заполняем модель всеми доступными общими типами

    // генерируем без начальных комбинаций
    // todo НУЖНА ПРОВЕРКА НА РЕШАЕМОСТЬ УРОВНЯ
    this.combos = [];
    this.countAllCombos(); // массив массивов комбинаций
    console.log("combos find = " + this.combos.length);

    while (this.combos.length > 0) {
        this.jewelLevel.fill(JewelType.getRandomCommon, JewelType); // генерим уровень, пока комбо не исчезнет
        this.countAllCombos();
        console.log("combos find = " + this.combos.length);
    }
    this.jewelLevel.forEach(view.addJewelView.bind(view)); // добавляем соответствующий камень на поле
    this.selectedJewel = undefined;
}

BejeweledPresenter.prototype.countAllCombos = function () {
    this.combos = this.jewelLevel.countGroups(this.COMBO_AMOUNT_MIN);
};

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    if (jewel == this.selectedJewel) {  // снимаем выделение по щелчку на том же камне
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
    if (!this.hasSelection()) return; // не выделили при нажатии - выходим
    var jewel = this.jewelLevel.selectNearByDirection(this.selectedJewel, swipeDirection);
    if (jewel === undefined) return;
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

BejeweledPresenter.prototype.swap = function (jewel1, jewel2) {
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    this.countAllCombos(); // считаем комбы

    if (this.combos.length == 0) {  // ничего нет, отменяем своп
        this.jewelLevel.swap(jewel1, jewel2); // меняем логику
        this.view.swapUnSwap(jewel1, jewel2); // после анимации проверяем комбо
        this.view.unlockUi();
    }
    else {
        this.view.swap(jewel1, jewel2); // свопаем
        // заказываем взрыв после свопа
        this.callWithDelay(this.blastCombos, this, this.view.SWAP_ANIMATION_DURATION);
    }
};

BejeweledPresenter.prototype.undoSwap = function (jewel1, jewel2) {
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    this.view.swap(jewel1, jewel2); // без коллбэка, просто разблокируем интерфейс
};

BejeweledPresenter.prototype.checkCombos = function () {
    this.countAllCombos();
    if (this.combos.length > 0) {
        this.blastCombos();
    }
    else { // комбо больше нет, выходим из анимаций
        this.view.unlockUi(); // разблочить UI, типа все готово
    }
};

BejeweledPresenter.prototype.blastCombos = function () {
    var i, j, comboLength, combosAmount = this.combos.length;
    for (i = 0; i < combosAmount; i++) {
        comboLength = this.combos[i].length;
        for (j = 0; j < comboLength; j++) {
            this.combos[i][j].type = JewelType.NONE; // очищаем комбы
            this.view.requestBlastAnimation(this.combos[i][j]);  // и сразу заказываем анимацию
        }
    }
    //  запускаем пробное падение с задержкой на анимацию взрыва
    this.callWithDelay(this.tryNextFall, this, this.view.BLAST_ANIMATION_DURATION);
};

// осыпаем на 1 клетку
BejeweledPresenter.prototype.tryNextFall = function () {
    this.view.lockUi();
    var hasVoid, row, col, colMax = this.jewelLevel.cols - 1, rows = this.jewelLevel.rows;
    var hasAnimationDelay = false;
    // перебираем колонки, если находим пустые - сдвигаем следующие за ним на 1 ряд
    for (col = 0; col <= colMax; col++) {
        hasVoid = false; // пока пустые не обнаружены
        for (row = rows - 1; row >= 0; row--) {
            if (this.jewelLevel.jewels[col][row].type === JewelType.NONE) {
                hasVoid = true; // обнаружили пустой
                if (row == 0) { // если в первом ряду - генерируем и заказываем анимацию
                    hasAnimationDelay = true;
                    this.jewelLevel.jewels[col][row].type = JewelType.getRandomCommon();
                    this.view.regenerateJewelView(this.jewelLevel.jewels[col][row]); // обновляем вью для созданного камня (анимация)
                }
                continue; // листаем дальше
            }
            if (hasVoid) {
                this.jewelLevel.swap(this.jewelLevel.jewels[col][row], this.jewelLevel.jewels[col][row + 1]);
                // обновляем вью для упавшего камня (анимация)
                hasAnimationDelay = true;
                this.view.makeFallingJewelView(this.jewelLevel.jewels[col][row + 1]);
            }
        }
    }

    if (hasAnimationDelay) {  // и если были падения - повторить этот шаг с задержкой
        this.callWithDelay(this.tryNextFall, this, this.view.GRID_STEP_FALL_DURATION);
    }
    else { // все упало, проверяем с задержкой на комбо
        this.callWithDelay(this.checkCombos, this, this.view.GRID_STEP_FALL_DURATION);
    }
};

BejeweledPresenter.prototype.callWithDelay = function (callback, context, delay, arg1, arg2, arg3) {
    this.view.game.time.events.add(delay, callback, context, arg1, arg2, arg3);
};