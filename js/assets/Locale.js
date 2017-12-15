/**
 * Created by Work on 14.12.2017.
 Локаль
 */

var Locale = {
    locales: {
        en: {strings: R.strings.en, label: "English"},
        ru: {strings: R.strings.ru, label: "Русский"},
        de: {strings: R.strings.de, label: "Deutsche"},
        tr: {strings: R.strings.tr, label: "Türk"},
        nl: {strings: R.strings.nl, label: "Nederlands"},
        es: {strings: R.strings.es, label: "Español"},
        pt: {strings: R.strings.pt, label: "Portugues"},
        fr: {strings: R.strings.fr, label: "Français"},
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

Locale.autodetectLocale = function () {
    function getLang() {
        return navigator.language;
    }
    var lang = getLang();
    if (lang || Locale.locales.hasOwnProperty(lang)) {
        this.setLocale(Locale.locales[lang]);
    }
};