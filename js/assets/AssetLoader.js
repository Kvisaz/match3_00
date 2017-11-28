/**
 *  Загрузка разных ассетов
 */
var AssetLoader = {};

AssetLoader.loadPages = function (game, atlasPages) {
    var i, fullname, page;
    for(i=0;i<atlasPages.length;i++){
        page = atlasPages[i];
        fullname = R.dir.atlas + "/" + page;
        game.load.atlas(page, fullname + ".png", fullname + ".json");
    }
};

AssetLoader.preload = function (game) {
    // загрузка атласов
    this.loadPages(game, R.atlas.common);
};
