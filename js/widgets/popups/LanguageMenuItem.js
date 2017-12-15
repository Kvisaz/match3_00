/**
 * Created by Work on 15.12.2017.
 *
 * кнопки для меню выбора языков
 */

function LanguageMenuItem(game, locale) {
    var WIDTH = 256;
    var HEIGHT = 52;
    var CURSOR_PADDING = 2;
    var FONT_SIZE = 36;
    var BG_COLOR = "#C8ECEA";
    this.DEFAULT_TINT = "0x1E396C";
    this.SELECTED_TINT = "0xFFFFFF";

    this.locale = locale; // ссылка на локаль из массива внутри LocaleManager

    this.game = game;

    // основа - белый прямоугольник
    this.rootView = ImageBuilder.rect(0, 0, WIDTH, HEIGHT, BG_COLOR);
    this.rootView.menuItem = this;

    // добавляем ему обработчик нажатий
    this.rootView.inputEnabled = true;
    this.rootView.events.onInputDown.add(this.onInputDown, this);

    // синий прямоугольник - появляется поверх при выделении
    this.cursorImage = this.game.add.image(0, 0, R.images.field.bg9.page, R.images.field.bg9.name);
    this.cursorImage.refresh9slice(WIDTH+CURSOR_PADDING, HEIGHT+CURSOR_PADDING);
    this.cursorImage.alignIn(this.rootView, Phaser.CENTER);
    this.rootView.addChild(this.cursorImage);

    // текст - при выделении будет менять TINT (см. LanguageMenuItem.prototype.select)
    var text = this.locale.label;
    this.textLabel = game.add.bitmapText(0, 0, R.fonts.robotoBold.name, text, FONT_SIZE);
    this.textLabel.tint = this.DEFAULT_TINT;
    this.textLabel.alignIn(this.rootView, Phaser.CENTER, 0, -4);
    this.rootView.addChild(this.textLabel);
}

LanguageMenuItem.prototype.alignIn = function (t, e, s, n) {
    this.rootView.alignIn(t, e, s, n);
    return this;
};

LanguageMenuItem.prototype.alignTo = function (t, e, s, n) {
    this.rootView.alignTo(t, e, s, n);
    return this;
};

LanguageMenuItem.prototype.show = function () {
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
    return this;
};

LanguageMenuItem.prototype.hide = function () {
    this.rootView.kill();
    return this;
};

LanguageMenuItem.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

LanguageMenuItem.prototype.setCallback = function (callback, context) {
    this.globalCallback = callback;
    this.globalContext = context;
    return this;
};

// при нажатии на пункт меню - передаем функции текущую locale кнопки
LanguageMenuItem.prototype.onInputDown = function () {
    if (this.globalCallback) {
        this.globalCallback.call(this.globalContext, this.locale);
    }
};

LanguageMenuItem.prototype.select = function (select) {
    this.cursorImage.alpha = select ? 1 : 0;
    this.textLabel.tint = select ? this.SELECTED_TINT : this.DEFAULT_TINT;
};