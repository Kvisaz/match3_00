/**
 *  Preloader отвечает за
 *       - загрузку ассетов для игры
 *       - запуск первого
 */

function Preloader(assetLoader) {
    this.preload = function () {
        console.log("Preloader preload");
        PhaserConfig.exe(this.game);
        assetLoader.preload(this.game); // загрузка ассетов - смотри R и AssetLoader
    };
    this.create = function () {
        console.log("Preloader create");
        document.getElementById(AppConfig.preloaderId).style.display = "none"; // убираем лого загрузчика
        this.game.state.start(States.START_SCREEN);
    }
};