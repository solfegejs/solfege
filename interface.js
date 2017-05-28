/* @flow */

/**
 * Bundle interface
 */
export interface BundleInterface
{
    /**
     * Get bundle path
     *
     * @return  {string}    Directory path
     */
    getPath():string;
}

/**
 * Dependent bundle interface
 *
 * It installs bundle dependencies
 */
export interface DependentBundleInterface
{
    /**
     * Install dependencies
     *
     * @param   {ApplicationInterface}  application     Solfege Application
     */
    installDependencies(application:ApplicationInterface):void|Generator<void,void,void>;
}

/**
 * Initializable bundle interface
 */
export interface InitializableBundleInterface
{
    /**
     * Initialize the bundle
     *
     * @param   {ApplicationInterface}  application     Solfege Application
     */
    initialize(application:ApplicationInterface):void|Generator<void,void,void>;
}

/**
 * Bootable bundle interface
 */
export interface BootableBundleInterface
{
    /**
     * Boot the bundle
     */
    boot():void|Generator<void,void,void>;
}

/**
 * Configuration interface
 */
export interface ConfigurationInterface
{
    /**
     * Set the directory path of the configuration
     *
     * @param   {string}    path    Directory path
     */
    setDirectoryPath(path:string):void;

    /**
     * Get the directory path of the configuration
     *
     * @return  {string}    Directory path
     */
    getDirectoryPath():string;

    /**
     * Add properties
     *
     * @param   {Object}    properties  Properties
     */
    addProperties(properties:Object):void;

    /**
     * Get a property name from configuration
     *
     * @param   {string}    propertyName    The property name
     * @return  {*}                         The property value
     */
    get(propertyName:string):any;

    /**
     * Resolve a property value
     *
     * @param   {*}     value   Property value
     * @return  {*}             Resolved property value
     */
    resolvePropertyValue(value:any):any;

    /**
     * Indicates that a property value has dependency with another property
     *
     * @param   {*}         propertyValue   PropertyValue
     * @return  {boolean}                   true if the value has dependency, false otherwise
     */
    propertyHasDependency(propertyValue:any):boolean;
}

/**
 * Application interface
 */
export interface ApplicationInterface
{
    /**
     * Add a bundle to the registry
     *
     * @param   {BundleInterface}   bundle  A bundle
     */
    addBundle(bundle:BundleInterface):void;

    /**
     * Get bundles
     *
     * @return  {Set}           The bundles
     */
    getBundles():Set<BundleInterface>;
}
