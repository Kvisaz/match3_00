/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.cols = cols;
    this.rows = rows;
    this.jewels = [];
    this.COLORS_AMOUNT = 8;
    this.JEWEL_SIZE = 64;
    this.CURSOR_SIZE = 66;
    this.GRID_STEP = 66;

    this.selectedJewel = undefined;
    this.swapJewel = undefined;
    this.isSwapping = false;

    var col, row, jewel, jewelType;
    for (col = 0; col < cols; col++) {
        this.jewels[col] = [];
        for (row = 0; row < rows; row++) {
            console.log("col = " + col + " / row = " + row);
            jewelType = Math.floor(Math.random() * this.COLORS_AMOUNT);
            jewel = JewelGenerator.createJewel(game, jewelType); // jewelType сохраняется как поле в jewel
            jewel.jewelType = jewelType;
            jewel.jewelCol = col;
            jewel.jewelRow = row;
            jewel.tweenTarget = {x: 0, y: 0};
            jewel.tween = game.add.tween(jewel);
            jewel.tween.to(jewel.tweenTarget, 250);
            this.group.add(jewel);
            this.jewels[col][row] = jewel;
        }
    }

    var size = this.group.getChildAt(0).width;
    var GAP = 2;
    this.group.align(cols, rows, this.GRID_STEP, this.GRID_STEP);


    this.cursor = ImageBuilder.createStrokedRectangleImage(game, 0, 0,
        this.CURSOR_SIZE,
        this.CURSOR_SIZE,
        "#00ffff",
        "cursor", 6);
    this.cursor.kill();
    this.group.add(this.cursor);

    this.group.onChildInputDown.add(this.onDown, this);
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    if (this.isSwapping) return;

    var col = Math.floor(jewel.x / this.GRID_STEP);
    var row = Math.floor(jewel.y / this.GRID_STEP);

    console.log("onDown on jewel " + jewel.jewelType);
    console.log("jewelCol " + col);
    console.log("row " + row);
    if (jewel.jewelType !== undefined) {
        this.select(jewel);
    }
    else {
        this.unselect(jewel);
    }

};

BejeweledGroup.prototype.isNear = function (jewel1, jewel2) {
    var col1 = Math.floor(jewel1.x / this.GRID_STEP);
    var row1 = Math.floor(jewel1.y / this.GRID_STEP);

    var col2 = Math.floor(jewel2.x / this.GRID_STEP);
    var row2 = Math.floor(jewel2.y / this.GRID_STEP);

    var diag = Math.abs(col1 - col2) == 1 && Math.abs(row1 - row2) == 1;
    var near = Math.abs(col1 - col2) == 1 || Math.abs(row1 - row2) == 1;

    return near && !diag;
};

BejeweledGroup.prototype.select = function (jewel) {
    if (this.selectedJewel && this.isNear(this.selectedJewel, jewel)) { // проверка на соседство
        // swap
        console.log("SWAP!");
        var jewel2 = this.selectedJewel;
        this.unselect();

        this.isSwapping = true; // блокируем ввод
        jewel2.tweenTarget.x = jewel.x;
        jewel2.tweenTarget.y = jewel.y;

        jewel.tweenTarget.x = jewel2.x;
        jewel.tweenTarget.y = jewel2.y;

        jewel.tween.start();
        jewel2.tween.start();
        jewel2.tween.onComplete.add(function () {
            var tmpCol = jewel2.jewelRow;
            var tmpRow = jewel2.jewelCol;

            jewel2.jewelCol = jewel.jewelCol;
            jewel2.jewelRow = jewel.jewelRow;

            jewel.jewelCol = tmpCol;
            jewel.jewelRow = tmpRow;

            this.isSwapping = false; // разблокируем ввод
        }, this);


    }
    else { // select new
        this.selectedJewel = jewel;
        this.cursor.alignIn(jewel, Phaser.CENTER);
        this.cursor.revive();
    }

};

BejeweledGroup.prototype.unselect = function (jewel) {
    this.selectedJewel = undefined;
    this.cursor.kill();
};