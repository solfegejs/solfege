import BundleInterface = module('./BundleInterface');
import CommandInterface = module('../../Console/Command/CommandInterface');

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
     */
    public name;

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
    public getName()
    {
        return this.name;
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
