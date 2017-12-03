/**
 * Created by Work on 29.11.2017.
 *
 * проверщик на свайп
 */

function Swipe(distance) {
    this.started = false;
    this.directions = Directions;
    this.SENS_DISTANCE = distance;
    this.distance = {x: 0, y: 0, total: 0};
    this.direction = this.directions.NONE;
}

Swipe.prototype.start = function (x, y) { // применять при нажатии
    this.x = x;
    this.y = y;
    this.started = true;
};

Swipe.prototype.check = function (x, y) { // применять при отпускании
    if(this.started == false) return false;
    this.distance.x = x - this.x;
    this.distance.y = y - this.y;
    this.distance.total = Math.sqrt(Math.pow(this.distance.x, 2) + Math.pow(this.distance.y, 2));
    if (this.distance.total  < this.SENS_DISTANCE) { // меньше сенсы
        this.direction = this.directions.NONE;
        return false;
    }
    if (Math.abs(this.distance.x) > Math.abs(this.distance.y)) { // horizontal
        this.direction = this.distance.x > 0 ? this.directions.RIGHT : this.directions.LEFT;
    }
    else { // vertical
        this.direction = this.distance.y > 0 ? this.directions.DOWN : this.directions.UP;
    }
    this.started = false;
    return true;
};