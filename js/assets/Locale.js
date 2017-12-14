/**
 * Created by Work on 14.12.2017.
  Локаль
 */

var Locale = {
    EN: { strings: R.strings.en },
    RU: { strings: R.strings.ru },
    DE: { strings: R.strings.de },
    TR: { strings: R.strings.tr },
    NL: { strings: R.strings.nl },
    ES: { strings: R.strings.es },
    PT: { strings: R.strings.pt },
    FR: { strings: R.strings.fr },
    strings: R.strings.en // this.EN.strings is undefined
};

// use: localeManager.setLocale(LocaleManager.RU);
Locale.setLocale = function (locale) {
    if(locale){
        this.strings = locale.strings;
        document.title = this.strings.indexTitle;
    }
};