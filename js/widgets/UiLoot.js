/**
 * Created by Work on 20.11.2017.
 *
 * UiLoot - виджет для отображения собранных вариантов лута
 * в основе массив UiLootElement
 *
 */

function UiLoot(game) {
    this.UI_LOOT_TYPE_MAX_AMOUNT = PotionType.length;
    this.UI_LOOT_TYPE_IN_ROW = 4;
    this.UI_LOOT_GRID_X_GAP = 132;
    this.UI_LOOT_GRID_Y_GAP = 54;

    this.widgetGroup = game.add.group();

    this.lootModel = []; // массиво объектов {type, value}
    this.lootWidgets = []; // массиво объектов {type, value}

    var i, nextLootWidget;
    for (i = 1; i < this.UI_LOOT_TYPE_MAX_AMOUNT; i++) {
        this.lootModel[i] = {type: i, value: 0};

        nextLootWidget = new UiLootElement(game);
        nextLootWidget.set(i, 0);
        nextLootWidget.addToGroup(this.widgetGroup);
        this.lootWidgets[i] = nextLootWidget;
    }

    this.align();
}

UiLoot.prototype.align = function () {
    this.widgetGroup.align(-1, this.UI_LOOT_TYPE_IN_ROW, this.UI_LOOT_GRID_X_GAP, this.UI_LOOT_GRID_Y_GAP);
};

UiLoot.prototype.setXY = function (x, y) {
    this.widgetGroup.x = x;
    this.widgetGroup.y = y;
    return this;
};

UiLoot.prototype.addLoot = function (type, amount) {

    var index = -1;
    for (var i = 1; i < this.lootModel.length; i++) {
        if (this.lootModel[i].type === type) {
            index = i;
            break;
        }
    }
    if (index == -1) return;
    this.lootWidgets[index].addLoot(amount);
};