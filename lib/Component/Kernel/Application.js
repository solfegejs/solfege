
var ConfigurationLoader = require('../Configuration/Loader');

var Application = (function () {
    function Application(environment, debug) {
        if (typeof environment === "undefined") { environment = null; }
        if (typeof debug === "undefined") { debug = false; }
        var nodePath = require('path');

        this.bundles = [];
        this.environment = environment;
        this.debug = debug;
        this.libDirectory = nodePath.resolve(__dirname, '..', '..');
    }
    Application.prototype.loadConfiguration = function (path) {
        var loader, configuration, bundleIndex, bundlePath, bundleClass, bundle;

        loader = new ConfigurationLoader();
        loader.addVariable('solfege.lib_dir', this.libDirectory);
        loader.addVariable('solfege.bundle_dir', this.libDirectory + '/Bundle');
        configuration = loader.load(path + '/config.json');

        if (configuration.bundles instanceof Array) {
            for (bundleIndex in configuration.bundles) {
                bundlePath = configuration.bundles[bundleIndex];

                bundleClass = require(bundlePath);
                bundle = new bundleClass();

                this.registerBundle(bundle);
            }
        }
    };

    Application.prototype.getBundles = function () {
        return this.bundles;
    };

    Application.prototype.registerBundle = function (bundle) {
        this.bundles.push(bundle);
    };
    return Application;
})();


module.exports = Application;

