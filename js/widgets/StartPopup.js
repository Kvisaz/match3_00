/**
 * Created by Work on 09.12.2017.
 */

function StartPopup(game) {
    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.addTitleLayout();
    this.addTutorialLayout();
    this.buttonBuilder = ButtonBuilder;
    this.startButton = this.buttonBuilder.bigGreenButton(this.onNewGamePressed, this, Locale.strings.newGame);

    this.startButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, 32);
    this.bg.addChild(this.startButton);


    this.rootView = this.bg; // для ссылки снаружи
    this.rootView.alignIn(game.world, Phaser.CENTER, 0, -20);
    this.hide(); // по умолчанию не показываем
}

StartPopup.prototype.show = function () {
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
    // this.game.paused = true;
    return this;
};

StartPopup.prototype.switch = function () {
    if (this.rootView.alive) this.hide();
    else this.show();
};

StartPopup.prototype.hide = function () {
    this.rootView.kill();
    return this;
};

StartPopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

StartPopup.prototype.onNewGamePressed = function () {
    this.hide();
    if (this.newGameCallback) {
        this.newGameCallback.call(this.newGameCallbackContext);
    }
};

StartPopup.prototype.setNewGameCallBack = function (callback, context) {
    this.newGameCallback = callback;
    this.newGameCallbackContext = context;
    return this;
};

StartPopup.prototype.addTitleLayout = function () {
    var logo = this.game.add.image(0, 0, R.images.ui.titleLogo.page, R.images.ui.titleLogo.name);
    logo.alignIn(this.bg, Phaser.TOP_CENTER, 0, -14);
    this.bg.addChild(logo);

    var snowTop = this.game.add.image(0, 0, R.images.ui.snowTopping.page, R.images.ui.snowTopping.name);
    snowTop.alignIn(this.bg, Phaser.TOP_CENTER, 0, 14);
    this.bg.addChild(snowTop);

    var santa = this.game.add.image(0, 0, R.images.ui.santa.page, R.images.ui.santa.name);
    santa.alignIn(this.bg, Phaser.BOTTOM_LEFT, -16, -14);
    this.bg.addChild(santa);
};

StartPopup.prototype.addTutorialLayout = function () {
    var tutorial01 = this.game.add.image(0, 0, R.images.ui.tutorial01.page, R.images.ui.tutorial01.name);
    tutorial01.alignIn(this.bg, Phaser.RIGHT_CENTER, -28, 0);
    this.bg.addChild(tutorial01);

    var text1 = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.tutorial1text1, 28);
    text1.tint = "0x112B00";
    text1.alignTo(tutorial01, Phaser.LEFT_TOP, 24, -12);
    this.bg.addChild(text1);

    var text2 = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.tutorial1text2, 28);
    text2.tint = "0x112B00";
    text2.alignTo(tutorial01, Phaser.BOTTOM_RIGHT, -12, 12);
    this.bg.addChild(text2);
};