import CommandInterface = module('../../Console/Command/CommandInterface');
import ControllerInterface = module("../Controller/ControllerInterface");
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
     * Get the bundle path (on the server)
     *
     * @return  {string}     Bundle path
     */
    getPath():string;

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

    /**
     * Get the controller instance
     *
     * @param   {string}                                             name   The controller name
     * @return  {Component.Kernel.Controller.ControllerInterface}           The controller instance
     */
    getController(name:string):ControllerInterface;
}

export = BundleInterface;