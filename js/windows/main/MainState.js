/**
 * Created by Work on 16.11.2017.
 */

function MainState() {
    this.create = function () {
        this.SCORE_JEWEL = 10;
        this.HINT_SCORE_PRICE = 100;

        this.score = 0;

        var uiBuilder = new MainClickUiBuilder(this.game);

        var bg = this.game.add.image(0, 0, R.images.bg.cristmas); // bg

        var scoreBg = this.addImage(51, 50, R.images.ui.scoreBg);
        scoreBg.alignIn(this.game.world, Phaser.TOP_CENTER, 0, -36);
        this.scoreText = this.game.add.bitmapText(200, 100, R.fonts.fedoka.name, "" + this.score, 48);
        this.scoreText.tint = "0xF9DC07";
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.alignIn(scoreBg, Phaser.CENTER);

        this.settingsButton = uiBuilder.settingsButton(0, 0, this.onSettingsClick, this);
        this.settingsButton.alignTo(scoreBg, Phaser.RIGHT_CENTER, 12, 0);

        this.newgameButton = uiBuilder.newGameButton(0, 0, this.onNewGameClick, this);
        this.newgameButton.alignTo(scoreBg, Phaser.LEFT_CENTER, 12, 0);


        this.bejeweledComponent = this.addBejeweled();
        this.addBejeweledLogic(this.bejeweledComponent);


        var snow1 = this.game.add.image(0, -10, R.images.overlay.snowTop.page, R.images.overlay.snowTop.name);
        var snow2 = this.game.add.image(0, 0, R.images.overlay.snowBottom.page, R.images.overlay.snowBottom.name);
        snow2.alignIn(bg, Phaser.BOTTOM_CENTER);

        this.effectManager = new EffectManager(this.game, this.bejeweledComponent);

        var hintButton = new UiTextButton(this.game, 200, 58, "Show Hint", "#FF9900", "#AE6800")
            .alignIn(this.game.world, Phaser.BOTTOM_CENTER)
            .setCallback(this.onHintButtonClick, this);

        this.addSettingsPopup();
        this.addGameOverPopup();



        // todo delete
        var fps = new MyPhaser.Fps(this.game, 0, 0);
        fps.alignIn(this.game.world, Phaser.BOTTOM_LEFT, -100, -20);

        this.showStart();
        Sound.playMusic();
    };

    this.addImage = function (x, y, image) {
        return this.game.add.image(x, y, image.page, image.name);
    };

    this.showStart = function () {
        this.lockUi(true);
        var startPopup = new StartPopup(this.game).setNewGameCallBack(this.onResumeClick, this).show();
    };

    this.addSettingsPopup = function () {
        this.settingsPopup = new SettingsPopup(this.game)
            .setNewGameCallBack(this.onNewGameClick, this)
            .setOnHideCallback(this.onSettingsHide, this);
        this.settingsPopup.rootView.alignIn(this.game.world, Phaser.CENTER);
    };

    this.addGameOverPopup = function () {
        this.gameOverPopup = new UiTextButton(this.game, 328, 256, "GAME OVER \n restart?", "#FF9900", "#AE6800")
            .alignIn(this.game.world, Phaser.CENTER)
            .setCallback(this.onNewGameClick, this);
        this.gameOverPopup.kill();
    };

    this.addBejeweled = function () {
        var bejeweledComponent = new BejeweledGroup(this.game, 4, 4, 70);
        bejeweledComponent.alignIn(this.game.world, Phaser.CENTER);
        return bejeweledComponent;
    };

    this.addBejeweledLogic = function (bejeweledComponent) {
        var me = this;
        bejeweledComponent.callbacks.select = function (jewel) {
            Sound.playSound(Sound.SELECT);
        };

        bejeweledComponent.callbacks.swap = function (jewel1, jewel2, hasCombo) {
            if (!hasCombo) Sound.playSound(Sound.UNDO);
        };
        bejeweledComponent.callbacks.levelGenerated = function () {
        };

        bejeweledComponent.callbacks.hintShown = function (solution) {
            me.score -= me.HINT_SCORE_PRICE;
            me.scoreText.setText(me.score);
        };
        // начало взрыва камня
        bejeweledComponent.callbacks.blastStart = function (blastedJewels) {
            me.effectManager.blast(blastedJewels);

            Sound.playSound(Sound.BLAST);
            me.score += me.SCORE_JEWEL * blastedJewels.length;
            me.scoreText.setText(me.score);
        };
        // конец взрыва всех камней
        //bejeweledComponent.callbacks.totalBlastFinish = function () {};

        // начало падения камня
        bejeweledComponent.callbacks.singleFallStart = function (jewel) {
            Sound.playSound(Sound.FALL);
        };

        // окончание падения камня
        //bejeweledComponent.callbacks.singleFallFinish = function (jewel) {};

        // генерация нового камня
        //bejeweledComponent.callbacks.singleBornStart = function (jewel) {};

        // нет больше ходов
        bejeweledComponent.callbacks.noMoves = function () {
            me.lockUi(true);
            me.gameOverPopup.revive();
        };
    };

    this.onSettingsClick = function () {
        if (this.isUiLocked) return;
        this.lockUi(true);
        this.settingsPopup.show();
    };

    this.onStartGameClick = function () {
        this.onResumeClick();
    };

    this.onHintButtonClick = function () {
        if (this.isUiLocked) return;
        this.bejeweledComponent.showHint();
    };

    this.onNewGameClick = function () {
        this.lockUi(false);
        this.score = 0;
        this.scoreText.setText(this.score);
        if (this.gameOverPopup.alive) this.gameOverPopup.kill();
        this.bejeweledComponent.restart();
    };

    this.onSettingsHide = function () {
        this.lockUi(false);
    };

    this.onResumeClick = function () {
        this.lockUi(false);
    };


    this.lockUi = function (lock) {
        //   this.game.paused = lock; // при этом перестают работать и кнопки и слайдеры
        this.isUiLocked = lock;
        this.bejeweledComponent.lockUiGlobal(lock);
    };
}