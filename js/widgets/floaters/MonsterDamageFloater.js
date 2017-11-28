/**
 * Created by Work on 27.11.2017.
 *
 * всплывающие данные о дамаге по монстру (и тебе)
 *
 */

function MonsterDamageFloater(game) {
    this.DISTANCE = 100;
    this.DURATION = 350;
    this.target = {alpha:0, x: 0, y: 0}; // куда летим

    this.text = game.add.text(0, 0, "", R.style.monsterDamageFloater);

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


MonsterDamageFloater.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalCallbackContext = context;
};

MonsterDamageFloater.prototype.float = function (x, y, text) {
    this.show();

    this.text.setText(text);
    this.text.x = x;
    this.text.y = y;

    this.target.x = this.text.x;
    this.target.y = this.text.y - this.DISTANCE;
    this.tween.start();
};

MonsterDamageFloater.prototype.hide = function () {
    this.text.kill();
};

MonsterDamageFloater.prototype.show = function () {
    this.text.revive();
    this.text.alpha = 1;
};