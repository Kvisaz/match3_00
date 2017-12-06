/**
 * Created by Work on 16.11.2017.
 */

function MainClickState() {
    this.create = function () {
        console.log("MainClickState create");

        var level = new BejeweledGroup(this.game, 8, 8);
        level.group.alignIn(this.game.world, Phaser.CENTER);

        level.callbacks.swap = function (jewel1, jewel2, hasCombo) {
            console.log("level.callbacks.swap / jewel1 = "+ jewel1.column + " / " + jewel1.row );
            console.log("level.callbacks.swap / jewel2 = "+ jewel2.column + " / " + jewel2.row );
            console.log("level.callbacks.swap / hasCombo = "+hasCombo);
        };
        level.callbacks.levelGenerated = function () {
            console.log("level.callbacks.levelGenerated");
        };
        // показали подсказку {hint: jewel2, target: jewel1, length: comboLength}
        level.callbacks.hintShown = function (solution) {
            console.log("level.callbacks.hintShown");
        };
        // начало взрыва камня
        level.callbacks.singleBlastStart = function (jewel) {
            console.log("level.callbacks.singleBlastStart  / jewel = " + jewel.column  + "/ " + jewel.row);
        };
        // конец взрыва всех камней
        level.callbacks.totalBlastFinish = function () {
            console.log("level.callbacks.totalBlastFinish");
        };
        // начало падения камня
        level.callbacks.singleFallStart = function (jewel) {
            console.log("level.callbacks.singleFallStart");
        };

        // окончание падения камня
        level.callbacks.singleFallFinish = function (jewel) {
            console.log("level.callbacks.singleFallFinish");
        };
        // генерация нового камня
        level.callbacks.singleBornStart = function (jewel) {
            console.log("level.callbacks.singleBornStart");
        };
        // нет больше ходов
        level.callbacks.noMoves = function () {
            console.log("level.callbacks.noMoves");
        };

    };
}