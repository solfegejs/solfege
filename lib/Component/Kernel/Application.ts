import BundleInterface = module('./Bundle/BundleInterface');
import Bundle = module('./Bundle/Bundle');
import ConfigurationLoader = module('../Configuration/Loader');

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
    constructor(root:string, environment:string = null, debug:boolean = false)
    {
        var nodePath = require('path'),
            nodeFs = require('fs');

        // Set general properties
        this.bundles        = [];
        this.rootDirectory  = root;
        this.environment    = environment;
        this.debug          = debug;
        this.libDirectory   = nodePath.resolve(__dirname, '..', '..');

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
        var loader:ConfigurationLoader,
            bundleIndex, bundlePath, bundleClass, bundle:BundleInterface,
            error;
        
        // Load the configuration file based on the environment
        loader = new ConfigurationLoader();
        loader.addVariable('solfege.lib_dir', this.libDirectory);
        loader.addVariable('solfege.bundle_dir', this.libDirectory + '/Bundle');
        loader.addVariable('application.root_dir', this.rootDirectory);
        loader.addVariable('application.bundle_dir', this.rootDirectory + '/bundles');
        this.configuration = loader.load(path + '/config.json');

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
     * @param   {Object}    request        The request
     * @param   {Object}    response       The response
     */
    public handleRequest(request, response)
    {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end("Hello world");
    }
}

export = Application;