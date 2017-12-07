/**
 *  Preloader отвечает за
 *       - загрузку ассетов для игры
 *       - запуск первого
 */

function Preloader(assetLoader) {
    this.preload = function () {
        PhaserConfig.exe(this.game);
        assetLoader.preload(this.game); // загрузка ассетов - смотри R и AssetLoader
    };
    this.create = function () {
        document.getElementById(AppConfig.preloaderId).remove(); // убираем лого загрузчика
        this.game.state.start(States.START_SCREEN);
    }
}