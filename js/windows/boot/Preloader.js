/**
 *  Preloader отвечает за
 *       - загрузку ассетов для игры
 *       - запуск первого
 */

function Preloader(assetLoader) {
    this.preload = function () {
        PhaserConfig.exe(this.game);
        ImageBuilder.init(this.game); // передаем ссылку нашей библиотеке для построения картинок
        assetLoader.preload(this.game); // загрузка ассетов - смотри R и AssetLoader
        this.preloaderImage = new PreloaderImage(this.game); //прогрессбар
    };

    this.loadUpdate = function () {
        this.preloaderImage.loadUpdate();
    };

    this.create = function () {
        document.getElementById(AppConfig.preloaderId).style.display = "none"; // убираем лого загрузчика
        // иницализация разных синглтонов
        Sound.init(this.game, Repository); // инициализируем звуковую систему
        ButtonBuilder.init(this.game); // инициализируем билдер кнопок
        ProfitSystem.init(this.game); // инициализируем рекламу
        Locale.autodetectLocale();
        //Locale.setLocale(Locale.RU); // можно менять и в других состояних, но для вступления в силу нужен будет их перезапуска
        document.title = Locale.strings.indexTitle;
        this.game.state.start(States.START_SCREEN);
    }
};