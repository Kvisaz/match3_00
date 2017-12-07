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

MainClickUiBuilder.prototype.settingsButton = function (x, y, callback, context) {
    return this.game.add.button(x, y, R.images.buttons.settingsIdle.page, callback, context, R.images.buttons.settingsIdle.name, R.images.buttons.settingsIdle.name, R.images.buttons.settingsPressed.name, R.images.buttons.settingsIdle.name);
};