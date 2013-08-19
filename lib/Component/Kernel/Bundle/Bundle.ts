import BundleInterface = module('./BundleInterface');
import CommandInterface = module('../../Console/Command/CommandInterface');
import Application = module('../Application');

/**
 * Base class of a bundle
 *
 * @namespace Component.Kernel.Bundle
 * @class Bundle
 * @constructor
 */
class Bundle implements BundleInterface
{
    /**
     * Commands for the CLI
     *
     * @property consoleCommands
     * @type {Array}
     * @private
     */
    private consoleCommands:CommandInterface[];

    /**
     * Bundle name
     *
     * @property name
     * @type {string}
     * @private
     */
    private name:string;

    /**
     * Application instance
     *
     * @property application
     * @type {Component.Kernel.Application}
     * @private
     */
    private application:Application;


    /**
     * Constructor
     */
    constructor()
    {
        this.consoleCommands = [];

        // Default name
        // Note: I don't write this.constructor in order to pass the TypeScript compiler
        this.name = this["constructor"].name;
    }

    /**
     * Get the bundle name
     *
     * @return  {string}     The name
     */
    public getName():string
    {
        return this.name;
    }

    /**
     * Set the bundle name
     *
     * @param   {string}     The name
     */
    public setName(name:string)
    {
        this.name = name;
    }

    /**
     * Get the application instance
     *
     * @return  {Component.Kernel.Application}      Application instance
     */
    public getApplication():Application
    {
        return this.application;
    }

    /**
     * Set the application instance
     *
     * @param   {Component.Kernel.Application}      application         Application instance
     */
    public setApplication(application:Application)
    {
        this.application = application;
    }

    /**
     * Add a console command
     *
     * @param   {Component.Console.Command.CommandInterface}    command     Command instance
     */
    public addConsoleCommand(command:CommandInterface)
    {
        this.consoleCommands.push(command);
    }

    /**
     * Get the commands for the CLI
     *
     * @return  {Array}     The command list
     */
    public getConsoleCommands():CommandInterface[]
    {
        return this.consoleCommands;
    }
}

export = Bundle;
