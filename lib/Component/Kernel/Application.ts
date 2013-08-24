import BundleInterface = module('./Bundle/BundleInterface');
import Bundle = module('./Bundle/Bundle');
import Router = module('./Routing/Router');
import RouteInterface = module("./Routing/RouteInterface");
import ConfigurationLoader = module('../Configuration/Loader');
import ControllerInterface = module("./Controller/ControllerInterface");
import Logger = module("../Logger/Logger");
import LoggerListenerInterface = module("../Logger/ListenerInterface");
import LoggerListenerFile = module("../Logger/ListenerFile");

/**
 * Main class of the application
 *
 * @namespace Component.Kernel
 * @class Application
 * @constructor
 */
class Application
{
    /**
     * Registred bundles
     *
     * @property bundles
     * @type {Array}
     * @private
     */
    private bundles:BundleInterface[];

    /**
     * The root directory of the application
     *
     * @property rootDirectory
     * @type {string}
     * @private
     */
    private rootDirectory:string;

    /**
     * Configuration
     *
     * @property configuration
     * @type {Object}
     * @private
     */
    private configuration:any;

    /**
     * The environment of the runtime
     *
     * @property environ
     * @type {string}
     * @private
     */
    private environment:string;

    /**
     * Indicates that the debug mode is enabled
     *
     * @property debug
     * @type {boolean}
     * @private
     */
    private debug:boolean;

    /**
     * The router
     *
     * @property router
     * @type {Component.Kernel.Routing.Router}
     * @private
     */
    private router:Router;

    /**
     * The directory path of the Solfege library
     *
     * @property libDirectory
     * @type {string}
     */
    public libDirectory:string;


    /**
     * Constructor
     *
     * @param   {string}    root            Root directory of the application
     * @param   {string}    environment     The environment of the runtime
     * @param   {boolean}   debug           Indicates that the debug mode is enabled
     */
    constructor(root:string, environment:string = "prod", debug:boolean = false)
    {
        var nodePath = require('path'),
            nodeFs = require('fs');

        // Set general properties
        this.bundles        = [];
        this.rootDirectory  = root;
        this.environment    = environment;
        this.debug          = debug;
        this.libDirectory   = nodePath.resolve(__dirname, '..', '..');

        // Error handler
        process.on("uncaughtException", this.onErrorUnknown.bind(this));

        // Check if the root directory exists
        if (!nodeFs.existsSync(this.rootDirectory)) {
            throw new Error('The root directory of the application does not exist');
        }
    }

