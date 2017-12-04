/**
 * Created by Work on 30.11.2017.
 */
function BejeweledPresenter(view, cols, rows) {
    this.COMBO_AMOUNT_MIN = 3;
    this.view = view;

    this.jewelLevel = new JewelLevel(cols, rows)
        .fill(JewelType.getCommonTypeArray()) // заполняем модель всеми доступными общими типами
        .forEach(view.addJewelView.bind(view)); // добавляем соответствующий камень на поле

    this.selectedJewel = undefined;
}

// передаем сюда модель
BejeweledPresenter.prototype.onJewelClickDown = function (jewel) {
    console.log("presenter.onJewelClickDown - jewel col: " + jewel.column + " row: " + jewel.row);
    console.log("presenter.onJewelClickDown - jewel type: " + jewel.type);

    // снимаем выделение по щелчку на том же камне
    if (jewel == this.selectedJewel) {
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
    if (jewel === undefined) return;
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

BejeweledPresenter.prototype.swap = function (jewel1, jewel2) {
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    this.view.swap(jewel1, jewel2, this.checkCombo, this);
};

BejeweledPresenter.prototype.checkCombo = function (jewel1, jewel2) {
    if (this.checkBlastedJewels(jewel1, jewel2)) this.blast();
    else this.undoSwap(jewel1, jewel2);
};

BejeweledPresenter.prototype.blast = function () {
    this.view.blast(this.onBlastFinished, this);
};

BejeweledPresenter.prototype.onBlastFinished = function () {
    console.log("onBlastFinished");
    this.tryNextFall(); // пробуем сдвинуть на 1 шаг
};

// осыпаем на 1 шаг, если осыпание произошло - возврашает true, иначе false
BejeweledPresenter.prototype.tryNextFall = function () {
    console.log("stepFall");
    var isLast = false, tmp, hasVoid, row, col, colMax = this.jewelLevel.cols - 1, rows = this.jewelLevel.rows;
    // перебираем колонки, если находим пустые - сдвигаем следующие за ним на 1 ряд
    for (col = 0; col <= colMax; col++) {
        hasVoid = false; // пока пустые не обнаружены
        for (row = rows - 1; row >= 0; row--) {
            if (this.jewelLevel.jewels[col][row].type === JewelType.NONE) {
                hasVoid = true; // обнаружили пустой
                continue; // листаем дальше
            }
            if (hasVoid) {
                // меняем местами камень с нижним
                tmp = this.jewelLevel.jewels[col][row];
                this.jewelLevel.jewels[col][row] = this.jewelLevel.jewels[col][row + 1];
                this.jewelLevel.jewels[col][row + 1] = tmp;
                // и освежаем внутренние данные о колонках
                this.jewelLevel.jewels[col][row].row = row;
                this.jewelLevel.jewels[col][row + 1].row = row + 1;
            }
        }
    }
    this.view.tryNextFall(); // пробуем сдвинуть на 1 шаг вьюхи
};

// проходим верхний ряд и засовываем новые камушки
BejeweledPresenter.prototype.tryGenerate = function () {
    var generated = [];
    this.jewelLevel.jewels.forEach(function (column) {
        if(column[0].type === JewelType.NONE){
            column[0].type = JewelType.getRandomCommon();
            generated.push(column[0]);
        }
    });
    this.view.tryGenerate(generated); // генерируем
};

BejeweledPresenter.prototype.undoSwap = function (jewel1, jewel2) {
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    this.view.swap(jewel1, jewel2); // без коллбэка, просто разблокируем интерфейс
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
    if (length >= this.COMBO_AMOUNT_MIN) {
        hasCombo = true;
        for (i = 0; i < length; i++) {
            combo[i].type = JewelType.NONE;
        }
    }
    return hasCombo;
};

BejeweledPresenter.prototype.onFallFinished = function () {
    console.log("onFallFinished");
};