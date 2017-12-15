/**
 * Created by Work on 14.12.2017.
 Локаль
 */

var Locale = {
    locales: {
        en: {strings: R.strings.en, label: "English", code: "en"},
        ru: {strings: R.strings.ru, label: "Русский", code: "ru"},
        de: {strings: R.strings.de, label: "Deutsche", code: "de"},
        tr: {strings: R.strings.tr, label: "Türk", code: "tr"},
        nl: {strings: R.strings.nl, label: "Nederlands", code: "nl"},
        es: {strings: R.strings.es, label: "Español", code: "es"},
        pt: {strings: R.strings.pt, label: "Portugues", code: "pt"},
        fr: {strings: R.strings.fr, label: "Français", code: "fr"},
    },

    currentLocale: undefined,

    strings: R.strings.en // this.EN.strings is undefined
};

// use: localeManager.setLocale(LocaleManager.RU);
Locale.setLocale = function (locale) {
    if (locale) {
        this.currentLocale = locale;
        this.strings = this.currentLocale.strings;
    }
};

Locale.getLocale = function () {
    if (this.currentLocale === undefined) {
        this.currentLocale = this.locales.en;
    }
    return this.currentLocale;
};

Locale.autodetectLocale = function () {
    var lang = navigator.language; // "en" или "en-EN"
    this.setLocale(this.getLocaleByCode(lang));
};

// "en" или "en-EN"
Locale.getLocaleByCode = function (code) {
    var locale = this.locales.en;
    if(code===undefined) return locale;
    for (var nextLocaleName in this.locales){
        // если кодовая строка содержит наш короткий код локали - все ок
        if(code.indexOf(this.locales[nextLocaleName].code)>-1){
            return this.locales[nextLocaleName];
        }
    }
};