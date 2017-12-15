/**
 * Created by Work on 09.12.2017.
 */

function LanguagePopup(game) {
    this.game = game;
    this.bg = game.add.image(0, 0, R.images.ui.popupBg.page, R.images.ui.popupBg.name);

    this.localeManager = Locale;
    this.selectedLocale = this.localeManager.currentLocale;
    this.addLayout();

    this.rootView = this.bg; // для ссылки снаружи
    this.rootView.alignIn(game.world, Phaser.CENTER, 0, -20);
    this.hide(); // по умолчанию не показываем
}

LanguagePopup.prototype.alignIn = function (t, e, s, n) {
    this.rootView.alignIn(t, e, s, n);
    return this;
};

LanguagePopup.prototype.alignTo = function (t, e, s, n) {
    this.rootView.alignTo(t, e, s, n);
    return this;
};

LanguagePopup.prototype.show = function () {
    this.rootView.revive();
    this.game.world.bringToTop(this.rootView);
    return this;
};

LanguagePopup.prototype.hide = function () {
    this.rootView.kill();
    return this;
};

LanguagePopup.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

LanguagePopup.prototype.onOkButtonClick = function () {
    this.hide();
    if (this.onHideCallback) {
        this.onHideCallback.call(this.onHideCallbackContext, this.selectedLocale);
    }
};

LanguagePopup.prototype.setOnHideCallback = function (callback, context) {
    this.onHideCallback = callback;
    this.onHideCallbackContext = context;
    return this;
};

LanguagePopup.prototype.selectLocale = function (locale) {
    this.selectedLocale = locale;
    var selected = false;
    this.menuGroup.forEach(function (menuItemRootView) {
        selected = menuItemRootView.menuItem.locale === locale;
        menuItemRootView.menuItem.select(selected);
    });
};

LanguagePopup.prototype.addLayout = function () {
    var snowTop = this.game.add.image(0, 0, R.images.ui.snowTopping.page, R.images.ui.snowTopping.name);
    snowTop.alignIn(this.bg, Phaser.TOP_CENTER, 0, 14);
    this.bg.addChild(snowTop);

    var CURSOR_WIDTH = 256;
    var CURSOR_HEIGHT = 42;
    var Y_STEP = 56;
    var FONT_SIZE = 32;
    var BG_COLOR = "#C8ECEA";

    this.menuGroup = this.game.add.group();
    for (var localeName in this.localeManager.locales) {
        var locale = this.localeManager.locales[localeName];
        if (locale && locale.label) {
            var menuItem = new LanguageMenuItem(this.game, locale)
                .setCallback(this.selectLocale, this);
            this.menuGroup.add(menuItem.rootView);
        }
    }

    this.menuGroup.align(1, -1, 0, Y_STEP);
    this.menuGroup.alignIn(this.bg, Phaser.TOP_CENTER, 0, -60);

    this.bg.addChild(this.menuGroup);

    this.selectLocale(Locale.currentLocale);

    var buttonBuilder = ButtonBuilder;
    this.startButton = buttonBuilder.bigGreenButton(this.onOkButtonClick, this, Locale.strings.ok);
    this.startButton.alignIn(this.bg, Phaser.BOTTOM_CENTER, 0, 28);
    this.bg.addChild(this.startButton);
};