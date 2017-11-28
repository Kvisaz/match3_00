/**
 * Created by Work on 25.11.2017.
 *
 * Индикатор пузырьков здоровья
 * - есть сеттер для изменения их числа
 * - есть коллбэк по нажатию
 */

function UiCoin(game) {
    this.data = {
        amount: 0
    };

    this.view = {
        image: game.add.image(0, 0, R.img.Ui.COIN.page, R.img.Ui.COIN.name),
        text: game.add.text(-4, -2, this.data.amount, R.style.uiIconLabel)
    };

    this.viewData = {
        idleY: 0,
        deltaY: 4,
        pressedY: 4
    };

    this.view.text.anchor.setTo(1, 0.5);
    this.view.text.alignTo(this.view.image, Phaser.LEFT_CENTER, 4, 2);

    this.view.image.addChild(this.view.text);
    this.view.image.inputEnabled = true;
    this.view.image.events.onInputDown.add(this.onInputDown, this);
    this.view.image.events.onInputUp.add(this.onInputUp, this);
}

UiCoin.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
    return this;
};

UiCoin.prototype.setXY = function (x, y) {
    this.view.image.x = x;
    this.view.image.y = y;
    this.viewData.idleY = y;
    this.viewData.pressedY = y + this.viewData.deltaY;
    return this;
};

UiCoin.prototype.setAmount = function (coinAmount) {
    this.data.amount = coinAmount;
    this.view.text.setText(this.data.amount);
    return this;
};

UiCoin.prototype.onInputDown = function () {
    this.view.image.y = this.viewData.pressedY;
    if (this.globalCallback) {
        this.globalCallback.call(this.globalContext);
    }
};

UiCoin.prototype.onInputUp = function () {
    this.view.image.y = this.viewData.idleY;
};