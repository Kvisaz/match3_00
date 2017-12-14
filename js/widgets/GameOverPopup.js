/**
 * Created by Work on 09.12.2017.
 */

function GameOverPopup(game, scoreRepository) {
    this.scoreRepository = scoreRepository;
    this.score = 0;

    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.addLayout();

    this.rootView = this.bg; // для ссылки снаружи
    this.rootView.alignIn(game.world, Phaser.CENTER, 0, -20);
    this.hide(); // по умолчанию не показываем
}

GameOverPopup.prototype.alignIn = function (t, e, s, n) {
    this.rootView.alignIn(t, e, s, n);
    return this;
};

GameOverPopup.prototype.alignTo = function (t, e, s, n) {
    this.rootView.alignTo(t, e, s, n);
    return this;
};

GameOverPopup.prototype.show = function (score) {
    this.score = score || 0;
    this.scoreText.setText(this.score);
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
    // типа для асинхронности вызываем запись через таймер
    this.game.time.events.add(0, function () {
        this.scoreRepository.saveScore(score);
    }, this);
    return this;
};

GameOverPopup.prototype.switch = function () {
    if (this.rootView.alive) this.hide();
    else this.show();
};

GameOverPopup.prototype.hide = function () {
    this.rootView.kill();
    return this;
};

GameOverPopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

GameOverPopup.prototype.onNewGamePressed = function () {
    this.hide();
    if (this.newGameCallback) {
        this.newGameCallback.call(this.newGameCallbackContext);
    }
};

GameOverPopup.prototype.setNewGameCallBack = function (callback, context) {
    this.newGameCallback = callback;
    this.newGameCallbackContext = context;
    return this;
};

GameOverPopup.prototype.addLayout = function () {
    var logo = this.game.add.image(0, 0, R.images.ui.elkaBg.page, R.images.ui.elkaBg.name);
    logo.alignIn(this.bg, Phaser.TOP_CENTER, 0, -14);
    this.bg.addChild(logo);

    var snowTop = this.game.add.image(0, 0, R.images.ui.snowTopping.page, R.images.ui.snowTopping.name);
    snowTop.alignIn(this.bg, Phaser.TOP_CENTER, 0, 14);
    this.bg.addChild(snowTop);

    var scoreBg = this.game.add.image(0, 0, R.images.ui.scoreBg.page, R.images.ui.scoreBg.name);
    scoreBg.alignIn(this.bg, Phaser.CENTER, 0, -42);
    this.bg.addChild(scoreBg);

    this.scoreText = this.game.add.bitmapText(0, 0, R.fonts.fedoka.name, "" + this.score, 48);
    this.scoreText.tint = "0xF9DC07";
    this.scoreText.anchor.set(0.5, 0.5);
    this.scoreText.alignIn(scoreBg, Phaser.CENTER);
    this.bg.addChild(this.scoreText);

    this.scorePrefixText = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.gameoverScorePrefix, 38);
    this.scorePrefixText.tint = "0x1E396C";
    this.scorePrefixText.anchor.set(0.5, 0);
    this.scorePrefixText.alignTo(scoreBg, Phaser.TOP_CENTER, 0, 24);
    this.bg.addChild(this.scorePrefixText);

    this.titleText = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.gameoverTitle, 48);
    this.titleText.align = "center";
    this.titleText.alignIn(this.bg, Phaser.TOP_CENTER, 0, -46);
    this.bg.addChild(this.titleText);

    var buttonBuilder = ButtonBuilder;
    this.startButton = buttonBuilder.restartGameOverButton(0, 0, this.onNewGamePressed, this);
    this.startButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, -32);
    this.bg.addChild(this.startButton);
};