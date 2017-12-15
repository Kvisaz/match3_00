/**
 * Created by Work on 16.12.2017.
 */
var Appodeal = Appodeal || undefined;
var AdSystem = {};

AdSystem.init = function () {

    if (Appodeal === undefined) return;
    var appKey = "6dbdcd8af4f87460fee0c08f67aafd7cb9ba53264646147c";
    Appodeal.disableLocationPermissionCheck();
    Appodeal.initialize(appKey, Appodeal.BANNER);
    Appodeal.enableBannerCallbacks(true);
    document.addEventListener('onBannerLoaded', function(){
        AdSystem.showBanner();
    });

    alert("Appodeal initialized");
};

AdSystem.showBanner = function () {
    if (Appodeal === undefined) return;

    alert("Appodeal showBanner");
    Appodeal.isLoaded(Appodeal.BANNER, function (result) {
        Appodeal.show(Appodeal.BANNER_BOTTOM);
    });
};