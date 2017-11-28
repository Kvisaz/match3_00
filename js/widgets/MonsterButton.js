/**
 * Created by Work on 25.11.2017.
 *
 *  Кнопка монстра
 *    иконки монстров должны лежать в одном атласе/текстуре
 *    текстуры фонов должны лежать в одном атласе/текстуре (можно другом)
 */

function MonsterButton(game) {

    var ICON_CENTER_X = 56;
    var ICON_CENTER_Y = 64;

    var SHADOW_BAR_WIDTH = 516;
    var SHADOW_BAR_HEIGHT = 4;
    var HEALTH_BAR_WIDTH = 370;
    var HEALTH_BAR_HEIGHT = 8;
    var TMP_STR = "Some Monster";

    this.isLocked = false;
    this.isAlive = true;


    this.data = new MonsterData();

    this.view = { // у всех позиции должны быть одинаковыми нулевыми. Не нуль - смещение относительно родительского элемента
        // которым будет bg
        bg: game.add.image(0, 0, R.img.MonsterButtons.bgPage, R.img.MonsterButtons.bgArray[0]),
        shadow: ImageBuilder.createRectangleImage(game, 0, 0, SHADOW_BAR_WIDTH, SHADOW_BAR_HEIGHT,
            R.colors.SHADOW_BAR,
            R.img.Cache.MONSTER_SHADOW_BAR),
        icon: game.add.image(0, 0, R.img.MonsterButtons.iconPage,
            R.img.MonsterButtons.iconArray[this.data.monsterSetNumber][this.data.iconNumber]),
        nameText: game.add.text(0, 0, this.data.name, R.style.monsterTitle),
        descText: game.add.text(0, 0, this.data.desc, R.style.monsterDesc),
        levelText: game.add.text(0, 0, this.getFormattedLevelLabel(), R.style.monsterDesc),
        healthBarBg: ImageBuilder.createRectangleImage(game, 0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT,
            R.colors.PROGRESS_BAR_BG,
            R.img.Cache.MONSTER_HEALTH_BG),
        healthBarKnob: ImageBuilder.createRectangleImage(game, 0, 0, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT,
            R.colors.HEALTH_BAR,
            R.img.Cache.MONSTER_HEALTH_BAR),
        healthBarText: game.add.text(0, 0, this.data.amount, R.style.monsterHealthBar)
    };

    this.viewData = {
        idleY: 0,
        deltaY: 4,
        pressedY: 4
    };

    this.callbacks = {
        onClick: undefined,
        onClickContext: undefined,
        onDie: undefined,
        onDieContext: undefined
    };

    // равняем элементы healthbar
    this.view.healthBarKnob.alignIn(this.view.healthBarBg, Phaser.TOP_LEFT);
    this.view.healthBarText.alignTo(this.view.healthBarBg, Phaser.TOP_RIGHT,  0, -4);
    this.view.healthBarText.anchor.setTo(1,0);
    this.view.levelText.alignTo(this.view.healthBarBg, Phaser.TOP_LEFT, 0, -4);
    this.view.levelText.anchor.setTo(0,0);

    // элементы индикатора группируются около его бэкграунда
    this.view.healthBarBg.addChild(this.view.healthBarKnob);
    this.view.healthBarBg.addChild(this.view.healthBarText);
    this.view.healthBarBg.addChild(this.view.levelText);

    // позиционируем все элементы
    // все координаты - относительно главного бэка, верхнего левого угла
    this.view.healthBarBg.x = 116;
    this.view.healthBarBg.y = 104;

    this.view.nameText.x = 112;
    this.view.nameText.y = 15;

    this.view.descText.x = 116;
    this.view.descText.y = 51;

    this.view.icon.anchor.setTo(0.5, 0.5);  // теперь x,y будут задавать координаты центра
    this.view.icon.x = ICON_CENTER_X;
    this.view.icon.y = ICON_CENTER_Y;

    this.view.shadow.alignTo(this.view.bg, Phaser.BOTTOM_LEFT);

    // главный элемент - общий бэкграунд
    this.view.bg.addChild(this.view.shadow);
    this.view.bg.addChild(this.view.icon);
    this.view.bg.addChild(this.view.nameText);
    this.view.bg.addChild(this.view.descText);
    this.view.bg.addChild(this.view.healthBarBg);
    this.view.bg.addChild(this.view.healthBarBg);

    this.view.bg.inputEnabled = true;
    this.view.bg.events.onInputDown.add(this.onInputDown, this);
    this.view.bg.events.onInputUp.add(this.onInputUp, this);
}

MonsterButton.prototype.getFormattedLevelLabel = function () {
    return R.strings.en.monsterLevelLabel + " " + this.data.level;
};

MonsterButton.prototype.setClickCallback = function (callback, context) {
    this.callbacks.onClick = callback;
    this.callbacks.onClickContext = context;
    return this;
};

MonsterButton.prototype.setDieCallback = function (callback, context) {
    this.callbacks.onDie = callback;
    this.callbacks.onDieContext = context;
    return this;
};

MonsterButton.prototype.setXY = function (x, y) {
    this.view.bg.x = x;
    this.view.bg.y = y;
    this.viewData.idleY = y;
    this.viewData.pressedY = y + this.viewData.deltaY;
    return this;
};

MonsterButton.prototype.onInputDown = function (object, pointer) {
    if(this.isLocked) return;
    this.view.bg.y = this.viewData.pressedY;
    this.view.shadow.alpha = 0;
    if (this.callbacks.onClick) {
        this.callbacks.onClick.call(this.callbacks.onClickContext,
            this.data,
            pointer.x, pointer.y); // передаем глобальному коллбэку информацию о монстре и точке нажатия
    }
};

MonsterButton.prototype.onInputUp = function () {
    if(this.isLocked) return;
    this.view.bg.y = this.viewData.idleY;
    this.view.shadow.alpha = 1;
};

MonsterButton.prototype.refreshHealthView = function () {
    this.view.healthBarText.setText("" + this.data.health + " / " + this.data.totalHealth);
    this.view.healthBarKnob.scale.setTo(this.data.health / this.data.totalHealth, 1);
};

MonsterButton.prototype.refreshView = function () {
    this.view.nameText.setText(this.data.name);
    this.view.descText.setText(this.data.desc);
    this.view.levelText.setText(this.getFormattedLevelLabel());

    this.view.icon.setFrames(R.img.MonsterButtons.iconArray[this.data.monsterSetNumber][this.data.iconNumber]);
    this.refreshHealthView();
};

// также делается небольшая анимация хелсбара
MonsterButton.prototype.setDamage = function (damage) {
    this.data.health -= damage;
    if(this.data.health<0) {
        this.data.health = 0;
    }
    this.refreshHealthView();
    if(this.isAlive && this.data.health === 0){
        this.isAlive = false;
        this.onDie();
    }

    return this;
};

MonsterButton.prototype.setHealth = function (health) {
    this.data.health = health;
    this.refreshHealthView();
    return this;
};

MonsterButton.prototype.setTotalHealth = function (health) {
    this.data.totalHealth = health;
    this.refreshHealthView();
    return this;
};

MonsterButton.prototype.setData = function (monsterData) {
    this.data = monsterData;
    this.refreshHealthView();
    return this;
};

MonsterButton.prototype.lock = function (locked) {
    this.isLocked = locked;
    this.view.bg.alpha = locked ? 0.5 : 1;
    return this;
};

MonsterButton.prototype.onDie = function () {
    this.lock(true);
    if(this.callbacks.onDie){
        this.callbacks.onDie.call(this.callbacks.onDieContext, this.data);
    }
};
