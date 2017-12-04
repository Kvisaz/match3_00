/**
 * Created by Work on 29.11.2017.
 *
 * Модель фишки Match-3 на поле
 */
function JewelModel() {
    this.type = -1; // по умолчанию пусто
    this.column = -1;
    this.row = -1;
    this.isDispatched = false; // флаг для обработки при переборе массива с неуникальными значениями
}