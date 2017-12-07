/**
 *   Application
 *   Общий абстрактный модуль для запуска всех Phaser-игр / приложений
 *
 *   указывает states - загрузчик, прелоадер и первую сцену игры
 *   аргументы - их массив, порядок в массиве означает порядок переходов
 *
 *   каждый аргумент = { name: "boot", state: new BootState() } - к примеру
 */
var App = function (states) {
    var game = new Phaser.Game(AppConfig.width, AppConfig.height, Phaser.CANVAS, AppConfig.canvasId);

    var current, next, i = 0, length = states.length;
    for (i = 0; i < length; i++) {
        current = states[i];
        game.state.add(current.name, current.state);
    }


    ImageBuilder.init(game); // передаем ссылку нашей библиотеке для построения картинок
    game.state.start(States.PRELOADER); // запускаем загрузчик
};

new App([
    {name: States.PRELOADER, state: new Preloader(AssetLoader)}, // загрузчик всех остальных картинок
    {name: States.START_SCREEN, state: new MainClickState() } // запуск нашей игры
]);