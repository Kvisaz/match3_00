/**
 * Created by Work on 16.11.2017.
 *
 * простой создатель текстур с заданным цветом, для моков или минималистичной графики
 *
 * Phaser graphics рендерит текстуру во весь видимый экран, размеры не меняются
 *
 */

var ImageBuilder = {};
ImageBuilder.createTexture = function (game, width, height, color) {
    var bitmapData = game.add.bitmapData(width, height);
    bitmapData.ctx.fillStyle = color; // цвет в формате "#ffffff"
    bitmapData.ctx.fillRect(0, 0, width, height);
    return bitmapData;
};

// кэширует текстуры с теми же названиями и цветом
ImageBuilder.createFilledRectangle = function (game, x, y, width, height, color) {
    var bitmapData;

    var generatedCacheName = "imgBuilder_" + width + "_" + height + "_" + color;

    // если есть имя и текстура есть в кэше - берем из кэша
    if (game.cache.checkBitmapDataKey(generatedCacheName)) {
        bitmapData = game.cache.getBitmapData(generatedCacheName);
    }
    else { // по любасу создаем заново
        bitmapData = this.createTexture(game, width, height, color);
        game.cache.addBitmapData(generatedCacheName, bitmapData);

    }
    return game.add.image(x, y, bitmapData);
};