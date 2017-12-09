/**
 * Created by Work on 09.12.2017.
 *
 * Компонент взрыва
 *  - установи в нужные координаты (setXY)
 *  - или на объект DisplayObject (setOnObject) (ставится по центру)
 *  - в нужный момент взорви (play)
 *  - компонент останется на том же месте - можно создавать взрыв повторно
 *
 *
 *   this.rootView - корневая картинка, можно использовать для выравнивания или добавлять в группы
 */

function Explosion(game) {
    this.FRAME_RATE = 60;
    this.ANIMATION_TAG = "blast";
    this.game = game;
    this.rootView = this.game.add.image(0, 0, R.effects.explosion.name);
    this.animation = this.rootView.animations.add(this.ANIMATION_TAG);
    this.animation.onComplete.add(function () {
        this.rootView.kill();
        console.log('animation complete');
    }, this);
    this.rootView.kill();
}

Explosion.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

Explosion.prototype.setOnObject = function (displayObject) {
    this.rootView.alignIn(displayObject, Phaser.CENTER);
    return this;
};

Explosion.prototype.play = function () {
    this.rootView.revive();
    this.rootView.animations.play(this.ANIMATION_TAG, this.FRAME_RATE);
};