    /**
     * Load configuration
     *
     * @param   {string}    path        Directory path
     */
    public loadConfiguration(path:string)
    {
        var nodeFs = require("fs"),
            nodePath = require("path"),
            loader:ConfigurationLoader,
            configurationPath:string,
            listenerIndex:string, listenerConfiguration:any, listener:LoggerListenerInterface,
            bundleIndex:string, bundlePath:string, bundleClass, bundle:BundleInterface,
            routerConfiguration:string,
            error;

        // Load the configuration file based on the environment
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

        // Initialize the logger
        if (this.configuration.logger) {
            // Setup the options
            // ...

            // Add listeners
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

        // Initialize the bundles
        // @todo Check if Array.isArray(configuration.bundles) is faster
        if (this.configuration.bundles instanceof Array) {
            for (bundleIndex in this.configuration.bundles) {
                bundlePath = this.configuration.bundles[bundleIndex];

                // Instantiate the bundle
                try {
                    bundleClass = require(bundlePath);
                    bundle = new bundleClass();
                } catch (error) {
                    throw new Error('This is not a valid bundle: ' + bundlePath);
                }
                if (bundle instanceof Bundle === false) {
                    throw new Error('This is not a valid bundle: ' + bundlePath);
                }

                // Setup the bundle
                bundle.setApplication(this);

                // Register the bundle
                this.registerBundle(bundle);
            }
        }

        // Initialize the router
        this.router = new Router();
        this.router.setApplication(this);
        if (this.configuration.router) {
            // Get the configuration
            if (this.configuration.router.resource) {
                loader = new ConfigurationLoader();
                routerConfiguration = loader.load(this.configuration.router.resource);

                this.router.initialize(routerConfiguration);
            }

            // Setup the options
            // ...
        }
    }

    /**
     * Get the configuration
     *
     * @return  {Object}     Configuration
     */
    public getConfiguration()
    {
        return this.configuration;
    }

    /**
     * Get the registred bundles
     *
     * @return  {Array}     The bundle list
     */
    public getBundles():BundleInterface[]
    {
        return this.bundles;
    }

    /**
     * Register a bundle
     *
     * @param   {Component.Kernel.Bundle.BundleInterface}   bundle      Bundle instance
     */
    public registerBundle(bundle:BundleInterface)
    {
        this.bundles.push(bundle);
    }

    /**
     * Get the root directory
     *
     * @return  {string}     The root directory
     */
    public getRootDirectory():string
    {
        return this.rootDirectory;
    }

    /**
     * Handle the HTTP request
     *
     * @param   {Object}    request         The request
     * @param   {Object}    response        The response
     */
    public handleRequest(request, response)
    {
        var route:RouteInterface,
            controllerPath:string,
            controller:ControllerInterface,
            actionName:string;

        // Get the route instance
        route = this.router.getRoute(request);

        // An error occurred: No route found
        // @todo Do it better :)
        if (route === null) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end("Route not found for " + request.url);
            return;
        }

        // The route updates the request
        // It can add variables
        route.updateRequest(request);

        // Get the controller instance
        controllerPath = route.getControllerPath();
        controller = this.getController(controllerPath);

        // An error occurred: No route found
        // @todo Do it better :)
        if (controller === null) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end("Controller not found for " + request.url);
            return;
        }

        // The action of the controller handles the request
        actionName = this.getControllerActionName(controllerPath);
        controller[actionName + "Action"](request, response);
    }

    /**
     * Get the controller instance from a path
     *
     * @param   {string}                                            controllerPath          The controller path
     * @return  {Component.Kernel.Controller.ControllerInterface}                           Description
     */
    private getController(controllerPath:string):ControllerInterface
    {
        var bundleIndex:string,
            bundle:BundleInterface,
            bundleName:string,
            bundleController:ControllerInterface,
            controllerPathArray:string[],
            requestBundleName:string,
            requestControllerName:string,
            requestActionName:string;

        // Extract informations from the controller path
        controllerPathArray = this.extractControllerInformations(controllerPath);
        requestBundleName = controllerPathArray[0];
        requestControllerName = controllerPathArray[1];
        requestActionName = controllerPathArray[2];

        
        // Find the bundle
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
    }

    /**
     * Get the action name of a controller path
     *
     * @param   {string}    controllerPath      The controller path
     * @return  {string}                        Action name
     */
    private getControllerActionName(controllerPath:string):string
    {
        var controllerPathArray:string[],
            requestBundleName:string,
            requestControllerName:string,
            requestActionName:string;

        // Extract informations from the controller path
        controllerPathArray = this.extractControllerInformations(controllerPath);
        requestBundleName = controllerPathArray[0];
        requestControllerName = controllerPathArray[1];
        requestActionName = controllerPathArray[2];

        return requestActionName;
    }

    /**
     * Extract informations from the controller path
     *
     * @param   {string}    controllerPath      The controller path
     * @return  {string[]}                      The informations
     */
    private extractControllerInformations(controllerPath:string):string[]
    {
        var controllerPathArray:string[],
            requestBundleName:string,
            requestControllerName:string,
            requestActionName:string;

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
    }

    /**
     * An unknown error occurred
     *
     * @param   {Object}    error           Error instance
     */
    private onErrorUnknown(error)
    {
        // @todo Use a log manager
        console.error(error.message);
    }
}

export = Application;