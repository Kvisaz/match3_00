/**
 *  Simple fps label
 *  use
 *    new Fps(this.game, 0,0);
 */

var MyPhaser = MyPhaser || {};

MyPhaser.Fps = function (game, x, y, textSize, textColor) {
    x = x || 0; // защита от undefined
    y = y || 0;
    textSize = textSize || 25;
    textColor = textColor || "#999999";
    Phaser.Group.call(this, game); // создаем наш fps как группу
    this.game.time.advancedTiming = true; // запускаем отсчет fps
    this.label = this.game.add.text(x, y, "", {
        font: textSize + "px Arial",
        fill: textColor,
        align: "center"
    });
    this.add(this.label);
    this.game.add.group(this);
};

MyPhaser.Fps.constructor = MyPhaser.Fps;
MyPhaser.Fps.prototype = Object.create(Phaser.Group.prototype);
MyPhaser.Fps.prototype.update = function () {
    this.label.setText(this.game.time.fps + " fps");
};
