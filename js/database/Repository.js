/**
 * Created by Work on 11.12.2017.
 *
 *  Хранитель данных - просто кидай туда и бери из него ОБЪЕКТЫ
 *  он сам решит, куда их сохранять
 *
 *  если устройство не поддерживает сохранение - ничего не будет происходить*
 *
 */
var Repository = {};

Repository.save = function (keyString, valueObject) {
    if (localStorage === undefined) return;
    var jsonString = JSON.stringify(valueObject);
    localStorage.setItem(keyString, jsonString);
};

Repository.load = function (keyString) {
    if (localStorage === undefined) return undefined;
    var jsonString = localStorage.getItem(keyString);
    var valueObject = JSON.parse(jsonString);
    return valueObject;
};