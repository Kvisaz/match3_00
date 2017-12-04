/**
 * Created by Work on 28.11.2017.
 */

var JewelGenerator = {
    JEWEL_SIZE: 64,
    CURSOR_SIZE: 66,

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

JewelGenerator.createJewel = function (type) {
    type = Math.abs(type % this.colors.length); // защита от выхода за пределы
    var color = this.colors[type];
    return ImageBuilder.rect(0, 0, this.JEWEL_SIZE, this.JEWEL_SIZE, color);
};

JewelGenerator.getJewelTexture = function (type) {
    type = Math.abs(type % this.colors.length); // защита от выхода за пределы
    var color = this.colors[type];
    return ImageBuilder.rectTexture(this.JEWEL_SIZE, this.JEWEL_SIZE, color);
};

JewelGenerator.getCursor = function () {
    return ImageBuilder.strokeRect(0, 0,
        this.CURSOR_SIZE, this.CURSOR_SIZE,
        "#00ffff", 6);
};