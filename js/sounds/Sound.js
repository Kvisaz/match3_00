/**
 * Created by Work on 08.12.2017.
 *
 * Синглтон для управления звуком в игре, *
 *
 */

var Sound = {
    SELECT: 0,
    UNDO: 1,
    FALL: 2,
    BLAST: 3,
    GAMEOVER: 4,

    REPO_SETTINGS_TAG: "sound"
};

Sound.init = function (game, repository) {
    this.game = game;
    this.repository = repository; // сохранение и восстановление настроек

    this.music = game.add.sound(R.sounds.winteryLoop.name);

    this.sounds = [];
    this.sounds[this.SELECT] = game.add.sound(R.sounds.click.name);
    this.sounds[this.UNDO] = game.add.sound(R.sounds.undoSwap.name);
    this.sounds[this.BLAST] = game.add.sound(R.sounds.blast.name);
    this.sounds[this.FALL] = game.add.sound(R.sounds.fall.name);
    this.sounds[this.GAMEOVER] = game.add.sound(R.sounds.gameover.name);

    this.settings = {
        mute: {
            all: false,
            music: false,
            sounds: false
        },
        volume: {
            music: 0.3,
            sounds: 1
        }
    };

    this.loadSettings(); // Загрузка предыдущих настроек, если есть
};

Sound.loadSettings = function () {
    var savedSettings = this.repository.load(this.REPO_SETTINGS_TAG);
    if (savedSettings) {
        this.settings = savedSettings;
    }
};

Sound.saveSettings = function () {
    this.repository.save(this.REPO_SETTINGS_TAG, this.settings);
};

Sound.muteMusic = function (mute) {
    this.music.mute = mute;
    this.settings.mute.music = mute;
    if (this.music.isPlaying) this.music.stop();
    else this.playMusic();
};

Sound.muteSounds = function (mute) {
    this.settings.mute.sounds = mute;
    this.sounds.forEach(function (sound) {
        sound.mute = mute;
    });
};

Sound.setMusicVolume = function (volume) {
    this.settings.volume.music = volume;
    this.music.volume = volume;
};

Sound.setSoundsVolume = function (volume) {
    this.settings.volume.sounds = volume;
    this.sounds.forEach(function (sound) {
        sound.volume = volume;
    });
};

Sound.playMusic = function () {
    if (this.settings.mute.music || this.settings.mute.all) return;
    this.music.loopFull(this.settings.volume.music);
};

Sound.playSound = function (soundTag) {
    if (this.settings.mute.sounds || this.settings.mute.all) return;
    this.sounds[soundTag].play('', 0, this.settings.volume.sounds);
};