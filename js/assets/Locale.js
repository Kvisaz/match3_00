/**
 * Created by Work on 14.12.2017.
 */

var Locale = {
    EN: { strings: R.strings.en },
    RU: { strings: R.strings.ru },
    DE: { strings: R.strings.de },
    TR: { strings: R.strings.tr },
    NL: { strings: R.strings.nl },
    ES: { strings: R.strings.es },
    strings: R.strings.en // this.EN.strings is undefined
};

// use: localeManager.setLocale(LocaleManager.RU);
Locale.setLocale = function (locale) {
    if(locale){
        this.strings = locale.strings;
    }
};