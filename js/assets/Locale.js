/**
 * Created by Work on 14.12.2017.
 Локаль
 */

var Locale = {
    en: {strings: R.strings.en},
    ru: {strings: R.strings.ru},
    de: {strings: R.strings.de},
    tr: {strings: R.strings.tr},
    nl: {strings: R.strings.nl},
    es: {strings: R.strings.es},
    pt: {strings: R.strings.pt},
    fr: {strings: R.strings.fr},
    strings: R.strings.en // this.EN.strings is undefined
};

// use: localeManager.setLocale(LocaleManager.RU);
Locale.setLocale = function (locale) {
    if (locale) {
        this.strings = locale.strings;
    }
};

Locale.autodetectLocale = function () {

    function getLang() {
        return navigator.language;
    }

    function detectStrings() {
        var lang = getLang();
        if (lang || Locale.hasOwnProperty(lang)) {
            Locale.strings = Locale[lang].strings;
        }
    }

    detectStrings();
};