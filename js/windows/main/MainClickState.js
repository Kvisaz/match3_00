/**
 * Created by Work on 16.11.2017.
 */

function MainClickState() {
    this.create = function () {
        console.log("MainClickState create");

        var level = new BejeweledGroup(this.game, 8, 8);
        level.group.alignIn(this.game.world, Phaser.CENTER);

    };
}