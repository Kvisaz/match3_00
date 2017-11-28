/**
 * Created by Work on 20.11.2017.
 *
 * интерфейс для отображения лута 1 типа
 *
 */

function UiLootElement(game) {
    this.type = 0;
    this.amount = 0;

    this.image = game.add.image(0,0,
        PotionImageNames.getPage(this.type),
        PotionImageNames.getName(this.type));

    this.text = game.add.text(56, 18, this.amount, R.style.floating);
    this.image.addChild(this.text);
}

UiLootElement.prototype.addToGroup = function (group) {
    group.add(this.image);
};

UiLootElement.prototype.hide = function () {
    this.image.alpha = 0;
    this.image.kill();
};

UiLootElement.prototype.show = function () {
    this.image.alpha = 1;
    this.image.revive();
};

UiLootElement.prototype.set = function (type, amount) {
    this.type = type;
    this.amount = amount;

    this.text.setText(amount);
    this.image.frameName = PotionImageNames.getName(this.type);
};

UiLootElement.prototype.addLoot = function (amount) {
    this.set(this.type, this.amount + amount);
};


