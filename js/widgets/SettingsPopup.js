/**
 * Created by Work on 09.12.2017.
 */

function SettingsPopup(game) {
    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.closeButton = this.game.add.button(0, 0, R.images.buttons.midGreenIdle.page,
        this.hide, this,
        R.images.buttons.midGreenIdle.name,
        R.images.buttons.midGreenIdle.name,
        R.images.buttons.midGreenPressed.name,
        R.images.buttons.midGreenIdle.name);
    this.closeButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, 32);

    var closeLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.backSettings, 36);
    closeLabel.alignIn(this.closeButton, Phaser.CENTER, 0, -8);

    this.bg.addChild(this.closeButton);
    this.bg.addChild(closeLabel);

    this.newGameCallback = undefined;
    this.newGameCallbackContext = undefined;
    this.newGameButton = this.game.add.button(0, 0, R.images.buttons.midRedIdle.page,
        this.onNewGamePressed, this,
        R.images.buttons.midRedIdle.name,
        R.images.buttons.midRedIdle.name,
        R.images.buttons.midRedPressed.name,
        R.images.buttons.midRedIdle.name);
    this.newGameButton.alignIn(this.bg, Phaser.TOP_CENTER, 0, -32);

    var newGameBtLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.newGame, 36);
    // newGameBtLabel.tint = "0xffffff"; // для белого не нужно
    newGameBtLabel.alignIn(this.newGameButton, Phaser.CENTER, 0, -8);

    this.bg.addChild(this.newGameButton);
    this.bg.addChild(newGameBtLabel);


    this.scoreCallback = undefined;
    this.scoreCallbackContext = undefined;
    this.scoreButton = this.game.add.button(0, 0, R.images.buttons.midBlueIdle.page,
        this.onNewGamePressed, this,
        R.images.buttons.midBlueIdle.name,
        R.images.buttons.midBlueIdle.name,
        R.images.buttons.midBluePressed.name,
        R.images.buttons.midBlueIdle.name);
    this.scoreButton.alignTo(this.newGameButton, Phaser.BOTTOM_CENTER, 0, 12);

    var scoreBtLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.scoreTable, 36);
    // scoreBtLabel.tint = "0xffffff"; // для белого не нужно
    scoreBtLabel.alignIn(this.scoreButton, Phaser.CENTER, 0, -5);

    this.bg.addChild(this.scoreButton);
    this.bg.addChild(scoreBtLabel);

    this.musicSlider = new VolumeSlider(this.game,
        Sound.settings.volume.music,
        Sound.settings.mute.music,
        R.strings.en.musicOn,
        R.strings.en.musicOff);
    this.musicSlider.rootView.alignTo(this.scoreButton, Phaser.BOTTOM_CENTER, 0, 102);
    this.bg.addChild(this.musicSlider.rootView);


    this.musicSlider.setVolumeCallback(function (volume) {
        Sound.setMusicVolume(volume);
    }, this);

    this.musicSlider.setCheckCallback(function (playing) {
        Sound.muteMusic(!playing);
    }, this);

    this.soundSlider = new VolumeSlider(this.game,
        Sound.settings.volume.sounds,
        Sound.settings.mute.sounds,
        R.strings.en.soundOn, R.strings.en.soundOff);
    this.soundSlider.rootView.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, -52);
    this.bg.addChild(this.soundSlider.rootView);

    this.soundSlider.setVolumeCallback(function (volume) {
        Sound.setSoundsVolume(volume);
    }, this);

    this.soundSlider.setCheckCallback(function (playing) {
        Sound.muteSounds(!playing);
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
    // Настройки звука сохраняем здесь, а не при изменении слайдера, чтобы не дергать файловую систему
    Sound.saveSettings();
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