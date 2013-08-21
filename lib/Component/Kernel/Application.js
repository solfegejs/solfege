
var Bundle = require('./Bundle/Bundle');
var ConfigurationLoader = require('../Configuration/Loader');

var Application = (function () {
    function Application(root, environment, debug) {
        if (typeof environment === "undefined") { environment = "prod"; }
        if (typeof debug === "undefined") { debug = false; }
        var nodePath = require('path'), nodeFs = require('fs');

        this.bundles = [];
        this.rootDirectory = root;
        this.environment = environment;
        this.debug = debug;
        this.libDirectory = nodePath.resolve(__dirname, '..', '..');

        process.on("uncaughtException", this.onErrorUnknown.bind(this));

        if (!nodeFs.existsSync(this.rootDirectory)) {
            throw new Error('The root directory of the application does not exist');
        }
    }
    Application.prototype.loadConfiguration = function (path) {
        var nodeFs = require("fs"), nodePath = require("path"), loader, configurationPath, bundleIndex, bundlePath, bundleClass, bundle, error;

        configurationPath = nodePath.resolve(path + "/config_" + this.environment + ".json");
        if (!nodeFs.existsSync(configurationPath)) {
            throw new Error("Missing configuration file: " + configurationPath);
        }
        loader = new ConfigurationLoader();
        loader.addVariable('solfege.lib_dir', this.libDirectory);
        loader.addVariable('solfege.bundle_dir', this.libDirectory + '/Bundle');
        loader.addVariable('application.root_dir', this.rootDirectory);
        loader.addVariable('application.config_dir', this.rootDirectory + '/config');
        loader.addVariable('application.bundle_dir', this.rootDirectory + '/bundles');
        this.configuration = loader.load(configurationPath);

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

    Application.prototype.handleRequest = function (request, response) {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end("Hello world");
    };

    Application.prototype.onErrorUnknown = function (error) {
        console.error(error.message);
    };
    return Application;
})();


module.exports = Application;

