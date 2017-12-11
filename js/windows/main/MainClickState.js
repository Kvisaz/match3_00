/**
 * Created by Work on 16.11.2017.
 */

function MainClickState() {
    this.create = function () {
        var SCORE_JEWEL = 10;
        var HINT_SCORE_PRICE = 100;

        var uiBuilder = new MainClickUiBuilder(this.game);

        var bg = this.game.add.image(0, 0, R.images.bg.cristmas); // bg

        var scoreBg = this.addImage(51, 50, R.images.ui.scoreBg);
        var score = 0;
        var scoreText = this.game.add.bitmapText(200, 100, R.fonts.fedoka.name, "" + score, 48);
        scoreText.tint = "0xF9DC07";
        scoreText.anchor.set(0.5, 0.5);
        scoreText.alignIn(scoreBg, Phaser.CENTER);

        var settingsPopup = new SettingsPopup(this.game)
            .setXY(0, 160);

        var isPopup = false;
        var settingsButton = uiBuilder.settingsButton(446, 34,
            function () {
                isPopup = !isPopup;
                if (isPopup) level.lockUi();
                else level.unlockUi();

                //Sound.switchMusic();
                //Sound.stopMusic();
                settingsPopup.switch();
            }, this);


        var level = new BejeweledGroup(this.game, 8, 8, 68);
        level.group.alignIn(this.game.world, Phaser.CENTER);



        var snow1 = this.game.add.image(0, 0, R.images.overlay.snowTop.page, R.images.overlay.snowTop.name);
        var snow2 = this.game.add.image(0, 0, R.images.overlay.snowBottom.page, R.images.overlay.snowBottom.name);
        snow2.alignIn(bg, Phaser.BOTTOM_CENTER);


        // todo effect manager
        var effectManager = new EffectManager(this.game, level);
        // var effectImage = this.game.add.image(100,100, R.effects.explosion.name);
        //effectImage.animations.add("blast");

        Sound.playMusic();


        var hintButton = new UiTextButton(this.game, 200, 58, "Show Hint", "#FF9900", "#AE6800")
            .alignIn(this.game.world, Phaser.BOTTOM_CENTER)
            .setCallback(function () {
                if(level.isUiBlocked) return;
                level.showHint();
            }, this);

        var fps = new PhaserUtils.Fps(this.game, 0, 0);
        fps.alignIn(this.game.world, Phaser.BOTTOM_LEFT, -100, -20);


        /*
         var restartButton = new UiTextButton(this.game, 132, 48, "RESTART", "#FF9900", "#AE6800")
         .alignTo(levelBg, Phaser.BOTTOM_CENTER, 100, 20)
         .setCallback(level.restart, level);
         */


        var noMoreMoves = new UiTextButton(this.game, 328, 256, "GAME OVER \n restart?", "#FF9900", "#AE6800")
            .alignIn(this.game.world, Phaser.CENTER)
            .setCallback(function () {
                noMoreMoves.kill();
                level.restart();
            });
        //noMoreMoves.kill();


        // Связать логику компонента с нашим планом

        level.callbacks.select = function (jewel) {
            console.log("level.callbacks.select / jewel = " + jewel.column + " / " + jewel.row);
            Sound.playSound(Sound.SELECT);
        };

        level.callbacks.swap = function (jewel1, jewel2, hasCombo) {
            console.log("level.callbacks.swap / jewel1 = " + jewel1.column + " / " + jewel1.row);
            console.log("level.callbacks.swap / jewel2 = " + jewel2.column + " / " + jewel2.row);
            console.log("level.callbacks.swap / hasCombo = " + hasCombo);
            if (!hasCombo) Sound.playSound(Sound.UNDO);

        };
        level.callbacks.levelGenerated = function () {
            console.log("level.callbacks.levelGenerated");
        };
        // показали подсказку {hint: jewel2, target: jewel1, length: comboLength}
        level.callbacks.hintShown = function (solution) {
            console.log("level.callbacks.hintShown");
            score -= HINT_SCORE_PRICE;
            scoreText.setText("" + score);
        };
        // начало взрыва камня
        level.callbacks.blastStart = function (blastedJewels) {
            effectManager.blast(blastedJewels);
            console.log("level.callbacks.blastStart  / blastedAmount = " + blastedJewels.length);
            Sound.playSound(Sound.BLAST);
            score += SCORE_JEWEL * blastedJewels.length;
            scoreText.setText(score);
        };
        // конец взрыва всех камней
        level.callbacks.totalBlastFinish = function () {
            console.log("level.callbacks.totalBlastFinish");
        };
        // начало падения камня
        level.callbacks.singleFallStart = function (jewel) {
            console.log("level.callbacks.singleFallStart");
            Sound.playSound(Sound.FALL);
        };

        // окончание падения камня
        level.callbacks.singleFallFinish = function (jewel) {
            console.log("level.callbacks.singleFallFinish");

        };
        // генерация нового камня
        level.callbacks.singleBornStart = function (jewel) {
            console.log("level.callbacks.singleBornStart");
        };
        // нет больше ходов
        level.callbacks.noMoves = function () {
            console.log("level.callbacks.noMoves");
            noMoreMoves.revive();
        };

    };

    this.addImage = function (x, y, image) {
        return this.game.add.image(x, y, image.page, image.name);
    }
}