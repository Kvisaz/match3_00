/**
 * Created by Work on 13.12.2017.
 * (c) http://html5-game.ru/
 */
var MyPhaser = MyPhaser || {};
MyPhaser.slice9 = {};

// если Image использует текстуру .9 с name popup.10.20.30.40 - эта функция сможет его растянуть
Phaser.Image.prototype.refresh9slice = function (width, height) {
    var image = this, frame = this.frameName;
    var base_texture = image.texture.baseTexture;
    var base_frame = image.texture.frame;

    var raw_data = frame.split('.', 6);
    var border_left = parseInt(raw_data[1]);
    var border_top = parseInt(raw_data[2]);
    var border_right = parseInt(raw_data[3]);
    var border_bottom = parseInt(raw_data[4]);

    image.loadTexture(new Phaser.RenderTexture(this.game, width, height));
    image.texture.resize(width, height, true);

    var source_x = [0, border_left, base_frame.width - border_right, base_frame.width];
    var source_y = [0, border_top, base_frame.height - border_bottom, base_frame.height];
    var destination_x = [0, border_left, width - border_right, width];
    var destination_y = [0, border_top, height - border_bottom, height];

    var xi, yi, rect_x, rect_y, rect_width, rect_height, rect_frame, rect_sprite;
    for (yi = 0; yi < 3; yi++)
        for (xi = 0; xi < 3; xi++) {
            rect_x = base_frame.x + image.texture.frame.x + source_x[xi];
            rect_y = base_frame.y + image.texture.frame.y + source_y[yi];
            rect_width = Math.max(source_x[xi + 1] - source_x[xi], 1);
            rect_height = Math.max(source_y[yi + 1] - source_y[yi], 1);

            rect_frame = new PIXI.Rectangle(rect_x, rect_y, rect_width, rect_height);
            rect_sprite = new Phaser.Sprite(this.game, 0, 0, new PIXI.Texture(base_texture, rect_frame));
            rect_sprite.width = destination_x[xi + 1] - destination_x[xi];
            rect_sprite.height = destination_y[yi + 1] - destination_y[yi];
            image.texture.renderXY(rect_sprite, destination_x[xi], destination_y[yi]);
        }

    return image;
};

// frame name must be written as "popup.10.20.30.40.9"
MyPhaser.slice9.createImage = function (game, key, frame, width, height) {
    var image = new Phaser.Image(game, 0, 0, key, frame);
    var base_texture = image.texture.baseTexture;
    var base_frame = image.texture.frame;

    var raw_data = frame.split('.', 6);
    var border_left = parseInt(raw_data[1]);
    var border_top = parseInt(raw_data[2]);
    var border_right = parseInt(raw_data[3]);
    var border_bottom = parseInt(raw_data[4]);

    image.loadTexture(new Phaser.RenderTexture(game, width, height));
    image.texture.resize(width, height, true);

    var source_x = [0, border_left, base_frame.width - border_right, base_frame.width];
    var source_y = [0, border_top, base_frame.height - border_bottom, base_frame.height];
    var destination_x = [0, border_left, width - border_right, width];
    var destination_y = [0, border_top, height - border_bottom, height];

    var xi, yi, rect_x, rect_y, rect_width, rect_height, rect_frame, rect_sprite;
    for (yi = 0; yi < 3; yi++)
        for (xi = 0; xi < 3; xi++) {
            rect_x = base_frame.x + image.texture.frame.x + source_x[xi];
            rect_y = base_frame.y + image.texture.frame.y + source_y[yi];
            rect_width = Math.max(source_x[xi + 1] - source_x[xi], 1);
            rect_height = Math.max(source_y[yi + 1] - source_y[yi], 1);

            rect_frame = new PIXI.Rectangle(rect_x, rect_y, rect_width, rect_height);
            rect_sprite = new Phaser.Sprite(game, 0, 0, new PIXI.Texture(base_texture, rect_frame));
            rect_sprite.width = destination_x[xi + 1] - destination_x[xi];
            rect_sprite.height = destination_y[yi + 1] - destination_y[yi];
            image.texture.renderXY(rect_sprite, destination_x[xi], destination_y[yi]);
        }

    return image;
};

// эту операцию можно переписать через canvas (bitmapData)
MyPhaser.slice9.createTexture = function (key, frame, width, height) {
    var sprite = new Phaser.Sprite(this.game, 0, 0, key, frame);
    var base_texture = sprite.texture.baseTexture;
    var base_frame = sprite.texture.frame;

    var raw_data = frame.split('.', 6);
    var border_left = parseInt(raw_data[1]);
    var border_top = parseInt(raw_data[2]);
    var border_right = parseInt(raw_data[3]);
    var border_bottom = parseInt(raw_data[4]);

    sprite.loadTexture(new Phaser.RenderTexture(this.game, width, height));
    sprite.texture.resize(width, height, true);

    var source_x = [0, border_left, base_frame.width - border_right, base_frame.width];
    var source_y = [0, border_top, base_frame.height - border_bottom, base_frame.height];
    var destination_x = [0, border_left, width - border_right, width];
    var destination_y = [0, border_top, height - border_bottom, height];

    var xi, yi, rect_x, rect_y, rect_width, rect_height, rect_frame, rect_sprite;
    for (yi = 0; yi < 3; yi++)
        for (xi = 0; xi < 3; xi++) {
            rect_x = base_frame.x + sprite.texture.frame.x + source_x[xi];
            rect_y = base_frame.y + sprite.texture.frame.y + source_y[yi];
            rect_width = Math.max(source_x[xi + 1] - source_x[xi], 1);
            rect_height = Math.max(source_y[yi + 1] - source_y[yi], 1);

            rect_frame = new PIXI.Rectangle(rect_x, rect_y, rect_width, rect_height);
            rect_sprite = new Phaser.Sprite(this.game, 0, 0, new PIXI.Texture(base_texture, rect_frame));
            rect_sprite.width = destination_x[xi + 1] - destination_x[xi];
            rect_sprite.height = destination_y[yi + 1] - destination_y[yi];
            sprite.texture.renderXY(rect_sprite, destination_x[xi], destination_y[yi]);
        }

    return sprite.texture;
};