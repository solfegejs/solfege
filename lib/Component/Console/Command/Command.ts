import CommandInterface = module('./CommandInterface');

/**
 * A basic command for the CLI
 *
 * @namespace Component.Console.Command
 * @class Command
 * @constructor
 */
class Command implements CommandInterface
{
    /**
     * The command name
     *
     * @property name
     * @type {string}
     * @private
     */
    private name:string;

    /**
     * The command description
     *
     * @property description
     * @type {string}
     * @private
     */
    private description:string;

    /**
     * The command function
     *
     * @property commandFunction
     * @type {Function}
     * @private
     */
    private commandFunction:Function;

    /**
     * Constructor
     *
     * @param   {string}    name                The command name
     * @param   {string}    description         The command description
     * @param   {Functon}   commandFunction     The command function
     */
    constructor(name:string, description:string, commandFunction:Function)
    {
        this.name = name;
        this.description = description;
        this.commandFunction = commandFunction;
    }

    /**
     * Get the name of the command
     *
     * @return  {string}        The name
     */
    public getName():string
    {
        return this.name;
    }

    /**
     * Get the description of the command
     *
     * @return  {string}        The description
     */
    public getDescription():string
    {
        return this.description;
    }

    /**
     * Get the function of the command
     *
     * @return  {Function}      The function
     */
    public getFunction():Function
    {
        return this.commandFunction;
    }

    /**
     * Execute the function of the command
     *
     * @param   {Array}     parameters      Function parameters
     * @return  {any}                       Result
     */
    public execute(parameters:Array = []):any
    {
        return this.commandFunction.apply(this, parameters);
    }
}

export = Command;