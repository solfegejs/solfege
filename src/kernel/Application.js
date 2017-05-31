/* @flow */
import assert from "assert"
import path from "path"
import co from "co"
import fs from "../util/fs"
import {fn as isGenerator} from "is-generator"
import EventEmitter from "./EventEmitter"
import Configuration from "./Configuration"
import type {ApplicationInterface, BundleInterface} from "../../interface"
import packageJson from "../../package.json"

/**
 * An application
 */
export default class Application extends EventEmitter implements ApplicationInterface
{
    static EVENT_CONFIGURATION_LOAD:string     = "configuration_load";
    static EVENT_CONFIGURATION_LOADED:string   = "configuration_loaded";
    static EVENT_BUNDLES_INITIALIZED:string    = "bundles_initialized";
    static EVENT_BUNDLES_BOOTED:string         = "bundles_booted";
    static EVENT_START:string                  = "start";
    static EVENT_END:string                    = "end";

    /**
     * Format of the configuration file
     */
    configurationFileFormat:string;

    /**
     * Configuration file path
     */
    configurationFilePath:string;

    /**
     * Configuration instance
     */
    configuration:Configuration;

    /**
     * Bundle list
     */
    bundles:Set<BundleInterface>;

    /**
     * Constructor
     */
    constructor():void
    {
        super();

        // Configuration file path
        this.configurationFilePath;
        this.configurationFileFormat;
        this.configuration = new Configuration;

        // Initialize the bundle registry
        this.bundles = new Set();

        // Exit handler
        let bindedExitHandler:Function = this.onExit.bind(this);
        let bindedKillHandler:Function = this.onKill.bind(this);
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
     * @param   {BundleInterface}   bundle  A bundle
     */
    addBundle(bundle:BundleInterface):void
    {
        // Check the validity
        assert.strictEqual(typeof bundle.getPath, "function", `The bundle ${bundle.toString()} must implement getPath method`);

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Get bundles
     *
     * @return  {Set}           The bundles
     */
    getBundles():Set<BundleInterface>
    {
        return this.bundles;
    }

    /**
     * Get bundle file path
     *
     * @param   {BundleInterface}   bundle  Bundle instance
     * @return  {string}                    Bundle file path
     */
    getBundleFilePath(bundle:BundleInterface):?string
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
     * @param   {BundleInterface}   bundle  Bundle instance
     * @return  {string}                    Bundle directory path
     */
    getBundleDirectoryPath(bundle:BundleInterface):?string
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
     * @param   {string}    format      File format
     */
    loadConfigurationFile(filePath:string, format:string):void
    {
        this.configurationFilePath = path.resolve(filePath);
        this.configurationFileFormat = format;
    }

    /**
     * Load confguration
     *
     * @param   {object}    properties  Configuration properties
     */
    loadConfiguration(properties:Object):void
    {
        this.configuration.addProperties(properties);
    }

    /**
     * Get configuration
     *
     * @return  {Configuration}         Configuration instance
     */
    getConfiguration():Configuration
    {
        return this.configuration;
    }

    /**
     * Start the application
     *
     * @param   {Array}     parameters  Application parameters
     */
    start(parameters:Array<string> = []):void
    {
        let self:Application = this;

        // Start the generator based flow
        co(function *()
        {
            // Install bundle dependencies
            // @todo Check DependentBundleInterface
            for (let bundle of self.bundles) {
                // $FlowFixMe
                if (isGenerator(bundle.installDependencies)) {
                    yield bundle.installDependencies(self);
                } else if (typeof bundle.installDependencies === "function") {
                    bundle.installDependencies(self);
                }
            }

            // Initialize registered bundles
            for (let bundle of self.bundles) {
                // $FlowFixMe
                if (isGenerator(bundle.initialize)) {
                    yield bundle.initialize(self);
                } else if (typeof bundle.initialize === "function") {
                    bundle.initialize(self);
                }
            }
            yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

            // Load configuration file
            let configuration:Configuration = self.getConfiguration();
            if (typeof self.configurationFilePath === "string") {
                let configurationFileExists = yield fs.exists(self.configurationFilePath);
                if (!configurationFileExists) {
                    throw new Error(`Configuration file not found: ${self.configurationFilePath}`);
                }

                // Set the directory
                let configurationDirectory:string = path.dirname(self.configurationFilePath);
                configuration.setDirectoryPath(configurationDirectory);

                // Delegate the loading and parsing
                yield self.emit(
                    Application.EVENT_CONFIGURATION_LOAD,
                    self,
                    configuration,
                    self.configurationFilePath,
                    self.configurationFileFormat
                );
            }
            yield self.emit(Application.EVENT_CONFIGURATION_LOADED, self, configuration);

            // Boot registered bundles
            for (let bundle of self.bundles) {
                // $FlowFixMe
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
        .catch((error):void => {
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
    onErrorUnknown(error:Error):void
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
    onExit():void
    {
        let self:Application = this;

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
    onKill():void
    {
        process.exit();
    }

    /**
     * Get string format of the instance
     *
     * @return  {string}    String format
     */
    inspect():string
    {
        let properties = {
            solfegeVersion: packageJson.version,
            bundleCount: this.bundles.size,
            configurationFilePath: this.configurationFilePath
        };
        let output = "SolfegeJS/kernel/Application ";
        output += JSON.stringify(properties, null, "  ");

        return output;
    }
}
