import Input = module('./Input');

/**
 * Input from the CLI arguments
 *
 * @namespace Component.Console.Input
 * @class ArgvInput
 * @constructor
 */
class ArgvInput extends Input
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        // Filter the inputs from the command line
        process.argv.forEach(this.argvFilter.bind(this));
    }

    /**
     * Filter the inputs from the command line
     *
     * @param   {string}    value        The value of the argument
     * @param   {number}    index        The index of the argument
     * @param   {Array}     array        The reference of the array
     */
    private argvFilter(value:string, index:number, array:Array)
    {
        if (index < 2) {
            return;
        } 

        this.addArgument(value);
    }
}

export = ArgvInput;