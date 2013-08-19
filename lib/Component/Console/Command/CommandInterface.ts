/**
 * The interface of a command for the CLI
 *
 * @namespace Component.Console.Command
 * @interface CommandInterface
 */
interface CommandInterface
{
    /**
     * Get the name of the command
     *
     * @return  {string}        The name
     */
    getName():string;

    /**
     * Get the description of the command
     *
     * @return  {string}        The description
     */
    getDescription():string;

    /**
     * Get the function of the command
     *
     * @return  {Function}      The function
     */
    getFunction():Function;

    /**
     * Execute the function of the command
     *
     * @param   {Array}     parameters      Function parameters
     * @return  {any}                       Result
     */
    execute(parameters?:Array):any;
}

export = CommandInterface;