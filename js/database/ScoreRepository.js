/**
 * Created by Work on 14.12.2017.
 *
 * репозиторий для сохранения и чтения таблицы данных
 * для получения позиции в таблице, а также, какой ты лучший -
 * - вообще
 * - за неделю
 * - за день
 * - за час
 * - за 15 минут
 * - лучше, чем последний результат!

 */


function ScoreRepository(repository) {
    this.repository = repository; // универсальный сохранятель, формат Repository.js

    this.REPO_SCORE_TAG = "scores"; // тег для сохранения и чтения данных в таблице
    this.BEST_SCORE_AMOUNT = 8; // число лучших рекордов в таблице

    this.scores = {
        // набор очков целочисленных, в порядке уменьшения,
        // размер массива не больше this.BEST_SCORE_AMOUNT
        // формат элемента - int
        bestScores: [],
        // самый последний рекорд
        last: 0,
    };

    this.load(); // если есть сохраненки - грузим
}

// ----------------------  внешний интерфейс ---------------------

ScoreRepository.prototype.load = function () {
    var savedScores = this.repository.load(this.REPO_SCORE_TAG);
    if (savedScores) {
        this.scores = savedScores;
    }
};

ScoreRepository.prototype.save = function () {
    try {
        this.repository.save(this.REPO_SCORE_TAG, this.scores);
    }
    catch (e) {
        console.log("ScoreRepository.save Exception: " + e);
    }
};


// вернуть таблицу рекордов - список самых больших достижений
ScoreRepository.prototype.getBestScores = function () {
    return this.scores.bestScores;
};

// вернуть самый большой рекорд
ScoreRepository.prototype.getBest = function () {
    return this.scores.bestScores[0] || 0; // если ничего нет, вернет 0
};

// вернуть последний рекорд
ScoreRepository.prototype.getLast = function () {
    return this.scores.last; // если ничего нет, вернет 0
};

// сохранить рекорд, хотя бы как последний
ScoreRepository.prototype.saveScore = function (score) {
    if(score <= 0) return; // такое не сохраняем

    // записываем как последний
    this.scores.last = score;

    // вставляем в таблицу наилучших если его там нет ----------------------
    var table = this.scores.bestScores;
    if(table.indexOf(score)===-1) {
        table.push(score);
        table.sort(function (a, b) {
            return b - a; // сортировка в обратном порядке, от большего к меньшему
        });
        // отсекаем от таблицы хвост, превышающий границу this.BEST_SCORE_AMOUNT
        table.splice(this.BEST_SCORE_AMOUNT, table.length - this.BEST_SCORE_AMOUNT);
    }

    // сохраняем все
    this.save();
};