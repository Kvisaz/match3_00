/**
 * Created by Work on 09.12.2017.
 */

function ScoreTablePopup(game, scoreRepository) {
    this.game = game;
    this.scoreRepository = scoreRepository;
    this.SCORE_FONT_SIZE = 48;

    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.addLayout();

    this.rootView = this.bg; // для ссылки снаружи
    this.rootView.alignIn(game.world, Phaser.CENTER, 0, -20);
    this.hide(); // по умолчанию не показываем
}

ScoreTablePopup.prototype.alignIn = function (t, e, s, n) {
    this.rootView.alignIn(t, e, s, n);
    return this;
};

ScoreTablePopup.prototype.alignTo = function (t, e, s, n) {
    this.rootView.alignTo(t, e, s, n);
    return this;
};

ScoreTablePopup.prototype.show = function () {
    var scores = this.scoreRepository.getBestScores();
    var last = this.scoreRepository.getLast();
    this.refreshScores(scores, last);
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
    return this;
};

ScoreTablePopup.prototype.hide = function () {
    this.rootView.kill();
    return this;
};

ScoreTablePopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

ScoreTablePopup.prototype.onBackPressed = function () {
    this.hide();
    if (this.backCallback) {
        this.backCallback.call(this.backCallbackContext);
    }
};

ScoreTablePopup.prototype.setBackCallBack = function (callback, context) {
    this.backCallback = callback;
    this.backCallbackContext = context;
    return this;
};

ScoreTablePopup.prototype.refreshScores = function (scores, lastScore) {
    var scoreString = "";
    var i, length = this.scoreRepository.BEST_SCORE_AMOUNT;
    for (i = 0; i < length; i++) {
        if (scores[i] === undefined) break;
        if(lastScore == scores[i]){
            // todo выделить маркер
        }
        scoreString += "\n" +scores[i];
    }
    this.scoreText.setText(scoreString);
};

ScoreTablePopup.prototype.addLayout = function () {
    var BG_WIDTH = 320;
    var BG_HEIGHT = 400;
    this.scoreBg = this.game.add.image(0, 0, R.images.field.bg9.page, R.images.field.bg9.name);
    this.scoreBg.refresh9slice(BG_WIDTH, BG_HEIGHT);
    this.scoreBg.alignIn(this.bg, Phaser.TOP_CENTER, 0, -110);
    this.bg.addChild(this.scoreBg);

    var logo = this.game.add.image(0, 0, R.images.ui.elkaBg.page, R.images.ui.elkaBg.name);
    logo.alignIn(this.bg, Phaser.TOP_CENTER, 0, -14);
    this.bg.addChild(logo);

    var snowTop = this.game.add.image(0, 0, R.images.ui.snowTopping.page, R.images.ui.snowTopping.name);
    snowTop.alignIn(this.bg, Phaser.TOP_CENTER, 0, 14);
    this.bg.addChild(snowTop);

    this.scoreText = this.game.add.bitmapText(0, 0, R.fonts.fedoka.name, "", this.SCORE_FONT_SIZE);
    this.scoreText.anchor.setTo(0.5, 0);
    this.scoreText.align = "center";
    this.scoreText.alignIn(this.bg, Phaser.TOP_CENTER, 0, -100);
    this.bg.addChild(this.scoreText);

    this.titleText = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.scoreTitle, 48);
    this.titleText.alignIn(this.bg, Phaser.TOP_CENTER, 0, -46);
    this.bg.addChild(this.titleText);

    var buttonBuilder = ButtonBuilder;
    this.backButton = buttonBuilder.backButton(0, 0, this.onBackPressed, this);
    this.backButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, 32);
    this.bg.addChild(this.backButton);
};