/**
 * Created by Work on 24.11.2017.
 *
 * индикатор для отображения здоровья
 * сам все строит, только скармливай и обновляй данные
 */

function UiHealthBar(game) {
    this.data = {
        totalHealth: 10, //
        currentHealth: 7 //
    };

    var width = 516, height = 24, str;
    this.view = {
        barBg: ImageBuilder.createRectangleImage(game, 0, 0, width, height, R.colors.PROGRESS_BAR_BG),
        barKnob: ImageBuilder.createRectangleImage(game, 0, 0, width, height, R.colors.HEALTH_BAR),
        barText: game.add.text(0, 0, this.getFormattedBarString(), R.style.healthBarLabel),
        title: game.add.text(0, 0, this.getFormattedTitleString(), R.style.healthBarTitle)
    };

    this.view.barText.anchor.setTo(0.5, 0.5);
    this.view.barText.alignIn(this.view.barBg, Phaser.CENTER, 0, 2);

    this.view.title.anchor.setTo(0.5, 1);
    this.view.title.alignTo(this.view.barBg, Phaser.TOP_CENTER, 0, -2);

    this.view.barBg.addChild(this.view.barKnob);
    this.view.barBg.addChild(this.view.barText);
    this.view.barBg.addChild(this.view.title);
}

UiHealthBar.prototype.getFormattedBarString = function () {
    return "" + this.data.currentHealth + " / " + this.data.totalHealth;
};

UiHealthBar.prototype.getFormattedTitleString = function () {
    return R.strings.en.healthBarTitle;
};

UiHealthBar.prototype.setXY = function (x, y) {
    this.view.barBg.x = x;
    this.view.barBg.y = y;
    return this;
};

UiHealthBar.prototype.refreshView = function () {
    this.view.barText.setText(this.getFormattedBarString());
    this.view.barKnob.scale.setTo(this.data.currentHealth / this.data.totalHealth, 1);
};

UiHealthBar.prototype.setTotalHealth = function (health) {
    this.data.totalHealth = health;
    this.refreshView();
    return this;
};

UiHealthBar.prototype.setHealth = function (health) {
    this.data.currentHealth = health;
    this.refreshView();
    return this;
};