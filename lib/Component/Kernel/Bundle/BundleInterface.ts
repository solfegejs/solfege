import CommandInterface = module('../../Console/Command/CommandInterface');
//import Application = module('../Application');

/**
 * Interface of a bundle
 *
 * @namespace Component.Kernel.Bundle
 * @interface BundleInterface
 */
interface BundleInterface
{
    /**
     * Get the bundle name
     *
     * @return  {string}     The name
     */
    getName():string;

    /**
     * Set the bundle name
     *
     * @param   {string}     The name
     */
    setName(name:string);

    /**
     * Get the application instance
     *
     * @return  {Component.Kernel.Application}      Application instance
     */
    getApplication();

    /**
     * Set the application instance
     *
     * @param   {Component.Kernel.Application}      application         Application instance
     */
    setApplication(application);

    /**
     * Get the commands for the CLI
     *
     * @return  {Array}     The command list
     */
    getConsoleCommands():CommandInterface[];
}

export = BundleInterface;