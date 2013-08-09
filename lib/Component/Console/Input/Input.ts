/**
 * Input of the console application
 *
 * @namespace Component.Console.Input
 * @class Input
 * @constructor
 */
class Input
{
    /**
     * Arguments
     *
     * @property arguments
     * @type {Array}
     * @private
     */
    private arguments;

    /**
     * Constructor
     */
    constructor()
    {
        this.arguments = [];
    }

    /**
     * Get the arguments
     *
     * @return  {Array}    The arguments
     */
    public getArguments()
    {
        return this.arguments;
    }

    /**
     * Add an argument
     *
     * @param   {string}    value       An argument
     */
    public addArgument(value:string)
    {
        this.arguments.push(value);
    }
}

export = Input;