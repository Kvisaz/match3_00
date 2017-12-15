/**
 * Created by Work on 15.12.2017.
 *
 * Простая симуляция кнопки из трех картинок
 *  - бэк
 *  - иконка
 *  - оверлей при нажатии
 *  все это задается в type, который JewelButtonType
 */

function JewelButton(game, type) {
    this.SHADOW_Y_DELTA = 4;
    this.game = game;

    // тень изанчально смещена на дельту
    this.shadow = game.add.image(0, 0, type.shadow.page, type.shadow.name);
    this.rootView = this.shadow;
    this.bg = game.add.image(0, 0, type.bg.page, type.bg.name);
    this.icon = game.add.image(0, 0, type.icon.page, type.icon.name);
    this.icon.alignIn(this.bg, Phaser.CENTER);

    this.bg.addChild(this.icon);
    this.bg.y -= this.SHADOW_Y_DELTA;
    this.rootView.addChild(this.bg);

    this.rootView.inputEnabled = true;
    this.rootView.events.onInputDown.add(this.onInputDown, this);
    this.rootView.events.onInputUp.add(this.onInputUp, this);
};

JewelButton.prototype.alignTo = function (t, e, s, n) {
    this.rootView.alignTo(t, e, s, n);
    return this;
};

JewelButton.prototype.alignIn = function (t, e, s, n) {
    this.rootView.alignIn(t, e, s, n);
    return this;
};

JewelButton.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y + this.SHADOW_Y_DELTA;
    return this;
};

JewelButton.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
    return this;
};

JewelButton.prototype.onInputDown = function () {
    this.bg.y = 0;
    if (this.globalCallback) {
        this.globalCallback.apply(this.globalContext);
    }
};

JewelButton.prototype.onInputUp = function () {
    this.bg.y = -this.SHADOW_Y_DELTA;
};

JewelButton.prototype.hide = function () {
    this.rootView.kill();
};

JewelButton.prototype.show = function () {
    this.rootView.revive();
};