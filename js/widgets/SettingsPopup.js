/**
 * Created by Work on 09.12.2017.
 */

function SettingsPopup(game) {
    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);
    this.buttonBuilder = ButtonBuilder;

    this.closeButton = this.buttonBuilder.backButton(0, 0, this.hide, this);
    this.closeButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, 32);
    this.bg.addChild(this.closeButton);

    this.scoreCallback = undefined;
    this.scoreCallbackContext = undefined;
    this.scoreButton = this.game.add.button(0, 0, R.images.buttons.midBlueIdle.page,
        function () {
            this.onScoreButtonPressed();
        }, this,
        R.images.buttons.midBlueIdle.name,
        R.images.buttons.midBlueIdle.name,
        R.images.buttons.midBluePressed.name,
        R.images.buttons.midBlueIdle.name);
    this.scoreButton.alignIn(this.bg, Phaser.TOP_CENTER, 0, -32);

    var scoreBtLabel = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, Locale.strings.scoreTable, 36);
    // scoreBtLabel.tint = "0xffffff"; // для белого не нужно
    scoreBtLabel.alignIn(this.scoreButton, Phaser.CENTER, 0, -5);

    this.bg.addChild(this.scoreButton);
    this.bg.addChild(scoreBtLabel);

    this.musicSlider = new VolumeSlider(this.game,
        Sound.settings.volume.music,
        Sound.settings.mute.music,
        Locale.strings.musicOn,
        Locale.strings.musicOff);
    this.musicSlider.rootView.alignTo(this.scoreButton, Phaser.BOTTOM_CENTER, 0, 120);
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
        Locale.strings.soundOn, Locale.strings.soundOff);
    this.soundSlider.rootView.alignTo(this.musicSlider.rootView, Phaser.BOTTOM_CENTER, 0, 120);
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
    if (this.rootView.alive) this.hide();
    else this.show();
};

SettingsPopup.prototype.hide = function () {
    // Настройки звука сохраняем здесь, а не при изменении слайдера, чтобы не дергать файловую систему
    Sound.saveSettings();
    this.rootView.kill();
    this.onHide();
};

SettingsPopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

SettingsPopup.prototype.onNewGamePressed = function () {
    this.hide();
    if (this.newGameCallback) {
        this.newGameCallback.call(this.newGameCallbackContext);
    }
};

SettingsPopup.prototype.setNewGameCallBack = function (callback, context) {
    this.newGameCallback = callback;
    this.newGameCallbackContext = context;
    return this;
};


SettingsPopup.prototype.onScoreButtonPressed = function () {
    this.hide();
    if (this.scoreCallback) {
        this.scoreCallback.call(this.scoreCallbackContext);
    }
};

SettingsPopup.prototype.setScoreTableCallBack = function (callback, context) {
    this.scoreCallback = callback;
    this.scoreCallbackContext = context;
    return this;
};

SettingsPopup.prototype.onHide = function () {
    if (this.onHideCallback) {
        this.onHideCallback.call(this.onHideCallbackContext);
    }
};

SettingsPopup.prototype.setOnHideCallback = function (callback, context) {
    this.onHideCallback = callback;
    this.onHideCallbackContext = context;
    return this;
};