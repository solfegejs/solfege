

var Application = (function () {
    function Application(environment, debug) {
        if (typeof environment === "undefined") { environment = null; }
        if (typeof debug === "undefined") { debug = false; }
    }
    Application.prototype.loadConfiguration = function (path) {
    };

    Application.prototype.getBundles = function () {
    };

    Application.prototype.registerBundle = function (bundle) {
    };
    return Application;
})();


module.exports = Application;

