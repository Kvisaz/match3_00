/**
 * Created by Work on 09.12.2017.
 *
 * собираем простой слайдер из 2х картинок
 * есть сеттер и геттер
 * значения слайдера - от 0 до 1
 * для выравнивания используй slider.rootView
 *
 * PS: зона чувствительности к клику - картинка линии
 * для лучшей чувствительности (увеличения зоны клика)
 * делай достаточно широкую линию, м.б. с прозрачностью
 *
 */
function Slider(lineImage, pointerImage, isVertical) {
    this.isVertical = isVertical === undefined ? false : isVertical;
    this.rootView = lineImage;
    this.pointerView = pointerImage;
    this.pointerView.alignIn(this.rootView, Phaser.CENTER);
    this.rootView.addChild(this.pointerView);

    this.rootView.inputEnabled = true;
    this.rootView.events.onInputDown.add(this.onClick, this);


    this.pointerView.inputEnabled = true;
    this.pointerView.input.enableDrag();
    this.pointerView.events.onDragUpdate.add(this.onUpdate, this);
    this.pointerView.input.allowVerticalDrag = this.isVertical;
    this.pointerView.input.allowHorizontalDrag = !this.isVertical;

    // ограничение на перемещения ползунка только по полоске
    // полоска как правило тоньше ползунка
    var boundsWidth = this.isVertical ? pointerImage.width*2 : lineImage.width;
    var boundsHeight = this.isVertical ? lineImage.height : pointerImage.height*2;
    var boundsX = this.isVertical ? -Math.floor(this.pointerView.width / 2): 0 ;
    var boundsY = this.isVertical ? 0 : -Math.floor(this.pointerView.height / 2);
    var bounds = new Phaser.Rectangle(boundsX, boundsY, boundsWidth, boundsHeight);
    this.pointerView.input.boundsRect = bounds;
    this.value = 0.5;
    this.totalLength = this.isVertical ? lineImage.height -  pointerImage.height: lineImage.width - pointerImage.width;
}

Slider.prototype.setXY = function (x, y) {
    this.rootView.x = x;
    this.rootView.y = y;
    return this;
};

Slider.prototype.setCallback = function (callback, context) {
    this.callback = callback;
    this.context = context;
    return this;
};

Slider.prototype.onClick = function (image, pointer) {
    if(this.isVertical) {
        this.pointerView.y = pointer.y - this.rootView.y;
    }
    else {
        this.pointerView.x = pointer.x - this.rootView.x;
    }
    this.onUpdate();
};


Slider.prototype.onUpdate = function () {
    this.updateValue();
    if(this.callback){
        this.callback.call(this.context, this.value);
    }
};

Slider.prototype.updateValue = function () {
    var position = this.isVertical ? this.totalLength - this.pointerView.y : this.pointerView.x;
    this.value = position / this.totalLength;
};

Slider.prototype.getValue = function () {
    var position = this.isVertical ? this.pointerView.y : this.pointerView.x;
    return value;
};

Slider.prototype.setValue = function (value) {
    this.value = value > 1 ? 1 : value; // защита от превышения
    this.value = this.value < 0 ? 0 : this.value; // защита от уменьшения

    var position = Math.floor(value * (this.totalLength));
    if(this.isVertical) {
        this.pointerView.y = this.totalLength - position; // по Y ноль начинается внизу
    }
    else {
        this.pointerView.x = position; // по X ноль начинается слева
    }
    return this;
};

/*
//  Пример использования
var sliderLine = ImageBuilder.rect(0, 0, 400, 8, "#ff00ff");
var sliderKnob = ImageBuilder.rect(0, 0, 24, 24, "#dd00dd");
var slider = new Slider(sliderLine, sliderKnob).setXY(100, 100)
    .setCallback(function (value) {
        scoreText.setText("" + value);
    }, this)
    .setValue(0.5);

var sliderLine = ImageBuilder.rect(0, 0, 8, 400, "#ff00ff");
var sliderKnob = ImageBuilder.rect(0, 0, 24, 24, "#dd00dd");
var slider = new Slider(sliderLine, sliderKnob, true)
    .setXY(100, 300)
    .setCallback(function (value) {
        scoreText.setText("" + value);
    }, this)
    .setValue(0.5);*/
