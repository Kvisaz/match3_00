/**
 * Created by Work on 24.11.2017.
 *
 * индикатор для отображения уровня
 * сам все строит, только скармливай и обновляй данные
 *  - уровень
 *  - экспы на уровень
 *  - текущая экспа
 */

function UiLevelBar(game) {
    var width = 516, height = 24;

    this.data = {
        level: 1, // уровень
        totalExp: 70, // экспы на уровень
        currentExp: 10 // текущая экспа
    };

    this.view = {
        barBg: ImageBuilder.createRectangleImage(game, 0, 0, width, height, R.colors.PROGRESS_BAR_BG),
        barKnob: ImageBuilder.createRectangleImage(game, 0, 0, width, height, R.colors.PROGRESS_BAR),
        barText: game.add.text(0, 0, this.getFormattedBarString(), R.style.levelBarLabel ),
        title: game.add.text(0, 0, this.getFormattedTitleString(),R.style.levelBarTitle)
    };

    this.view.barText.anchor.setTo(0.5, 0);
    this.view.barText.alignIn(this.view.barBg, Phaser.CENTER, 0, 2);

    this.view.title.anchor.setTo(0.5, 1);
    this.view.title.alignTo(this.view.barBg, Phaser.TOP_CENTER, 0, -2);

    this.view.barBg.addChild(this.view.barKnob);
    this.view.barBg.addChild(this.view.barText);
    this.view.barBg.addChild(this.view.title);
}

UiLevelBar.prototype.getFormattedBarString = function () {
    return "" + this.data.currentExp + " / " + this.data.totalExp;
};

UiLevelBar.prototype.getFormattedTitleString = function () {
    return R.strings.en.levelBarLevel + " " + this.data.level;
};

UiLevelBar.prototype.refreshView = function () {
    this.view.barText.setText(this.getFormattedBarString());
    this.view.barKnob.scale.setTo(this.data.currentExp / this.data.totalExp, 1);
};

UiLevelBar.prototype.setXY = function (x, y) {
    this.view.barBg.x = x;
    this.view.barBg.y = y;
    return this;
};

UiLevelBar.prototype.setTotalExperience = function (exp) {
    this.data.totalExp = exp;
    this.refreshView();
    return this;
};

UiLevelBar.prototype.setCurrentExperience = function (exp) {
    this.data.currentExp = exp;
    this.refreshView();
    return this;
};

UiLevelBar.prototype.setLevel = function (level) {
    this.data.level = level;
    this.view.title.setText(this.getFormattedTitleString());
    return this;
};