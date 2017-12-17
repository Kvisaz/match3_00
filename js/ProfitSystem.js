/**
 * Created by Work on 16.12.2017.
 */
var ProfitSystem = {};

ProfitSystem.init = function () {
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

ProfitSystem.showBanner = function () {
    try {
        Appodeal.isLoaded(Appodeal.BANNER_BOTTOM, function (result) { // check if BANNER_BOTTOM can be shown for 'default' placement
            if (result) { // returns true or false
                // alert("Appodeal can showBanner");
                Appodeal.show(Appodeal.BANNER_BOTTOM);
            }
            else {
            }
        });
    }
    catch (e) {

    }
};