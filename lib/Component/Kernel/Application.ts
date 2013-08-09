import BundleInterface = module('./Bundle/BundleInterface');

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
     * Constructor
     *
     * @param   {string}    environment     The environment of the runtime
     * @param   {boolean}   debug           Indicates that the debug mode is enabled
     */
    constructor(environment:string = null, debug:boolean = false)
    {
    }

    /**
     * Load configuration
     *
     * @param   {string}    path        Directory path
     */
    public loadConfiguration(path:string)
    {

    }

    /**
     * Get the registred bundles
     *
     * @return  {Array}     The bundle list
     */
    public getBundles()
    {
        
    }

    /**
     * Register a bundle
     *
     * @param   {Component.Kernel.Bundle.BundleInterface}   bundle      Bundle instance
     */
    public registerBundle(bundle:BundleInterface)
    {
        
    }
}

export = Application;