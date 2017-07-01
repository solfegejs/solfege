/* @flow */
import type Application from "./Application"

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

    /**
     * Get dependencies
     *
     * @return  {Array<BundleInterface>}    Dependent bundles
     */
    getDependencies():Array<BundleInterface>;

    /**
     * Initialize the bundle
     *
     * @param   {Application}   application     Solfege application instance
     */
    initialize(application:Application):void | Generator<*,void,*>;

    /**
     * Boot the bundle
     */
    boot():void | Generator<*,void,*>;
}


