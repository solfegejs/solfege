import BundleInterface = module('./Bundle/BundleInterface');
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
    private bundles;

    /**
     * The environment of the runtime
     *
     * @property environ
     * @type {string}
     * @private
     */
    private environment;

    /**
     * Indicates that the debug mode is enabled
     *
     * @property debug
     * @type {boolean}
     * @private
     */
    private debug;

    /**
     * The directory path of the Solfege library
     *
     * @property libDirectory
     * @type {string}
     */
    public libDirectory;


    /**
     * Constructor
     *
     * @param   {string}    environment     The environment of the runtime
     * @param   {boolean}   debug           Indicates that the debug mode is enabled
     */
    constructor(environment:string = null, debug:boolean = false)
    {
        var nodePath = require('path');

        // Set general properties
        this.bundles        = [];
        this.environment    = environment;
        this.debug          = debug;
        this.libDirectory   = nodePath.resolve(__dirname, '..', '..');
    }

    /**
     * Load configuration
     *
     * @param   {string}    path        Directory path
     */
    public loadConfiguration(path:string)
    {
        var loader:ConfigurationLoader, 
            configuration,
            bundleIndex, bundlePath, bundleClass, bundle:BundleInterface;
        
        // Load the configuration file based on the environment
        loader = new ConfigurationLoader();
        loader.addVariable('solfege.lib_dir', this.libDirectory);
        loader.addVariable('solfege.bundle_dir', this.libDirectory + '/Bundle');
        configuration = loader.load(path + '/config.json');

        // Initialize the bundles
        // @todo Check if Array.isArray(configuration.bundles) is faster
        if (configuration.bundles instanceof Array) {
            for (bundleIndex in configuration.bundles) {
                bundlePath = configuration.bundles[bundleIndex];

                // Instantiate the bundle
                bundleClass = require(bundlePath);
                bundle = new bundleClass();

                // Register the bundle
                this.registerBundle(bundle);
            }
        }

    }

    /**
     * Get the registred bundles
     *
     * @return  {Array}     The bundle list
     */
    public getBundles()
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
}

export = Application;