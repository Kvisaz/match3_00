/**
 * Created by Work on 16.11.2017.
 */

function MainState() {
    this.create = function () {
        //this.COLUMNS = 8;
        //this.ROWS = 8;
        this.COLUMNS = 4;
        this.ROWS = 4;
        this.GRIDSTEP = 70;

        var buttonBuilder = ButtonBuilder;
        this.scoreRepository = new ScoreRepository(Repository);
        this.scoreLogic = new ScoreLogic(this.scoreRepository);

        var bg = this.game.add.image(0, 0, R.images.bg.cristmas); // bg

        var scoreBg = this.addImage(0, 0, R.images.ui.scoreBg);
        scoreBg.alignIn(this.game.world, Phaser.TOP_CENTER, 0, -36);
        this.scoreText = this.game.add.bitmapText(0, 0, R.fonts.fedoka.name, "" + this.scoreLogic.score, 48);
        this.scoreText.tint = "0xF9DC07";
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.alignIn(scoreBg, Phaser.CENTER);

        this.bestScoreText = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name,
            this.scoreLogic.getBestScoreText(), 24);
        this.bestScoreText.tint = "0xF9DC07";
        this.bestScoreText.align = "center";
        this.bestScoreText.anchor.setTo(0.5, 0.5); // если так не делать - при обновлении текста сместится выравнивание
        this.bestScoreText.alignTo(scoreBg, Phaser.BOTTOM_CENTER, 0, 4);

        this.settingsButton = buttonBuilder.settingsButton(0, 0, this.onSettingsClick, this);
        this.settingsButton.alignTo(scoreBg, Phaser.RIGHT_CENTER, 12, 0);

        this.newgameButton = buttonBuilder.newGameButton(0, 0, this.onNewGameClick, this);
        this.newgameButton.alignTo(scoreBg, Phaser.LEFT_CENTER, 12, 0);


        this.bejeweledComponent = this.addBejeweled();
        this.addBejeweledLogic(this.bejeweledComponent);

        var snow1 = this.game.add.image(0, -10, R.images.overlay.snowTop.page, R.images.overlay.snowTop.name);
        var snow2 = this.game.add.image(0, 0, R.images.overlay.snowBottom.page, R.images.overlay.snowBottom.name);
        snow2.alignIn(bg, Phaser.BOTTOM_CENTER);

        this.effectManager = new EffectManager(this.game, this.bejeweledComponent);

        //this.hintButton = buttonBuilder.hintButton(0, 0, this.onHintButtonClick, this);
        //this.hintButton = buttonBuilder.hintButton(0, 0, this.onGameOver, this);
        this.hintButton = buttonBuilder.hintButton(0, 0, this.showLanguagePopup, this);
        this.hintButton.alignTo(this.bejeweledComponent.rootView, Phaser.BOTTOM_CENTER, 0, 20);
        this.hintButton.kill(); // прячем до начала игры

        this.addSettingsPopup();
        this.addGameOverPopup();
        this.addScoreTablePopup();
        this.addLanguagePopup();

        this.showStart();
        Sound.playMusic();
    };

    this.addImage = function (x, y, image) {
        return this.game.add.image(x, y, image.page, image.name);
    };

    this.showStart = function () {
        this.lockUi(true);
        var startPopup = new StartPopup(this.game).setNewGameCallBack(this.onStartGameClick, this).show();
    };

    this.addSettingsPopup = function () {
        this.settingsPopup = new SettingsPopup(this.game)
            .setNewGameCallBack(this.onNewGameClick, this)
            .setScoreTableCallBack(this.onScoreButtonClick, this)
            .setOnHideCallback(this.onSettingsHide, this);
        this.settingsPopup.rootView.alignIn(this.game.world, Phaser.CENTER);
    };

    this.addGameOverPopup = function () {
        this.gameOverPopup = new GameOverPopup(this.game, this.scoreRepository)
            .setNewGameCallBack(this.onNewGameClick, this)
            .alignIn(this.game.world, Phaser.CENTER)
            .hide();
    };

    this.addScoreTablePopup = function () {
        this.scoreTablePopup = new ScoreTablePopup(this.game, this.scoreRepository)
            .setBackCallBack(this.onResumeClick, this)
            .alignIn(this.game.world, Phaser.CENTER)
            .hide();
    };

    this.addLanguagePopup = function () {
        this.languagePopup = new LanguagePopup(this.game)
            .setOnHideCallback(this.onLanguagePopupHide, this)
            .alignIn(this.game.world, Phaser.CENTER)
            .hide();
    };

    this.showLanguagePopup = function () {
        this.lockUi(true);
        this.languagePopup.show();
    };

    this.onLanguagePopupHide = function (selectedLocale) {
        this.lockUi(false);
        if(Locale.currentLocale === selectedLocale) return;

        Locale.setLocale(selectedLocale); // установка нового языка
        this.game.state.start(States.START_SCREEN); // перезапуск окна
    };



    this.addBejeweled = function () {
        var bejeweledComponent = new BejeweledGroup(this.game, this.COLUMNS, this.ROWS, this.GRIDSTEP);
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
            me.scoreLogic.onHint(solution);
            me.scoreText.setText(me.scoreLogic.score);
        };
        // начало взрыва камня
        bejeweledComponent.callbacks.blastStart = function (blastedJewels) {
            me.effectManager.blast(blastedJewels);

            Sound.playSound(Sound.BLAST);
            me.scoreLogic.onCombo(blastedJewels);
            me.scoreText.setText(me.scoreLogic.score);
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
            me.onGameOver();
        };
    };


    this.onGameOver = function () {
        this.lockUi(true);
        this.gameOverPopup.show(this.scoreLogic.score);
    };

    this.onSettingsClick = function () {
        if (this.isUiLocked) return;
        this.lockUi(true);
        this.settingsPopup.show();
    };

    this.onStartGameClick = function () {
        this.hintButton.revive(); // показываем кнопку подсказки
        this.onResumeClick();
    };

    this.onScoreButtonClick = function () {
        this.lockUi(true);
        this.scoreTablePopup.show(); // показываем кнопку подсказки
    };

    this.onHintButtonClick = function () {
        if (this.isUiLocked) return;
        this.bejeweledComponent.showHint();
    };

    this.onNewGameClick = function () {
        this.lockUi(false);
        this.scoreLogic.onNewGame();
        // this.score = 0;
        this.scoreText.setText(this.scoreLogic.score);
        this.bestScoreText.setText(this.scoreLogic.getBestScoreText());

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
        if (lock) this.hintButton.kill(); else this.hintButton.revive();
        this.bejeweledComponent.lockUiGlobal(lock);
    };
}