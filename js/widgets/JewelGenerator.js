/**
 * Created by Work on 28.11.2017.
 */

var JewelGenerator = {
    JEWEL_SIZE: 64,

    colors: [
        "#00FF00",
        "#808080",
        "#00FFFF",
        "#0000CD",

        "#DC143C",
        "#FF00FF",
        "#FFA500",
        "#FFFF00",
    ]
};

JewelGenerator.createJewel = function (game, type) {
    type = Math.abs(type % this.colors.length); // защита от выхода за пределы
    var color = this.colors[type];
    var cacheName = "jewelTexture_" + type;
    return ImageBuilder.createRectangleImage(game, 0, 0, this.JEWEL_SIZE, this.JEWEL_SIZE, color, cacheName);
};