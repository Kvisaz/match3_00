/**
 * Created by Work on 16.11.2017.
 *
 * простой создатель текстур с заданным цветом, для моков или минималистичной графики
 *
 * Phaser graphics рендерит текстуру во весь видимый экран, размеры не меняются
 *
 */

var ImageBuilder = { init: function (game) { this.game = game; }};

ImageBuilder.cachedTexture = function (textureName) {
    if (this.game.cache.checkBitmapDataKey(textureName)) {
        return this.game.cache.getBitmapData(textureName);
    }
    return undefined; // не найдено
};

ImageBuilder.rectTexture = function (width, height, color) {
    var generatedCacheName = "imgBuilder_rectTxtr" + width + "_" + height + "_" + color;
    var bitmapData = this.cachedTexture(generatedCacheName);
    if(bitmapData===undefined){
        bitmapData = this.game.add.bitmapData(width, height);
        bitmapData.ctx.fillStyle = color; // цвет в формате "#ffffff"
        bitmapData.ctx.fillRect(0, 0, width, height);
    }
    return bitmapData;
};

ImageBuilder.strokeRectTexture = function (width, height, color, strokeWidth) {
    var generatedCacheName = "imgBuilder_strokedRectTxtr" + width + "_" + height + "_" + color + "_" + strokeWidth;
    var bitmapData = this.cachedTexture(generatedCacheName);
    if(bitmapData===undefined){
        bitmapData = this.game.add.bitmapData(width, height);
        bitmapData.ctx.strokeStyle = color; // цвет в формате "#ffffff"
        bitmapData.ctx.lineWidth = strokeWidth;
        bitmapData.ctx.strokeRect(0, 0, width, height);
    }
    return bitmapData;
};

// создать залитый цветом прямоугольник
ImageBuilder.rect = function (x, y, width, height, color) {
    return this.game.add.image(x, y, this.rectTexture(width, height, color));
};


ImageBuilder.strokeRect = function (x, y, width, height, color, strokeWidth) {
    return this.game.add.image(x, y, this.strokeRectTexture(width, height, color, strokeWidth));
};