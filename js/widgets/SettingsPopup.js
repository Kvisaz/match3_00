/**
 * Created by Work on 09.12.2017.
 */

function SettingsPopup(game) {
    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.newGameCallback = undefined;
    this.newGameCallbackContext = undefined;
    this.newGameButton = this.game.add.button(0, 0, R.images.buttons.newGameIdle.page,
        this.onNewGamePressed, this,
        R.images.buttons.newGameIdle.name,
        R.images.buttons.newGameIdle.name,
        R.images.buttons.newGamePressed.name,
        R.images.buttons.newGameIdle.name);
    this.newGameButton.alignIn(this.bg, Phaser.TOP_CENTER, 0, -48);

    var newGameBtLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.newGame, 42);
    // newGameBtLabel.tint = "0xffffff"; // для белого не нужно
    newGameBtLabel.alignIn(this.newGameButton, Phaser.CENTER, 0, -8);

    this.bg.addChild(this.newGameButton);
    this.bg.addChild(newGameBtLabel);


    this.scoreCallback = undefined;
    this.scoreCallbackContext = undefined;
    this.scoreButton = this.game.add.button(0, 0, R.images.buttons.scoreIdle.page,
        this.onScoreButtonPressed, this,
        R.images.buttons.scoreIdle.name,
        R.images.buttons.scoreIdle.name,
        R.images.buttons.scorePressed.name,
        R.images.buttons.scoreIdle.name);
    this.scoreButton.alignTo(this.newGameButton, Phaser.BOTTOM_CENTER, 0, 24);

    var scoreBtLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.scoreTable, 36);
    // scoreBtLabel.tint = "0xffffff"; // для белого не нужно
    scoreBtLabel.alignIn(this.scoreButton, Phaser.CENTER, 0, -5);

    this.bg.addChild(this.scoreButton);
    this.bg.addChild(scoreBtLabel);

    this.soundSlider = new VolumeSlider(this.game, Sound.volume.sounds, R.strings.en.soundOn, R.strings.en.soundOff);
    this.soundSlider.rootView.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, -52);
    this.bg.addChild(this.soundSlider.rootView);

    this.soundSlider.setVolumeCallback(function (volume) {
        Sound.setSoundsVolume(volume);
    }, this);

    this.soundSlider.setCheckCallback(function (playing) {
        Sound.muteSounds(!playing);
    }, this);


    this.musicSlider = new VolumeSlider(this.game, Sound.volume.music, R.strings.en.musicOn, R.strings.en.musicOff);
    this.musicSlider.rootView.alignIn(this.bg, Phaser.CENTER, 0, 80);
    this.bg.addChild(this.musicSlider.rootView);


    this.musicSlider.setVolumeCallback(function (volume) {
        Sound.setMusicVolume(volume);
    }, this);

    this.musicSlider.setCheckCallback(function (playing) {
        Sound.muteMusic(!playing);
    }, this);


    this.rootView = this.bg; // для ссылки снаружи
    this.hide(); // по умолчанию не показываем
}

SettingsPopup.prototype.show = function () {
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
   // this.game.paused = true;
};

SettingsPopup.prototype.switch = function () {
    if(this.rootView.alive) this.hide();
    else this.show();
};

SettingsPopup.prototype.hide = function () {
   // this.game.paused = false;
    this.rootView.kill();
};

SettingsPopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

SettingsPopup.prototype.onNewGamePressed = function () {
    if(this.newGameCallback) {
        this.newGameCallback.call(this.newGameCallbackContext);
    }
};

SettingsPopup.prototype.setNewGameCallBack = function (callback, context) {
    this.newGameCallback = callback;
    this.newGameCallbackContext = context;
    return this;
};


SettingsPopup.prototype.onScoreButtonPressed = function () {
    if(this.scoreCallback) {
        this.scoreCallback.call(this.scoreCallbackContext);
    }
};

SettingsPopup.prototype.setScoreTableCallBack = function (callback, context) {
    this.scoreCallback = callback;
    this.scoreCallbackContext = context;
    return this;
};