/**
 * Created by Work on 14.12.2017.
 * логика начисления очков
 */

function ScoreLogic(scoreRepository){
    this.scoreRepository = scoreRepository;

    this.SCORE_JEWEL = 10;
    this.SCORE_COMBO_MIN = 3;
    this.SCORE_EXTRA_COMBO_BONUS = 10;

    this.HINT_SCORE_PRICE = 30;
    this.score = 0;
    this.bestScore = this.scoreRepository.getBest();
}

ScoreLogic.prototype.onNewGame = function () {
    this.score = 0;
    this.bestScore = this.scoreRepository.getBest();
};

ScoreLogic.prototype.onHint = function (solution) {
    this.score -= me.HINT_SCORE_PRICE;
    if(this.score < 0) this.score = 0;
};

ScoreLogic.prototype.onCombo = function (comboJewels) {
    this.score += this.SCORE_JEWEL * comboJewels.length;
    var overComboLength = comboJewels.length - this.SCORE_COMBO_MIN;
    var scoreBonus = this.SCORE_EXTRA_COMBO_BONUS;
    for(var i=0;i<overComboLength;i++){
        this.score += scoreBonus;
        scoreBonus += this.SCORE_EXTRA_COMBO_BONUS;
    }
};

ScoreLogic.prototype.getBestScoreText = function () {
    return Locale.strings.bestScorePrefix + this.bestScore;
};


