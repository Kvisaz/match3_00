/**
 * Created by Work on 28.11.2017.
 *
 * Эффект сползающих вниз пикселей, как в Doom первых
 */

function MonsterDeathEffect(game, width, height) {
    this.DURATION = 250;
    this.BAR_WIDTH = 8;
    this.BAR_AMOUNT = Math.ceil(width / this.BAR_WIDTH);

    this.bitmapData = game.add.bitmapData(width, height, "monsterDeathBitmapData");
    this.maskBitmapData = game.add.bitmapData(width, height, "maskBitmapData");

    this.bitmapData.alphaMask()

    this.image = this.bitmapData.addToWorld();
    this.image.kill();
}

MonsterDeathEffect.prototype.setXY = function (x, y) {
    this.image.x = x;
    this.image.y = y;
    return this;
};

MonsterDeathEffect.prototype.start = function (image) {


    this.maskBitmapData.ctx.fillStyle = "#000000"; // цвет в формате "#ffffff"
    this.maskBitmapData.ctx.fillRect(0,0,100,100);



    this.bitmapData.ctx.fillStyle = "#ff0000"; // цвет в формате "#ffffff"
    this.bitmapData.ctx.fillRect(0,0,this.bitmapData.width,this.bitmapData.height);

    this.bitmapData.alphaMask(this.maskBitmapData, image);
    this.image.revive();
};