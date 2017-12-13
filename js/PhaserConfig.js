/**
 * Created by Work on 28.11.2017.
 * Настройки Phaser  - правь здесь
 * Вызывать только один раз
 */

var PhaserConfig = {
    exe: function (game) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // для масштабирования во весь экран
        /*game.scale.pageAlignHorizontally = true; // не нужно при выравнивании через CSS
        game.scale.pageAlignVertically = true;*/
        game.input.maxPointers = 1; // мультитач не интересует
        game.renderer.renderSession.roundPixels = true; // нахер пошли сотые доли пикселов
        // Phaser.Canvas.setImageRenderingCrisp(game.canvas); // только для пиксельной графики в точном или пропорциональном 2м масштабе
        game.tweens.frameBased = false; // анимации на основе миллисекунд, а не фреймов, по умолчанию и так стоит false
        game.time.advancedTiming = true; // true - позволяет мерять  fps rate, fps min/max, suggestedFps and msMin/msMax. Недорого
        game.forceSingleUpdate = true; // true - Should the game loop force a logic update, regardless of the delta timer
    }
};