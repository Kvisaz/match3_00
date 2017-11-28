/**
 * Created by Work on 16.11.2017.
 *
 * простой создатель текстур с заданным цветом, для моков или минималистичной графики
 *
 * Phaser graphics рендерит текстуру во весь видимый экран, размеры не меняются
 *
 */

var ImageBuilder = {};
ImageBuilder.createFilledRectangleTexture = function (game, width, height, color) {
    var bitmapData = game.add.bitmapData(width, height);
    bitmapData.ctx.fillStyle = color; // цвет в формате "#ffffff"
    bitmapData.ctx.fillRect(0,0,width,height);
    return bitmapData;
};

ImageBuilder.createStrokedRectangleTexture = function (game, width, height, color, borderWidth) {
    var bitmapData = game.add.bitmapData(width, height);
    bitmapData.ctx.strokeStyle = color; // цвет в формате "#ffffff"
    bitmapData.ctx.lineWidth  = borderWidth;
    bitmapData.ctx.strokeRect(0,0,width,height);
    return bitmapData;
};

// cachename - если задан, добавляет текстуру в кэш, потом позволяет быстро брать эту текстуру
// используй один cachename для кучи однотипных объектов(одинаковых полосок здоровья у монстров, к примеру)
ImageBuilder.createRectangleImage = function (game, x, y, width, height, color, cachename) {
    var bitmapData;
    // если есть имя и текстура есть в кэше - берем из кэша
    if(cachename!==undefined && game.cache.checkBitmapDataKey(cachename)){
        bitmapData = game.cache.getBitmapData(cachename);
    }
    else { // по любасу создаем заново
        bitmapData = this.createFilledRectangleTexture(game, width, height, color);
        if(cachename!==undefined) {
            game.cache.addBitmapData(cachename, bitmapData);
        }
    }
    return game.add.image(x, y, bitmapData);
};

ImageBuilder.createStrokedRectangleImage = function (game, x, y, width, height, color, cachename, strokeWidth) {
    var bitmapData;
    // если есть имя и текстура есть в кэше - берем из кэша
    if(cachename!==undefined && game.cache.checkBitmapDataKey(cachename)){
        bitmapData = game.cache.getBitmapData(cachename);
    }
    else { // по любасу создаем заново
        bitmapData = this.createStrokedRectangleTexture(game, width, height, color, strokeWidth);
        if(cachename!==undefined) {
            game.cache.addBitmapData(cachename, bitmapData);
        }
    }
    return game.add.image(x, y, bitmapData);
};