import ContainerAwareCommand from "./Command/ContainerAwareCommand";

/**
 * Commands registry
 */
export default class CommandsRegistry
{
    /**
     * Constructor
     *
     * @param   {Container}     container   The service container
     */
    constructor(container)
    {
        this.container = container;

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
        if (command instanceof ContainerAwareCommand) {
            command.setContainer(this.container);
        }

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
