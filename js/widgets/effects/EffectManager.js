/**
 * Created by Work on 09.12.2017.
 *
 * Менеджер эффектов,
 * создает анимации взрывов для уровня
 *
 */

function EffectManager(game, bejeweledView) {
    this.game = game;
    var x,y,row, col, explosion, explosions = [];
    bejeweledView.group.forEach(function (jewelView) {
        explosion = new Explosion(game).setOnObject(jewelView);
        // корректировка с учетом позиции группы
        explosion.rootView.x += bejeweledView.group.x;
        explosion.rootView.y += bejeweledView.group.y;
        col = jewelView.model.column;
        row = jewelView.model.row;
        if (explosions[col] === undefined) {
            explosions[col] = [];
        }
        explosions[col][row] = explosion;
    });
    this.explosions = explosions;
}

EffectManager.prototype.blast = function (blastedCombos) {
    var i, j, jewelModel, blastedJewelModels, length, combosLength = blastedCombos.length;
    for (i = 0; i < combosLength; i++) {
        blastedJewelModels = blastedCombos[i];
        length = blastedJewelModels.length;
        for (j = 0; j < length; j++) {
            jewelModel = blastedJewelModels[j];
            console.log("jewelModel = " + jewelModel.column + " / " + jewelModel.row);
            this.explosions[jewelModel.column][jewelModel.row].play();
        }
    }
};