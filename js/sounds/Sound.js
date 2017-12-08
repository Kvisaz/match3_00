/**
 * Created by Work on 08.12.2017.
 *
 * Синглтон для управления звуком в игре, *
 *
 */

var Sound = {};

Sound.init = function (game) {
    this.SELECT = 0;
    this.FALL = 1;
    this.BLAST = 2;
    this.GAMEOVER = 3;

    this.game = game;
    this.music = game.add.sound(R.sounds.winteryLoop.name);

    this.sounds = [];
    // todo change to sounds
    this.sounds[this.SELECT] = game.add.sound(R.sounds.click.name);
    this.sounds[this.BLAST] = game.add.sound(R.sounds.click.name);
    this.sounds[this.FALL] = game.add.sound(R.sounds.fall.name);
    this.sounds[this.GAMEOVER] = game.add.sound(R.sounds.click.name);

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
// todo
Sound.mute = function () {
    this.isMute = true;
    this.game.sound.stopAll();
};

Sound.playMusic = function () {
    if(this.isMute.music|| this.isMute.all) return;
    this.music.loopFull(this.volume.music);
};

Sound.playSound = function (soundTag) {
    if(this.isMute.sounds || this.isMute.all) return;
    this.sounds[soundTag].play('', 0, this.volume.sounds);
};

Sound.stopMusic = function () {
    this.music.stop();
};

Sound.switchMusic = function () {
    if(this.isMute.music|| this.isMute.all) return;
    if(this.music.isPlaying) this.stopMusic();
    else this.playMusic();
};

// ----------------------------------- плейлист ------------
/*
 // добавляет объекты музыки и выдает следующую
 function PlayList(game, musicNamesArray) {
 this.interval = 5000; // интервал между песнями в ms
 var list = [];
 var index = 0;
 var current = undefined;
 var isPlaying = false;

 musicNamesArray.forEach(function (music) {
 list.push(game.add.audio(music));
 });

 // позволяет циклично пролистывать цикл
 this.getNext = function () {
 current = list[index];
 index = (index + 1 ) % list.length;
 return current;
 };

 // воспроизводит следущую и готовит к запуску другую музыку
 this.playNext = function () {
 this.getNext(); // устанавливаем current
 current.play(); // запускаем его
 isPlaying = true;
 //console.log("current.isPlaying = "+current.isPlaying); // всегда фальзе!!!
 // после завершения вызываем себя с интервалом
 var interval = this.interval;
 current.onStop.addOnce(function () { // ВСЕГДА ADDONCE делай
 console.log("Hello onStop");
 isPlaying = false;
 this.playNext();
 }, this);
 };

 // стопим
 this.stop = function() {
 isPlaying = false;
 current.onStop.removeAll(); // убираем коллбэк перезапуска
 if(current && current.isPlaying) current.stop(); // стопим текущую музыку
 };

 // стопим
 this.switch = function() {
 if(isPlaying) this.stop(); // стопим текущую музыку
 else {
 this.getNext();
 }
 };
 }*/
