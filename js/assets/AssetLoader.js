/**
 *  Загрузка разных ассетов
 */
var AssetLoader = {};

AssetLoader.loadPages = function (atlasPages) {
    var i, fullname, page;
    for(i=0;i<atlasPages.length;i++){
        page = atlasPages[i];
        fullname = R.dir.atlas + "/" + page;
        this.game.load.atlas(page, fullname + ".png", fullname + ".json");
    }
};

AssetLoader.loadBitmapFont = function (font) {
    this.game.load.bitmapFont(font.name, R.dir.atlas + "/" +font.png, R.dir.atlas + "/" +font.xml);
};

// для name и filename Отдельных картинок используй их файловое имя
AssetLoader.loadImage = function (filename) {
    this.game.load.image(filename, R.dir.atlas + "/" +filename);
};

AssetLoader.preload = function (game) {
    this.game = game;
    this.loadBitmapFont(R.fonts.fedoka);
    this.loadPages(R.atlas.common); // загрузка атласов
    this.loadImage(R.images.bg.cristmas);
};
