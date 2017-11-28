/**
 * Created by Work on 28.11.2017.
 */

function BejeweledGroup(game, cols, rows) {
    this.group = game.add.group();
    this.group.inputEnableChildren = true; // имеет значение ДО добавления в группу

    this.cols = cols;
    this.rows = rows;
    this.COLORS_AMOUNT = 8;
    this.JEWEL_SIZE = 64;
    this.CURSOR_SIZE = 66;
    this.GRID_STEP = 66;

    this.selectedJewel = undefined;
    this.isSwapping = false;
    this.swipe = new Swipe(this.GRID_STEP);

    var col, row, jewel, jewelType;
    for (col = 0; col < cols; col++) {
        for (row = 0; row < rows; row++) {
            jewelType = Math.floor(Math.random() * this.COLORS_AMOUNT);
            jewel = JewelGenerator.createJewel(game, jewelType); // jewelType сохраняется как поле в jewel
            jewel.jewelType = jewelType;
            jewel.tweenTarget = {x: 0, y: 0};
            jewel.tween = game.add.tween(jewel);
            jewel.tween.to(jewel.tweenTarget, 250);
            this.group.add(jewel);
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
    game.input.onUp.add(this.onUp, this);
}

BejeweledGroup.prototype.setXY = function (x, y) {
    this.group.x = x;
    this.group.y = y;
    return this;
};

BejeweledGroup.prototype.onUp = function (pointer) {
    if (this.isSwapping || this.selectedJewel === undefined) return;

    if (this.swipe.check(pointer.x, pointer.y) == false) return;
    var jewel1 = this.selectedJewel;
    this.unselect();
    var jewel2 = this.selectNear(jewel1, this.swipe.direction);
    this.swap(jewel1, jewel2);
};

BejeweledGroup.prototype.selectNear = function (jewel, direction) {
    var target;
    switch (direction) {
        case this.swipe.directions.LEFT:
            target = {x: jewel.x - this.GRID_STEP, y: jewel.y};
            break;
        case this.swipe.directions.UP:
            target = {x: jewel.x, y: jewel.y - this.GRID_STEP};
            break;
        case this.swipe.directions.RIGHT:
            target = {x: jewel.x + this.GRID_STEP, y: jewel.y};
            break;
        case this.swipe.directions.DOWN:
            target = {x: jewel.x, y: jewel.y + this.GRID_STEP};
            break;
    }

    var i, jewel2;
    for(var i=0;i<this.group.children.length;i++){
        jewel2 = this.group.children[i];
        if(jewel2.jewelType === undefined) continue;
        if (jewel2.x == target.x && jewel2.y == target.y) {
            console.log("Near got!");
            return jewel2;
        }
    }
    return undefined;
};

BejeweledGroup.prototype.onDown = function (jewel, pointer) {
    if (this.isSwapping) return;
    this.swipe.start(pointer.x, pointer.y);
    var col = Math.floor(jewel.x / this.GRID_STEP);
    var row = Math.floor(jewel.y / this.GRID_STEP);
    if (jewel.jewelType !== undefined) {
        this.select(jewel);
    }
    else {
        this.unselect();
    }

};

BejeweledGroup.prototype.isNear = function (jewel1, jewel2) {
    var col1 = Math.floor(jewel1.x / this.GRID_STEP);
    var row1 = Math.floor(jewel1.y / this.GRID_STEP);

    var col2 = Math.floor(jewel2.x / this.GRID_STEP);
    var row2 = Math.floor(jewel2.y / this.GRID_STEP);

    var diag = Math.abs(col1 - col2) == 1 && Math.abs(row1 - row2) == 1;
    var near = Math.abs(col1 - col2) <= 1 && Math.abs(row1 - row2) <= 1;

    return near && !diag;
};

BejeweledGroup.prototype.select = function (jewel) {
    if (this.selectedJewel && this.isNear(this.selectedJewel, jewel)) { // проверка на соседство
        // swap
        var selectedJewel = this.selectedJewel;
        this.unselect();
        this.swap(selectedJewel, jewel);
    }
    else { // select new
        this.selectedJewel = jewel;
        this.cursor.alignIn(jewel, Phaser.CENTER);
        this.cursor.revive();
    }

};

BejeweledGroup.prototype.unselect = function () {
    this.selectedJewel = undefined;
    this.cursor.kill();
};

BejeweledGroup.prototype.swap = function (jewel1, jewel2) {
    console.log("SWAP!");
    this.isSwapping = true; // блокируем ввод
    jewel2.tweenTarget.x = jewel1.x;
    jewel2.tweenTarget.y = jewel1.y;

    jewel1.tweenTarget.x = jewel2.x;
    jewel1.tweenTarget.y = jewel2.y;

    jewel1.tween.start();
    jewel2.tween.start();
    jewel2.tween.onComplete.add(function () {
        var tmpCol = jewel2.jewelRow;
        var tmpRow = jewel2.jewelCol;

        jewel2.jewelCol = jewel1.jewelCol;
        jewel2.jewelRow = jewel1.jewelRow;

        jewel1.jewelCol = tmpCol;
        jewel1.jewelRow = tmpRow;

        this.isSwapping = false; // разблокируем ввод
    }, this);
};