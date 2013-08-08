import Input = module('./Input/Input');

/**
 * The main entry point of a collection of commands
 *
 * @namespace Component.Console
 * @class Application
 * @constructor
 */
class Application
{
    /**
     * The name of the application
     *
     * @property name
     * @type {string}
     * @private
     */
    private name:string;

    /**
     * The version of the application
     *
     * @property version
     * @type {string}
     * @private
     */
    private version:string;


    /**
     * Constructor
     *
     * @param   {string}    name        The name of the application
     * @param   {string}    version     The version of the application
     */
    constructor(name:string = 'UNKNOWN', version:string = 'UNKNOWN')
    {
        this.name       = name;
        this.version    = version;
    }

    /**
     * Run the application
     *
     * @method run
     *
     * @param   {Component.Console.Input.Input}     input       Input instance
     */
    public run(input:Input)
    {
        var arguments = input.getArguments();

        // Display the help
        this.displayHelp();
    }

    /**
     * Display the help
     */
    public displayHelp()
    {
        var charm = require('charm')();
        charm.pipe(process.stdout);

        // Display the name and the version
        charm.foreground('green');
        charm.write(this.name + ' ' + this.version);
        charm.write("\n\n");

        // Display the usage
        charm.foreground('yellow');
        charm.write("Usage: \n");
        charm.foreground('white');
        charm.write("    [options] command [arguments]\n");

        // Display the options
        charm.write("\n");
        charm.foreground('yellow');
        charm.write("Options: \n");
        charm.foreground('green').write("    --help               ");
        charm.foreground('white').write("Display this help message.\n");

        // Display the available commands
        charm.write("\n");

        // End
        console.log("");
    }
}


export = Application;