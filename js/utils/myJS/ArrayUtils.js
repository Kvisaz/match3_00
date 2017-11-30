/**
 * Created by Work on 29.11.2017.
 */

// выдать случайный
Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random()*this.length)];
};

// перемешать этот массив
Array.prototype.shuffle = function () {
    var currentIndex = this.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
    return this;
};

// перемешать массивы и выдать копию
Array.prototype.shuffleCopy = function () {
    return this.slice().shuffle();;
};