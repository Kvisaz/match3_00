/**
 * Created by Work on 22.11.2017.
 *
 * порядок должен конкретное соответствие картинок типам пузырьков
 */

var PotionImageNames = {
    data: [
        R.img.Potions.p00_EMPTY,
        R.img.Potions.p01_BLUE,
        R.img.Potions.p02_GREEN,
        R.img.Potions.p03_PURPLE,
        R.img.Potions.p04_FIRE,

        R.img.Potions.p05_LOVE,
        R.img.Potions.p06_YELLOW,
        R.img.Potions.p07_FLY,
        R.img.Potions.p08_POISON,

        R.img.Potions.p09_PURPLE,
        R.img.Potions.p10_SNAKE,
        R.img.Potions.p11_JOLLY,
        R.img.Potions.p12_POISON,

        R.img.Potions.p13_FIRE,
        R.img.Potions.p14_SNOW,
        R.img.Potions.p15_PLAGUE,
        R.img.Potions.p16_GODLIGHT,

        R.img.Potions.p17_EFIR,
    ]
};

PotionImageNames.getPage = function (type) {
    return this.data[type].page;
};

PotionImageNames.getName = function (type) {
    return this.data[type].name;
};