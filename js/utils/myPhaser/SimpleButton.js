/**
 *  Simple Button
 *  мне нужна простая симуляция кнопки, а не хореографический ансамбль
 *
 *   текстура дефолтная
 *   текстура нажатия
 *   обработчик нажатия
 *
 */

function SimpleButton(game, idleTexture, pressedTexture) {
    this.game = game;
    this.textures = {};
    this.textures.idle = idleTexture;
    this.textures.pressed = pressedTexture;
    this.globalCallback = undefined;
    this.globalContext = undefined;

    this.image = this.game.add.image(0, 0, this.textures.idle);
    this.image.inputEnabled = true;
    this.image.events.onInputDown.add(this.onInputDown, this);
    this.image.events.onInputUp.add(this.onInputUp, this);
};

SimpleButton.prototype.onInputDown = function () {
    console.log("SimpleButton onInputDown");
    this.image.setTexture(this.textures.pressed);
    if (this.globalCallback) {
        this.globalCallback.apply(this.globalContext);
    }
};

SimpleButton.prototype.onInputUp = function () {
    console.log("SimpleButton onInputUp");
    this.image.setTexture(this.textures.idle);
};

SimpleButton.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
};

SimpleButton.prototype.setXY = function (x, y) {
    this.image.x = x;
    this.image.y = y;
};