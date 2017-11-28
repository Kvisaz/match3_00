/**
 * Created by Work on 16.11.2017.
 *
 * MainClickUiBuilder - строитель элементов интерфейса
 * его задача просто сконфигурировать и вернуть нам готовые реализации
 * в указанных координатах
 *
 * Билдер-строитель отвечает только за внешний вид, размеры и сущность возвращаемого объекта
 * мы передаем ему координаты - он  создает элемент там
 *
 * Каждый метод билдер возвращает ссылку на созданный / добавленный объект
 */

function MainClickUiBuilder(game) {
    this.game = game;
}

MainClickUiBuilder.prototype.bg = function (x, y) {
    return ImageBuilder.createRectangleImage(this.game, x, y, AppConfig.width, AppConfig.height, R.colors.BG_DARK);
};

MainClickUiBuilder.prototype.levelBar = function (x, y) {
    return new UiLevelBar(this.game).setXY(x, y);
};

MainClickUiBuilder.prototype.healthPotions = function (x, y) {
    return new UiHealthPotion(this.game).setXY(x, y);
};

MainClickUiBuilder.prototype.coins = function (x, y) {
    return new UiCoin(this.game).setXY(x, y);
};

MainClickUiBuilder.prototype.healthBar = function (x, y) {
    return new UiHealthBar(this.game).setXY(x, y);
};

MainClickUiBuilder.prototype.monsterButton = function (x, y) {
    return new MonsterButton(this.game).setXY(x, y);
};

MainClickUiBuilder.prototype.monsterDeathEffect = function (x, y) {
    return new MonsterDeathEffect(this.game, 516, 132).setXY(x, y);
};