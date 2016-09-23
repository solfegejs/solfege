import assert from "assert";
import path from "path";
import co from "co";
import fs from "co-fs";
import {fn as isGenerator} from "is-generator";
import EventEmitter from "./EventEmitter";
import Configuration from "./Configuration";

/**
 * An application
 */
export default class Application extends EventEmitter
{
    static EVENT_CONFIGURATION_LOAD     = "configuration_load";
    static EVENT_CONFIGURATION_LOADED   = "configuration_loaded";
    static EVENT_BUNDLES_INITIALIZED    = "bundles_initialized";
    static EVENT_BUNDLES_BOOTED         = "bundles_booted";
    static EVENT_START                  = "start";
    static EVENT_END                    = "end";


    /**
     * Constructor
     */
    constructor()
    {
        super();

        // Configuration file path
        this.configurationFilePath;
        this.configuration = new Configuration;

        // Initialize the bundle registry
        this.bundles = new Set();

        // Exit handler
        let bindedExitHandler = this.onExit.bind(this);
        let bindedKillHandler = this.onKill.bind(this);
        process.on("exit", bindedExitHandler);
        process.on("SIGINT", bindedKillHandler);
        process.on("SIGTERM", bindedKillHandler);
        process.on("SIGHUP", bindedKillHandler);

        // Error handler
        process.on("uncaughtException", this.onErrorUnknown.bind(this));
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {*}     bundle  A bundle
     */
    addBundle(bundle)
    {
        // Check the validity
        assert.strictEqual(typeof bundle.getPath, 'function', `The bundle ${bundle} must implement getPath method`);

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Get bundles
     *
     * @return  {Set}           The bundles
     */
    getBundles()
    {
        return this.bundles;
    }

    /**
     * Get bundle file path
     *
     * @param   {object}    bundle  THe bundle instance
     * @return  {string}            The bundle file path
     */
    getBundleFilePath(bundle)
    {
        /*
        // This trick works only on NodeJS 5
        try {
            bundle.constructor();
        } catch (error) {
            let result = error.stack.match(/\((.*):\d+:\d+\)/);
            if (result) {
                let bundleFilePath = result[1];

                return bundleFilePath;
            }
        }
        */

        return null;
    }

    /**
     * Get bundle directory path
     *
     * @param   {object}    bundle  THe bundle instance
     * @return  {string}            The bundle directory path
     */
    getBundleDirectoryPath(bundle)
    {
        /*
        let filePath = this.getBundleFilePath(bundle);
        if (filePath) {
            return path.dirname(filePath);
        }
        */

        if (typeof bundle.getPath === "function") {
            return bundle.getPath();
        }


        return null;
    }

    /**
     * Load configuration file
     *
     * @param   {string}    filePath    Configuration file path
     */
    loadConfiguration(filePath:string)
    {
        this.configurationFilePath = path.resolve(filePath);
    }

    /**
     * Get configuration
     *
     * @return  {Configuration}         Configuration instance
     */
    getConfiguration()
    {
        return this.configuration;
    }

    /**
     * Start the application
     *
     * @param   {Array}     parameters  Application parameters
     */
    start(parameters:Array = [])
    {
        let self = this;

        // Start the generator based flow
        co(function *()
        {
            // Install bundle dependencies
            for (let bundle of self.bundles) {
                if (isGenerator(bundle.installDependencies)) {
                    yield bundle.installDependencies(self);
                } else if (typeof bundle.installDependencies === "function") {
                    bundle.installDependencies(self);
                }
            }

            // Initialize registered bundles
            for (let bundle of self.bundles) {
                if (isGenerator(bundle.initialize)) {
                    yield bundle.initialize(self);
                } else if (typeof bundle.initialize === "function") {
                    bundle.initialize(self);
                }
            }
            yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

            // Load configuration file
            let configuration = self.getConfiguration();
            if (typeof self.configurationFilePath === "string") {
                let configurationFileExists = yield fs.exists(self.configurationFilePath);
                if (!configurationFileExists) {
                    throw new Error(`Configuration file not found: ${self.configurationFilePath}`);
                }

                // Set the directory
                let configurationDirectory:string = path.dirname(self.configurationFilePath);
                configuration.setDirectoryPath(configurationDirectory);

                // Delegate the loading and parsing
                yield self.emit(Application.EVENT_CONFIGURATION_LOAD, self, configuration, self.configurationFilePath);
            }
            yield self.emit(Application.EVENT_CONFIGURATION_LOADED, self, configuration);

            // Boot registered bundles
            for (let bundle of self.bundles) {
                if (isGenerator(bundle.boot)) {
                    yield bundle.boot();
                } else if (typeof bundle.boot === "function") {
                    bundle.boot();
                }
            }
            yield self.emit(Application.EVENT_BUNDLES_BOOTED, self);

            // Start the application
            yield self.emit(Application.EVENT_START, self, parameters);
        })

        // End
        .then(function*()
        {
            yield self.emit(Application.EVENT_END, self);
        })

        // Handle error
        .catch(error => {
            console.error(error.message);
            console.error(error.stack);
        });
    }

    /**
     * An unknown error occurred
     *
     * @private
     * @param   {Error}     error   Error instance
     */
    onErrorUnknown(error)
    {
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }

    /**
     * The application is stopped
     *
     * @private
     */
    onExit()
    {
        let self = this;

        co(function *()
        {
            yield self.emit(Application.EVENT_END, self);
        });
    }

    /**
     * The application is killed
     *
     * @private
     */
    onKill()
    {
        process.exit();
    }
}
