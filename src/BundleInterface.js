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
}

export interface InitializableBundleInterface
{
    /**
     * Initialize the bundle
     *
     * @param   {Application}   application     Solfege application instance
     */
    initialize(application:Application):void | Generator<*,void,*>;
}

export interface DependentBundleInterface
{
    /**
     * Get dependencies
     *
     * @return  {Array<BundleInterface>}    Dependent bundles
     */
    getDependencies():Array<BundleInterface>;
}

export interface BootableBundleInterface
{
    /**
     * Boot the bundle
     */
    boot():void | Generator<*,void,*>;
}
