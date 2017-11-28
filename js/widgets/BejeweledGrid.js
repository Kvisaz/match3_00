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


    this.selectedJewel = undefined;
    this.swapJewel = undefined;

    var col, row, jewel, jewelType;
    for (col = 0; col < cols; col++) {
        this.jewels[col] = [];
        for (row = 0; row < rows; row++) {
            jewelType = Math.floor(Math.random() * this.COLORS_AMOUNT);
            jewel = JewelGenerator.createJewel(game, jewelType); // jewelType сохраняется как поле в jewel
            jewel.jewelType = jewelType;
            jewel.jewelCol = col;
            jewel.jewelRow = row;
            this.group.add(jewel);
            this.jewels[col][row] = jewel;
        }
    }

    var size = this.group.getChildAt(0).width;
    var GAP = 2;
    this.group.align(cols, rows, size + GAP, size + GAP);


    this.cursor = ImageBuilder.createStrokedRectangleImage(game, 0, 0,
        this.CURSOR_SIZE,
        this.CURSOR_SIZE,
        "#00ffff",
        "cursor", 6);
    this.cursor.kill();
    this.group.add(this.cursor);

    this.group.onChildInputDown.add(this.onDown, this);

    /*
     var me = this;
     this.group.forEach(function(jewel){
     jewel.inputEnabled=true;
     jewel.input.enableDrag();

     jewel.events.onInputDown.add(me.onDown);

     // functions
     /!*jewel.events.onDragStart.add(startDrag, this);
     jewel.events.onDragStop.add(stopDrag, this);*!/
     })
     */
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    console.log("onDown on jewel " + jewel.jewelType);
    console.log("row " + jewel.jewelRow);
    console.log("jewelCol " + jewel.jewelCol);
    if (jewel.jewelType !== undefined) {
        this.select(jewel);
    }
    else {
        this.unselect(jewel);
    }

};

BejeweledGroup.prototype.isNear = function (jewel1, jewel2) {
    var diag = Math.abs(jewel1.jewelCol - jewel2.jewelCol) == 1 && Math.abs(jewel1.jewelRow - jewel2.jewelRow) == 1;
    var near = Math.abs(jewel1.jewelCol - jewel2.jewelCol) == 1 || Math.abs(jewel1.jewelRow - jewel2.jewelRow) == 1;

    return near && !diag;
};

BejeweledGroup.prototype.select = function (jewel) {
    if (this.selectedJewel && this.isNear(this.selectedJewel, jewel)) { // проверка на соседство
        // swap
        console.log("SWAP!");
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