
var Bundle = require('./Bundle/Bundle');
var Router = require('./Routing/Router');

var ConfigurationLoader = require('../Configuration/Loader');

var Logger = require("../Logger/Logger");

var LoggerListenerFile = require("../Logger/ListenerFile");

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
        var nodeFs = require("fs"), nodePath = require("path"), loader, configurationPath, listenerIndex, listenerConfiguration, listener, bundleIndex, bundlePath, bundleClass, bundle, routerConfiguration, error;

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
        loader.addVariable('application.log_dir', this.rootDirectory + '/logs');
        this.configuration = loader.load(configurationPath);

        if (this.configuration.logger) {
            if (this.configuration.logger.listeners instanceof Array) {
                for (listenerIndex in this.configuration.logger.listeners) {
                    listenerConfiguration = this.configuration.logger.listeners[listenerIndex];

                    switch (listenerConfiguration.type) {
                        case "file":
                            listener = new LoggerListenerFile(listenerConfiguration.path);
                            Logger.getInstance().addListener(listener);
                            break;
                    }
                }
            }
        }

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

        this.router = new Router();
        this.router.setApplication(this);
        if (this.configuration.router) {
            if (this.configuration.router.resource) {
                loader = new ConfigurationLoader();
                routerConfiguration = loader.load(this.configuration.router.resource);

                this.router.initialize(routerConfiguration);
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
        var route, controllerPath, controller, actionName;

        route = this.router.getRoute(request);

        if (route === null) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end("Route not found for " + request.url);
            return;
        }

        route.updateRequest(request);

        controllerPath = route.getControllerPath();
        controller = this.getController(controllerPath);

        if (controller === null) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end("Controller not found for " + request.url);
            return;
        }

        actionName = this.getControllerActionName(controllerPath);
        controller[actionName + "Action"](request, response);
    };

    Application.prototype.getController = function (controllerPath) {
        var bundleIndex, bundle, bundleName, bundleController, controllerPathArray, requestBundleName, requestControllerName, requestActionName;

        controllerPathArray = this.extractControllerInformations(controllerPath);
        requestBundleName = controllerPathArray[0];
        requestControllerName = controllerPathArray[1];
        requestActionName = controllerPathArray[2];

        for (bundleIndex in this.bundles) {
            bundle = this.bundles[bundleIndex];
            bundleName = bundle.getName();

            if (bundleName !== requestBundleName) {
                continue;
            }

            bundleController = bundle.getController(requestControllerName);

            return bundleController;
        }

        return null;
    };

    Application.prototype.getControllerActionName = function (controllerPath) {
        var controllerPathArray, requestBundleName, requestControllerName, requestActionName;

        controllerPathArray = this.extractControllerInformations(controllerPath);
        requestBundleName = controllerPathArray[0];
        requestControllerName = controllerPathArray[1];
        requestActionName = controllerPathArray[2];

        return requestActionName;
    };

    Application.prototype.extractControllerInformations = function (controllerPath) {
        var controllerPathArray, requestBundleName, requestControllerName, requestActionName;

        controllerPathArray = controllerPath.split(":");
        if (controllerPathArray.length !== 3) {
            throw new Error("Invalid controller path: " + controllerPath);
        }
        requestBundleName = controllerPathArray[0];
        requestControllerName = controllerPathArray[1];
        requestActionName = controllerPathArray[2];

        return [
            requestBundleName,
            requestControllerName,
            requestActionName
        ];
    };

    Application.prototype.onErrorUnknown = function (error) {
        console.error(error.message);
    };
    return Application;
})();


module.exports = Application;

