/**
 * Created by Work on 20.11.2017.
 *
 * Простая симуляция кнопки из трех картинок
 *  - бэк
 *  - иконка
 *  - оверлей при нажатии
 *
 */

function UiTextButton(game, width, height, text, color, colorPressed) {
    this.PRESSED_Y_DELTA = 4;
    this.game = game;

    this.bg = ImageBuilder.rect(0, 0, width, height, color);
    this.overlay = ImageBuilder.rect(0, 0, width, height, "#333333");
    this.overlay.alpha = 0.5;
    this.text = this.game.add.text(0, 0, text, {font: "24px Arial", fill: "#111111",  align: "center"});

    this.text.alignIn(this.bg, Phaser.CENTER); // выравниваем иконку

    this.bg.addChild(this.text); // привязываем иконку и оверлей
    this.bg.addChild(this.overlay);

    this.bg.inputEnabled = true;
    this.bg.events.onInputDown.add(this.onInputDown, this);
    this.bg.events.onInputUp.add(this.onInputUp, this);

    this.overlay.kill(); // убираем оверлей, который должен включаться при нажатии
};

UiTextButton.prototype.refreshPressedXY = function () {
    this.idleY = this.bg.y;
    this.pressedY = this.bg.y + this.PRESSED_Y_DELTA;
};

UiTextButton.prototype.alignTo = function () {
    this.bg.alignTo.apply(this.bg, arguments);
    this.refreshPressedXY();
    return this;
};

UiTextButton.prototype.alignIn = function () {
    this.bg.alignIn.apply(this.bg, arguments);
    this.refreshPressedXY();
    return this;
};

UiTextButton.prototype.setXY = function (x, y) {
    this.bg.x = x;
    this.bg.y = y;
    this.refreshPressedXY();
    return this;
};

UiTextButton.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
    return this;
};

UiTextButton.prototype.onInputDown = function () {
    this.overlay.revive(); // показываем нажатие
    this.bg.y = this.pressedY;
    if (this.globalCallback) {
        this.globalCallback.apply(this.globalContext);
    }
};

UiTextButton.prototype.onInputUp = function () {
    this.bg.y = this.idleY;
    this.overlay.kill(); // убираем эффект нажатия
};

UiTextButton.prototype.kill = function () {
    this.bg.kill();
};

UiTextButton.prototype.revive = function () {
    this.bg.revive();
};