/* @flow */
import assert from "assert"
import path from "path"
import fs from "./util/fs"
import {fn as isGenerator} from "is-generator"
import EventEmitter from "events"
import Configuration from "./Configuration"
import type {BundleInterface} from "./BundleInterface"
import packageJson from "../package.json"

// Private properties and methods
const _start:Symbol = Symbol();

/**
 * SolfegeJS application
 */
export default class Application extends EventEmitter
{
    static EVENT_CONFIGURATION_LOAD:string     = "configuration_load";
    static EVENT_CONFIGURATION_LOADED:string   = "configuration_loaded";
    static EVENT_BUNDLES_INITIALIZED:string    = "bundles_initialized";
    static EVENT_BUNDLES_BOOTED:string         = "bundles_booted";
    static EVENT_START:string                  = "start";
    static EVENT_END:string                    = "end";

    /**
     * Parameters
     */
    parameters:Map<string, *>;

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

        // Initialize parameter list
        this.parameters = new Map;

        // Initialize configuration
        this.configuration = new Configuration;
        this.configuration.set("main_directory_path", path.dirname(require.main.filename));

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
     * Set parameter
     *
     * @param   {string}    name    Parameter name
     * @param   {*}         value   Parameter value
     */
    setParameter(name:string, value:*):void
    {
        const nameType:string = typeof name;
        if (nameType !== "string") {
            throw new TypeError(`Parameter name should be a string, invalid type: ${nameType}`);
        }

        this.parameters.set(name, value);
    }

    /**
     * Get parameter value
     *
     * @param   {string}    name    Parameter name
     * @return  {*}         value   Parameter value
     */
    getParameter(name:string):*
    {
        return this.parameters.get(name);
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {BundleInterface}   bundle  A bundle
     */
    addBundle(bundle:BundleInterface):void
    {
        // Check the validity
        // @todo Check the other methods
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

        // $FlowFixMe
        this[_start](parameters)
            .then(async () => {
                await self.emit(Application.EVENT_END, self);
            })
            .catch(async (error) => {
                console.error(error);
            })
        ;
    }

    /**
     * Start the application in an async method
     *
     * @param   {Array<string>}     parameters  Parameters
     */
    // $FlowFixMe
    async [_start](parameters:Array<String> = []):void
    {
        // Install bundle dependencies
        // @todo Check DependentBundleInterface
        for (let bundle of this.bundles) {
            if (isGenerator(bundle.installDependencies)) {
                await bundle.installDependencies(this);
            } else if (typeof bundle.installDependencies === "function") {
                bundle.installDependencies(this);
            }
        }

        // Initialize registered bundles
        for (let bundle of this.bundles) {
            if (isGenerator(bundle.initialize)) {
                await bundle.initialize(this);
            } else if (typeof bundle.initialize === "function") {
                bundle.initialize(this);
            }
        }
        await this.emit(Application.EVENT_BUNDLES_INITIALIZED, this);

        // Load configuration file
        let configuration:Configuration = this.getConfiguration();
        if (typeof this.configurationFilePath === "string") {
            let configurationFileExists = await fs.exists(this.configurationFilePath);
            if (!configurationFileExists) {
                throw new Error(`Configuration file not found: ${this.configurationFilePath}`);
            }

            // Set the directory
            let configurationDirectory:string = path.dirname(this.configurationFilePath);
            configuration.set("configuration_directory_path", configurationDirectory);

            // Delegate the loading and parsing
            await this.emit(
                Application.EVENT_CONFIGURATION_LOAD,
                this,
                configuration,
                this.configurationFilePath,
                this.configurationFileFormat
            );
        }
        await this.emit(Application.EVENT_CONFIGURATION_LOADED, this, configuration);

        // Boot registered bundles
        for (let bundle of this.bundles) {
            if (isGenerator(bundle.boot)) {
                await bundle.boot();
            } else if (typeof bundle.boot === "function") {
                bundle.boot();
            }
        }
        await this.emit(Application.EVENT_BUNDLES_BOOTED, this);

        // Start the application
        this.emit(Application.EVENT_START, this, parameters);
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
        this.emit(Application.EVENT_END, this);
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
        let output = "SolfegeJS/Application ";
        output += JSON.stringify(properties, null, "  ");

        return output;
    }
}
