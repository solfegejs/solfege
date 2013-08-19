
var Bundle = require('./Bundle/Bundle');
var ConfigurationLoader = require('../Configuration/Loader');

var Application = (function () {
    function Application(root, environment, debug) {
        if (typeof environment === "undefined") { environment = null; }
        if (typeof debug === "undefined") { debug = false; }
        var nodePath = require('path'), nodeFs = require('fs');

        this.bundles = [];
        this.rootDirectory = root;
        this.environment = environment;
        this.debug = debug;
        this.libDirectory = nodePath.resolve(__dirname, '..', '..');

        if (!nodeFs.existsSync(this.rootDirectory)) {
            throw new Error('The root directory of the application does not exist');
        }
    }
    Application.prototype.loadConfiguration = function (path) {
        var loader, bundleIndex, bundlePath, bundleClass, bundle, error;

        loader = new ConfigurationLoader();
        loader.addVariable('solfege.lib_dir', this.libDirectory);
        loader.addVariable('solfege.bundle_dir', this.libDirectory + '/Bundle');
        loader.addVariable('application.root_dir', this.rootDirectory);
        loader.addVariable('application.bundle_dir', this.rootDirectory + '/bundles');
        this.configuration = loader.load(path + '/config.json');

        if (this.configuration.bundles instanceof Array) {
            for (bundleIndex in this.configuration.bundles) {
                bundlePath = this.configuration.bundles[bundleIndex];

                try  {
                    bundleClass = require(bundlePath);
                    bundle = new bundleClass();
                } catch (error) {
                    throw new Error('This is not a valid bundle: ' + bundlePath);
                }
                if (bundle instanceof Bundle === false) {
                    throw new Error('This is not a valid bundle: ' + bundlePath);
                }

                bundle.setApplication(this);

                this.registerBundle(bundle);
            }
        }
    };

    Application.prototype.getConfiguration = function () {
        return this.configuration;
    };

    Application.prototype.getBundles = function () {
        return this.bundles;
    };

    Application.prototype.registerBundle = function (bundle) {
        this.bundles.push(bundle);
    };

    Application.prototype.getRootDirectory = function () {
        return this.rootDirectory;
    };
    return Application;
})();


module.exports = Application;

