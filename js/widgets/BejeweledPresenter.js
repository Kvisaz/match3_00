/**
 * Created by Work on 30.11.2017.
 */
function BejeweledPresenter(view, cols, rows) {
    this.COMBO_AMOUNT_MIN = 3;
    this.view = view;
    this.selectedJewel = undefined;

    this.jewelLevel = new JewelLevel(cols, rows); // наша модель уровня
    this.jewelLevel.forEach(this.view.addJewelView, this.view); // создаем картинки во вью
    this.solutions = []; // массив решений в формате {hint: jewel2, target: jewel1, length: comboLength}
    this.combos = []; // массив массивов комбинаций

    this.generateLevel();
}

// генерируем уровень чистый, т.е. без начальных комбинаций, но с решениями
BejeweledPresenter.prototype.generateLevel = function () {
    this.jewelLevel.fill(JewelType.getRandomCommon, JewelType); // заполняем модель всеми доступными общими типами
    this.countAllCombos(); // считаем все комбы

    do { // генерим рандомный уровень
        this.jewelLevel.fill(JewelType.getRandomCommon, JewelType); // генерим уровень, пока комбо не исчезнет
        this.countAllCombos(); // считаем комбо
        if (this.combos.length == 0) { // если комбо очистили - проверяем, есть ли решения
            this.solutions = this.jewelLevel.getSolutions(this.COMBO_AMOUNT_MIN);
        }
        // если есть комбо или решений ноль - повторяем
    } while (this.combos.length > 0 || this.solutions.length == 0);

    // обновить уровень
    this.jewelLevel.forEach(this.view.setJewelViewType.bind(this.view)); // обновляем вид камней на поле
};

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
    this.view.callbacks.select(jewel);
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
    this.view.lockUi(); // BLOCK UI START
    this.jewelLevel.swap(jewel1, jewel2); // меняем местами два разных цвета в модели
    this.countAllCombos(); // считаем комбы

    this.view.callbacks.swap(jewel1, jewel2, this.combos.length > 0);

    if (this.combos.length == 0) {  // ничего нет, отменяем своп
        this.jewelLevel.swap(jewel1, jewel2); // меняем логику
        this.view.makeSwapAnimation(jewel1, jewel2, true); // заказываем анимацию свопа с отменой
        this.callWithDelay(function () {
            this.view.unlockUi(); // BLOCK UI FINISH только после завершения анимации
        }, this, this.view.SWAP_ANIMATION_DURATION * 2);
    }
    else {
        this.view.makeSwapAnimation(jewel1, jewel2); // заказываем анимацию свопа без отмены
        // заказываем взрыв после свопа
        this.callWithDelay(this.blastCombos, this, this.view.SWAP_ANIMATION_DURATION);
    }
};

BejeweledPresenter.prototype.checkCombos = function () {
    this.countAllCombos();
    if (this.combos.length > 0) {
        this.blastCombos();
    }
    else { // комбо больше нет, выходим из анимаций
        this.view.unlockUi(); // BLOCK UI FINISH  разблочить UI, типа все готово

        // проверка решаемости уровня
        this.solutions = this.jewelLevel.getSolutions(this.COMBO_AMOUNT_MIN);
        if (this.solutions.length == 0) { // решений нет, сообщаем, что все накрылось
            this.view.callbacks.noMoves(); // коллбэк для глобальной логики, что нет ходов
        }
    }
};

BejeweledPresenter.prototype.showHint = function (maximizeCombo) {
    this.solutions = this.jewelLevel.getSolutions(this.COMBO_AMOUNT_MIN);
    if (this.solutions.length > 0) {
        if (maximizeCombo) {
            this.solutions.sort(function (sol1, sol2) { // сортируем по мощности
                return sol2.length - sol1.length;
            });
        }
        this.view.makeHintAnimation(this.solutions[0].hint, this.solutions[0].target);
        this.view.callbacks.hintShown(this.solutions[0]);
    }
};

BejeweledPresenter.prototype.blastCombos = function () {
    var i, j, comboLength, combosAmount = this.combos.length;
    this.view.callbacks.blastStart(this.combos); // сообщаем, что взрыв
    for (i = 0; i < combosAmount; i++) {
        comboLength = this.combos[i].length;
        for (j = 0; j < comboLength; j++) {
            this.combos[i][j].type = JewelType.NONE; // очищаем комбы
            this.view.makeBlastAnimation(this.combos[i][j]);  // и сразу заказываем анимацию
        }
    }
    //  запускаем пробное падение с задержкой на анимацию взрыва
    this.callWithDelay(function () {
        this.view.callbacks.totalBlastFinish();
        this.tryNextFall();
    }, this, this.view.BLAST_ANIMATION_DURATION);
};

// осыпаем на 1 клетку
BejeweledPresenter.prototype.tryNextFall = function () {
    var jewel, jewel2, hasVoid, row, col, colMax = this.jewelLevel.cols - 1, rows = this.jewelLevel.rows;
    var hasAnimationDelay = false;
    // перебираем колонки, если находим пустые - сдвигаем следующие за ним на 1 ряд
    for (col = 0; col <= colMax; col++) {
        hasVoid = false; // пока пустые не обнаружены
        for (row = rows - 1; row >= 0; row--) {
            jewel = this.jewelLevel.jewels[col][row];

            if (jewel.type === JewelType.NONE) {
                hasVoid = true; // обнаружили пустой
                if (row == 0) { // ГЕНЕРАЦИЯ  если в первом ряду - генерируем и заказываем анимацию
                    hasAnimationDelay = true;
                    jewel.type = JewelType.getRandomCommon();
                    this.view.regenerateJewelView(jewel); // обновляем вью для созданного камня (анимация)
                    this.view.callbacks.singleBornStart(jewel); // коллбэк для глобальной логики
                    this.callWithDelay(function () {
                        this.view.callbacks.singleFallFinish(jewel); // коллбэк для глобальной логики
                    }, this, this.view.GRID_STEP_FALL_DURATION);
                }
                continue; // листаем дальше
            }
            if (hasVoid) { // ПАДЕНИЕ
                jewel2 = this.jewelLevel.jewels[col][row + 1];
                this.jewelLevel.swap(jewel, jewel2);
                // обновляем вью для упавшего камня (анимация)
                hasAnimationDelay = true;
                this.view.makeFallingJewelView(jewel);
                this.view.callbacks.singleFallStart(jewel); // коллбэк для глобальной логики
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