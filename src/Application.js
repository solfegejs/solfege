/* @flow */
import assert from "assert"
import path from "path"
import fs from "./util/fs"
import EventEmitter from "events"
import Configuration from "./Configuration"
import type {BundleInterface} from "./BundleInterface"
import packageJson from "../package.json"

// Private properties and methods
const _start:Symbol = Symbol();
const _consoleError:Symbol = Symbol();

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
    static EVENT_ERROR:string                  = "error";

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

        this.enableDefaultErrorListener();
    }

    /**
     * Enable default error listener
     */
    enableDefaultErrorListener():void
    {
        // $FlowFixMe
        this.on(Application.EVENT_ERROR, this[_consoleError]);
    }

    /**
     * Disable default error listener
     */
    disableDefaultErrorListener():void
    {
        // $FlowFixMe
        this.removeListener(Application.EVENT_ERROR, this[_consoleError]);
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
     * Get bundle directory path
     *
     * @param   {BundleInterface}   bundle  Bundle instance
     * @return  {string}                    Bundle directory path
     */
    getBundleDirectoryPath(bundle:BundleInterface):?string
    {
        return bundle.getPath();
    }

    /**
     * Set configuration file
     *
     * @param   {string}    filePath    Configuration file path
     * @param   {string}    format      File format
     */
    setConfigurationFile(filePath:string, format:string):void
    {
        this.configurationFilePath = path.resolve(filePath);
        this.configurationFileFormat = format;
    }

    /**
     * Add confguration properties
     *
     * @param   {object}    properties  Configuration properties
     */
    addConfigurationProperties(properties:Object):void
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
                await self.emit(Application.EVENT_ERROR, error);
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
            if (typeof bundle.installDependencies === "function") {
                await bundle.installDependencies(this);
            }
        }

        // Initialize registered bundles
        for (let bundle of this.bundles) {
            if (typeof bundle.initialize === "function") {
                await bundle.initialize(this);
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
            if (typeof bundle.boot === "function") {
                await bundle.boot();
            }
        }
        await this.emit(Application.EVENT_BUNDLES_BOOTED, this);

        // Start the application
        this.emit(Application.EVENT_START, this, parameters);
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

    /**
     * Write an error to the stderr
     *
     * @param   {Error}     error   Error instance
     */
    // $FlowFixMe
    [_consoleError](error)
    {
        console.error("[Solfege Error]", error);
    }
}
