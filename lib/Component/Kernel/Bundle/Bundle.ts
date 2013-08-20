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
     * Indicates that the commands are initialized
     *
     * @property isCommandsInitialized
     * @type {boolean}
     * @private
     */
    private isCommandsInitialized:boolean;

    /**
     * Commands for the CLI
     *
     * @property consoleCommands
     * @type {Array}
     * @private
     */
    private consoleCommands:CommandInterface[];


    /**
     * Constructor
     */
    constructor()
    {
        // Default name
        // Note: I don't write this.constructor in order to pass the TypeScript compiler
        this.name = this["constructor"].name;

        // Initialize the command list
        this.isCommandsInitialized = false;
        this.consoleCommands = [];
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
     * Initialize the console commands
     * Override this to initialize the commands when necessary.
     */
    public initializeConsoleCommands()
    {
        this.isCommandsInitialized = true;
    }

    /**
     * Get the commands for the CLI
     *
     * @return  {Array}     The command list
     */
    public getConsoleCommands():CommandInterface[]
    {
        if (!this.isCommandsInitialized) {
            this.initializeConsoleCommands();
        }

        return this.consoleCommands;
    }
}

export = Bundle;
