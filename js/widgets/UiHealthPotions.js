/**
 * Created by Work on 25.11.2017.
 *
 * Индикатор пузырьков здоровья
 * - есть сеттер для изменения их числа
 * - есть коллбэк по нажатию
 * todo Показывать при нажатии сколько здоровья пополняет
 */

function UiHealthPotion(game) {
    this.data = {
        amount: 0
    };

    this.view = {
        image: game.add.image(0, 0, R.img.Ui.POTION_HEALTH.page, R.img.Ui.POTION_HEALTH.name),
        text: game.add.text(31, -2, this.data.amount, R.style.uiIconLabel)
    };

    this.viewData = {
        idleY: 0,
        deltaY: 4,
        pressedY: 4
    };

    this.view.image.addChild(this.view.text);
    this.view.image.inputEnabled = true;
    this.view.image.events.onInputDown.add(this.onInputDown, this);
    this.view.image.events.onInputUp.add(this.onInputUp, this);
}

UiHealthPotion.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
    return this;
};

UiHealthPotion.prototype.setXY = function (x, y) {
    this.view.image.x = x;
    this.view.image.y = y;
    this.viewData.idleY = y;
    this.viewData.pressedY = y + this.viewData.deltaY;
    return this;
};

UiHealthPotion.prototype.setAmount = function (healthPotionAmount) {
    this.data.amount = healthPotionAmount;
    this.view.text.setText(this.data.amount);
    return this;
};

UiHealthPotion.prototype.onInputDown = function () {
    this.view.image.y = this.viewData.pressedY;
    if (this.globalCallback) {
        this.globalCallback.call(this.globalContext);
    }
};

UiHealthPotion.prototype.onInputUp = function () {
    this.view.image.y = this.viewData.idleY;
};