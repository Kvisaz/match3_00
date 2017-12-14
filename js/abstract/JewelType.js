/**
 * Created by Work on 29.11.2017.
   хелло
 */

var JewelType = {
    NONE: -1,
    COMMON_0: 0,
    COMMON_1: 1,
    COMMON_2: 2,
    COMMON_3: 3,
    COMMON_4: 4,
    COMMON_5: 5,
    COMMON_6: 6,
    COMMON_7: 7
};

JewelType.getRandomCommon = function () {
    return Math.round(Math.random() * (this.COMMON_7))
};

JewelType.getCommonTypeArray = function () {
    return [this.COMMON_0,this.COMMON_1, this.COMMON_2, this.COMMON_3,
        this.COMMON_4, this.COMMON_5, this.COMMON_6, this.COMMON_7];
};