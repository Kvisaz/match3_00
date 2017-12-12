/**
 * Created by Work on 28.11.2017.
 */

var CristmasJewelGenerator = {
    CURSOR_SIZE: 68,
    imagePage: R.images.jewels.snow.page,

    images: [
        R.images.jewels.snow.name,
        R.images.jewels.sockGreen.name,
        R.images.jewels.candyMan.name,
        R.images.jewels.blueBall.name,
        R.images.jewels.sockPink.name,
        R.images.jewels.boxGift.name,
        R.images.jewels.candyHeart.name,
        R.images.jewels.jewelOrange.name,
        R.images.jewels.gloves.name,
        R.images.jewels.candyStick.name,
        R.images.jewels.candyRound.name,
        R.images.jewels.cap.name,
        R.images.jewels.star.name,
        R.images.jewels.snowFoot.name,
        R.images.jewels.ice.name,
        R.images.jewels.boxWood.name
    ],

};

CristmasJewelGenerator.init  = function (game) {
    this.game = game;
};

CristmasJewelGenerator.createJewel = function (type) {
    type = Math.abs(type % this.images.length); // защита от выхода за пределы
    var image = this.images[type];
    return this.game.add.image(100, 100, this.imagePage, image);
};

CristmasJewelGenerator.changeJewelTexture = function (view, type) {
    type = Math.abs(type % this.images.length); // защита от выхода за пределы
    view.frameName = this.images[type];
};

CristmasJewelGenerator.getCursor = function () {
    return ImageBuilder.strokeRect(0, 0,
        this.CURSOR_SIZE, this.CURSOR_SIZE,
        "#00ffff", 6);
};