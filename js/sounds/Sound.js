/**
 * Created by Work on 08.12.2017.
 *
 * Синглтон для управления звуком в игре, *
 *
 */

var Sound = {};

Sound.init = function (game) {
    this.SELECT = 0;
    this.UNDO = 1;
    this.FALL = 2;
    this.BLAST = 3;
    this.GAMEOVER = 4;

    this.game = game;
    this.music = game.add.sound(R.sounds.winteryLoop.name);

    this.sounds = [];
    // todo change to sounds
    this.sounds[this.SELECT] = game.add.sound(R.sounds.click.name);
    this.sounds[this.UNDO] = game.add.sound(R.sounds.undoSwap.name);
    this.sounds[this.BLAST] = game.add.sound(R.sounds.blast.name);
    this.sounds[this.FALL] = game.add.sound(R.sounds.fall.name);
    this.sounds[this.GAMEOVER] = game.add.sound(R.sounds.gameover.name);

    this.isMute = {
        all: false,
        music: false,
        sounds: false
    };

    this.volume = {
        music: 0.3,
        sounds: 1
    };
};

Sound.muteMusic = function (mute) {
    this.music.mute = mute;
};

Sound.muteSounds = function (mute) {
    this.sounds.forEach(function (sound) {
        sound.mute = mute;
    });
};

Sound.setMusicVolume = function (volume) {
    this.volume.music = volume;
    this.music.volume = volume;
};

Sound.setSoundsVolume = function (volume) {
    this.volume.sounds = volume;
    this.sounds.forEach(function (sound) {
        sound.volume = volume;
    });
};

Sound.mute = function () {
    this.isMute = true;
    this.game.sound.stopAll();
};

Sound.playMusic = function () {
    if (this.isMute.music || this.isMute.all) return;
    this.music.loopFull(this.volume.music);
};

Sound.playSound = function (soundTag) {
    if (this.isMute.sounds || this.isMute.all) return;
    console.log("playSound " + soundTag);
    this.sounds[soundTag].play('', 0, this.volume.sounds);
};

Sound.stopMusic = function () {
    this.music.stop();
};

Sound.switchMusic = function () {
    if (this.isMute.music || this.isMute.all) return;
    if (this.music.isPlaying) this.stopMusic();
    else this.playMusic();
};