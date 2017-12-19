/**
 * Created by Work on 16.12.2017.
 */
var ProfitSystem = {};

ProfitSystem.init = function (game) {
    this.game = game;

    if (this.game.device.android) {
        this.androidInit();
    }
    else if (AppConfig.gameDistribution) {

        this.gdistributionInit();
    }
};

ProfitSystem.androidInit = function () {
    var appKey = "6dbdcd8af4f87460fee0c08f67aafd7cb9ba53264646147c";
    try {
        Appodeal.setTesting(false); // set test mode enabled || disabled
        Appodeal.disableLocationPermissionCheck();
        Appodeal.initialize(appKey, Appodeal.BANNER);
        Appodeal.enableBannerCallbacks(true);
    }
    catch (e) {
    }
};

ProfitSystem.gdistributionInit = function () {
    var me = this;
    var settings = {
        // This is the gameId you get when you've create a game on gamedistribution.com
        gameId: "c9b1682891424b6da63fa8e85feec089",

        // Along with the gameid you'll also be supplied a userId, put it here
        userId: "6E63519E-508E-4142-9472-7BB01AE52CD6-s1",

        // This function will be called when the ad begins and when your game should be paused. It's required that you mute your game at this point
        pauseGame: function () {
            ProfitSystem.game.paused = true; //example
            ProfitSystem.game.sound.mute = true; //example
        },

        // This callback is called when the ad is finished, you can resume your game and unmute your audio
        resumeGame: function () {
            ProfitSystem.game.paused = false; //example
            ProfitSystem.game.sound.mute = false; //example
        },

        // Called when the gdApi initlialized, will be deprecated soon
        onInit: function (data) {
            // console.log("Init: ", data);
        },

        // Called when an error appears in the gdApi, will be deprecated soon
        onError: function (data) {
        }
    };

    //Include the gdApi script
    (function (i, s, o, g, r, a, m) {
        i['GameDistribution'] = r;
        i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//html5.api.gamedistribution.com/libs/gd/api.js', 'gdApi');


//Initialize the gdApi script with the previously defined settings
    gdApi(settings);
};

// -------------------- show bottom Banner on screen --------------------
ProfitSystem.showBanner = function () {
    if (this.game.device.android) {
        this.androidShowBanner();
    }
    else { // в web-версии показываем ссылку на Google Play
        if(this.webBanner === undefined){
            this.webBannerInit();
        }
        this.webShowBanner();
    }
};


ProfitSystem.androidShowBanner = function () {
    try {
        // check if BANNER_BOTTOM can be shown for 'default' placement
        Appodeal.isLoaded(Appodeal.BANNER_BOTTOM, function (result) {
            if (result) {
                Appodeal.show(Appodeal.BANNER_BOTTOM);
            }
        });
    }
    catch (e) {
    }
};


ProfitSystem.webBannerInit = function () {
    this.webBanner = ProfitSystem.game.add.image(0, 0, R.images.ads.googlePlay);
    this.webBanner.inputEnabled = true;
    this.webBanner.events.onInputDown.add(function () {
        window.open(AppConfig.googlePlayUrl, "_blank");
    }, this);
};

ProfitSystem.webShowBanner = function () {
    // включаем показ баннера в веб-версии на GooglePlay
    ProfitSystem.game.world.bringToTop(this.webBanner);
    this.webBanner.alignIn(ProfitSystem.game.world, Phaser.BOTTOM_CENTER, 0, 12);
};

// -------------------- show fullScreen after gameOver --------------------
ProfitSystem.showFullscreen = function () {
    try {
        if (AppConfig.gameDistribution && this.game.device.desktop) { // только для Андроида
            this.showGameDistributionFullscreen();
        }
    }
    catch (e) {
    }

};

ProfitSystem.showGameDistributionFullscreen = function () {
    var gdApi = window['gdApi'];
    gdApi.showBanner();
};