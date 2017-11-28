/**
 * Created by Work on 20.11.2017.
 *
 * Простая симуляция кнопки из трех картинок
 *  - бэк
 *  - иконка
 *  - оверлей при нажатии
 *
 */

function UiButton(game, uiButtonType) {
    this.PRESSED_Y_DELTA = 4;

    this.game = game;

    this.bg = this.game.add.image(0, 0, R.img.Buttons.BG.page, R.img.Buttons.BG.name);
    this.icon = this.game.add.image(0, 0, uiButtonType.page, uiButtonType.name);
    this.overlay = this.game.add.image(0, 0, R.img.Buttons.OVERLAY.page, R.img.Buttons.OVERLAY.name);

    this.icon.alignIn(this.bg,Phaser.CENTER); // выравниваем иконку

    this.bg.addChild(this.icon); // привязываем иконку и оверлей
    this.bg.addChild(this.overlay);

    this.bg.inputEnabled = true;
    this.bg.events.onInputDown.add(this.onInputDown, this);
    this.bg.events.onInputUp.add(this.onInputUp, this);

    this.overlay.kill(); // убираем оверлей, который должен включаться при нажатии
};

UiButton.prototype.setXY = function (x, y) {
    this.bg.x = x;
    this.bg.y = y;
    this.idleY = this.bg.y;
    this.pressedY = this.bg.y + this.PRESSED_Y_DELTA;
    return this;
};

UiButton.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
};

UiButton.prototype.onInputDown = function () {
    console.log("UiButton onInputDown");
    this.overlay.revive(); // показываем нажатие
    this.bg.y = this.pressedY;
    if (this.globalCallback) {
        this.globalCallback.apply(this.globalContext);
    }
};

UiButton.prototype.onInputUp = function () {
    console.log("UiButton onInputUp");
    this.bg.y = this.idleY;
    this.overlay.kill(); // убираем эффект нажатия
};