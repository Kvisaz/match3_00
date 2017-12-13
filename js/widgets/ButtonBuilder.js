/**
 * Created by Work on 16.11.2017.
 *
 * ButtonBuilder - строитель элементов интерфейса
 * его задача просто сконфигурировать и вернуть нам готовые реализации
 * в указанных координатах
 *
 * Билдер-строитель отвечает только за внешний вид, размеры и сущность возвращаемого объекта
 * мы передаем ему координаты - он  создает элемент там
 *
 * Каждый метод билдер возвращает ссылку на созданный / добавленный объект
 */

var ButtonBuilder = {};
ButtonBuilder.init = function (game) {
    this.game = game;
};


ButtonBuilder.newButton = function (x, y, callback, context, idleFramePage, idleFrameName, pressedFrameName) {
    return this.game.add.button(x, y, idleFramePage,
        callback, context,
        idleFrameName, idleFrameName,
        pressedFrameName,
        idleFrameName);
};

ButtonBuilder.settingsButton = function (x, y, callback, context) {
    return this.newButton(x, y, callback, context,
        R.images.buttons.settingsIdle.page,
        R.images.buttons.settingsIdle.name,
        R.images.buttons.settingsPressed.name);
};

ButtonBuilder.newGameButton = function (x, y, callback, context) {
    return this.newButton(x, y, callback, context,
        R.images.buttons.replayIdle.page,
        R.images.buttons.replayIdle.name,
        R.images.buttons.replayPressed.name);
};

ButtonBuilder.hintButton = function (x, y, callback, context) {
    var button = this.newButton(x, y, callback, context,
        R.images.buttons.midGreenIdle.page,
        R.images.buttons.midGreenIdle.name,
        R.images.buttons.midGreenPressed.name);

    var text = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.hintButton, 32);
    text.anchor.setTo(0.5, 0.5);
    text.alignIn(button, Phaser.CENTER);
    button.addChild(text);
    return button;
};

ButtonBuilder.restartGameOverButton = function (x, y, callback, context) {
    var button = this.newButton(x, y, callback, context,
        R.images.buttons.bigGreenIdle.page,
        R.images.buttons.bigGreenIdle.name,
        R.images.buttons.bigGreenPressed.name);

    var text = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, R.strings.en.gameoverRestartButton, 32);
    text.anchor.setTo(0.5, 0.5);
    text.alignIn(button, Phaser.CENTER);
    button.addChild(text);
    return button;
};