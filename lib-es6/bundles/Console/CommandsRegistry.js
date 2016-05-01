/**
 * Commands registry
 */
export default class CommandsRegistry
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize commands
        this.commands = new Set();
    }

    /**
     * Add command
     *
     * @param   {Object}    command     Command
     */
    addCommand(command)
    {
        this.commands.add(command);
    }

    /**
     * Get commands
     *
     * @return  {Set}                   Commands
     */
    getCommands()
    {
        return this.commands;
    }
}
