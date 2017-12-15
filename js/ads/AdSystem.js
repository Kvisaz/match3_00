/**
 * Created by Work on 16.12.2017.
 */
var AdSystem = {};

AdSystem.init = function () {
    var appKey = "6dbdcd8af4f87460fee0c08f67aafd7cb9ba53264646147c";
    Appodeal.setTesting(true); // set test mode enabled || disabled
    Appodeal.disableLocationPermissionCheck();
    Appodeal.initialize(appKey, Appodeal.BANNER);
    Appodeal.enableBannerCallbacks(true);
    alert("Appodeal initialized");
};

AdSystem.showBanner = function () {
    Appodeal.canShow(Appodeal.BANNER_BOTTOM, function(result) { // check if BANNER_BOTTOM can be shown for 'default' placement
        if(result) { // returns true or false
            alert("Appodeal can showBanner");
            Appodeal.show(Appodeal.BANNER_BOTTOM);
        }
        else {
            alert("Appodeal cannot showBanner");
        }
    });
};