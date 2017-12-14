/**
 * Created by Work on 14.12.2017.
 */


function PreloaderImage(game){
    this.game = game;
    var WIDTH = Math.floor(AppConfig.width / 8 * 6);
    var HEIGHT = 24;
    var STROKE = 4;
    var STROKE_COLOR = "#182E58";
    var BG_COLOR = "#112140";
    var FILL_COLOR = "#58B000";
    var GLOW_COLOR = "#7EFD00";

    this.percent = 5;

    this.rootView = ImageBuilder.rect(0,0, WIDTH, HEIGHT, BG_COLOR);
    this.progressImage = ImageBuilder.rect(0,0, WIDTH, HEIGHT, FILL_COLOR);
    this.progressGlowImage = ImageBuilder.rect(0,0, WIDTH, HEIGHT, GLOW_COLOR);
    this.frameImage = ImageBuilder.strokeRect(0,0,WIDTH, HEIGHT, STROKE_COLOR, STROKE);

    this.rootView.addChild(this.progressImage);
    this.rootView.addChild(this.progressGlowImage);
    this.rootView.addChild(this.frameImage);
    this.rootView.alignIn(game.world, Phaser.CENTER);

    this.progressImage.scale.x = this.percent / 100;
    this.progressGlowImage.scale.x = this.percent / 100;
}

PreloaderImage.prototype.loadUpdate = function () {
    this.percent = this.game.load.progress; // 0...100
    this.progressImage.scale.x = this.percent / 100;
    this.progressGlowImage.scale.x = this.percent / 100;
};