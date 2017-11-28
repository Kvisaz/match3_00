/**
 * Created by Work on 17.11.2017.
 *
 *  Всплывающий лут в кликере
 *  - картинка + текст
 *  - все точные параметры определяются на моменте использования
 *  - перед использованием создать кучу и запихнуть в Pool
 */

function FloatingLootElement(game) {
    this.DISTANCE = 100;
    this.DURATION = 250;
    this.target = {alpha:0, x: 0, y: 0}; // куда летим

    this.text = game.add.text(0, 0, "", R.style.floating);
    this.image = game.add.image(0, -20, PotionImageNames.getPage(0), PotionImageNames.getName(0));
    this.text.addChild(this.image);

    this.tween = game.add.tween(this.text);
    // Каждый вызов to - добавляет цепочку в цепочку анимаций к текущему tween
    // поэтому TO программируется здесь, и используется target объект
    // параметры которого меняются при конкретном вызове анимации
    this.tween.to(
        this.target,
        this.DURATION,
        Phaser.Easing.Quadratic.In
    );

    this.hide();
    this.globalCallback = undefined;
    this.globalCallbackContext = undefined;

    this.tween.onComplete.add(function () {
        if (this.globalCallback) {
            this.globalCallback.apply(this.globalCallbackContext);
        }
        this.hide();
    }, this);
}

FloatingLootElement.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalCallbackContext = context;
};

FloatingLootElement.prototype.set = function (type, value) {
    this.text.setText(value > 0 ? "+" + value : " ");
    this.image.frameName = PotionImageNames.getName(type);
};

FloatingLootElement.prototype.float = function (x, y) {
    this.show();
    this.text.alpha = 1;
    this.text.x = x;
    this.text.y = y;
    this.image.x = this.text.width - 10;
    this.target.x = this.text.x;
    this.target.y = this.text.y - this.DISTANCE;
    this.tween.start();
};

FloatingLootElement.prototype.hide = function () {
    this.text.kill();
};

FloatingLootElement.prototype.show = function () {
    this.text.revive();
};