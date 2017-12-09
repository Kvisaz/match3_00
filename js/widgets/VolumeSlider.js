/**
 * Created by Work on 10.12.2017.
 *
 * Управление громкостью на базe Slider из myPhaser
 * value 0...1
 */

function VolumeSlider(game, value, labelOn, labelOff) {
    this.game = game;
    this.isOn = true;
    this.value = value;

    var sliderLine = game.add.image(0, 0, R.images.slider.line.page, R.images.slider.line.name);
    var sliderPointer = game.add.image(0, 0, R.images.slider.pointer.page, R.images.slider.pointer.name);
    this.slider = new Slider(sliderLine, sliderPointer).setValue(value);

    this.checkBoxImage = this.game.add.image(0, 0, R.images.buttons.checkBox.page, R.images.buttons.checkBox.name);
    this.checkMarkImage = this.game.add.image(0, 0, R.images.buttons.checkMark.page, R.images.buttons.checkMark.name);
    this.checkMarkImage.alignIn(this.checkBoxImage, Phaser.CENTER);
    this.checkBoxImage.addChild(this.checkMarkImage);

    this.checkBoxImage.inputEnabled = true;
    this.checkBoxImage.events.onInputDown.add(function () {
        if (this.checkMarkImage.alive) this.checkMarkImage.kill();
        else this.checkMarkImage.revive();
        this.isOn = this.checkMarkImage.alive;
        this.text.setText(this.isOn ? labelOn : labelOff);
        if(this.checkCallback){
            this.checkCallback.call(this.checkCallbackContext, this.isOn);
        }
    }, this);

    this.checkBoxImage.alignTo(this.slider.rootView, Phaser.TOP_RIGHT, -48, -2);
    this.slider.rootView.addChild(this.checkBoxImage);

    this.text = this.game.add.bitmapText(0, 0, R.fonts.robotoBold.name, labelOn, 42);
    this.text.tint = "0x4DA61B";

    this.text.alignTo(this.checkBoxImage, Phaser.LEFT_CENTER, 24, 0);
    this.slider.rootView.addChild(this.text);

    this.rootView = this.slider.rootView;
}

VolumeSlider.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

// параметр volume возвращается
VolumeSlider.prototype.setVolumeCallback = function (callback, context) {
    this.slider.setCallback(callback, context);
    return this;
};

VolumeSlider.prototype.setCheckCallback = function (callback, context) {
    this.checkCallback = callback;
    this.checkCallbackContext = context;
    return this;
};