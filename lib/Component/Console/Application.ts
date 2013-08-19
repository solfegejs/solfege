import Input = module('./Input/Input');
import CommandInterface = module('../Console/Command/CommandInterface');

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
     * Command list by section
     *
     * @property commands
     * @type {object}
     * @private
     */
    private commands:Object;


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

        this.commands   = {};
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
        var arguments:string[] = input.getArguments(),
            argument:string,
            command:CommandInterface;

        while (arguments.length > 0) {
            argument = arguments.shift();

            // Check if the argument is an option
            switch (argument) {
                case '--help':
                    this.displayHelp();
                    return;
            }

            // Check if the argument is a command
            command = this.getCommand(argument);
            if (!command) {
                // It is not an available command. Display the help.
                this.displayHelp();
                return;
            }

            // Execute the command with the rest of the arguments as parameters
            command.execute(arguments);
            return;
        }

        // Display the help
        this.displayHelp();
    }

    /**
     * Display the help
     */
    public displayHelp()
    {
        var charm = require('charm')(),
            stringHelper = require('string'),
            sectionLength:number,
            sectionIndex:number,
            sectionNames:string[], 
            sectionName:string, 
            section:CommandInterface[],
            commandLength:number, 
            commandIndex:number, 
            commandNames:string[], 
            commandName:string, 
            commandDescription:string,
            commands:Object,
            command:CommandInterface,
            commandWidth:number;


        // Set the command width
        commandWidth = 23;

        // Initialize "charm"
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
        charm.foreground('green').write("    " + stringHelper("--help").padRight(commandWidth).s + " ");
        charm.foreground('white').write("Display this help message.\n");

        // Display the available commands
        // The sections are sorted alphabeticaly
        sectionNames = Object.keys(this.commands).sort();
        sectionLength = sectionNames.length;
        charm.write("\n");
        for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex++) {
            sectionName = sectionNames[sectionIndex];
            section = this.commands[sectionName];

            // Display the name of the section
            charm.foreground('yellow');
            charm.write("Commands from " + sectionName + ":\n");

            // Sort and display the commands of the current section
            commandLength = section.length;
            commands = {};
            for (commandIndex = 0; commandIndex < commandLength; commandIndex++) {
                command = section[commandIndex];
                commandName = command.getName();
                commands[commandName] = command;
            }
            commandNames = Object.keys(commands).sort();
            for (commandIndex = 0; commandIndex < commandLength; commandIndex++) {
                commandName = commandNames[commandIndex];
                command = commands[commandName];
                commandDescription = command.getDescription();

                // Display the command name
                charm.foreground('green').write("    " + stringHelper(commandName).padRight(commandWidth).s + " ");

                // Display the description
                charm.foreground('white').write(commandDescription);

                charm.write("\n");
            }

            charm.write("\n");
        }

        // End
        console.log("");
    }

    /**
     * Get a command by his name
     *
     * @param   {string}    name        Command name
     */
    public getCommand(name:string):CommandInterface
    {
        var sectionName:string,
            section:Object,
            commandIndex:any,
            command:CommandInterface,
            commandName:string;

        for (sectionName in this.commands) {
            section = this.commands[sectionName];

            for (commandIndex in section) {
                command = section[commandIndex];
                commandName = command.getName();

                if (commandName === name) {
                    return command;
                }
            }
        }

        return null;
    }

    /**
     * Add commands into a section
     *
     * @param   {string}                sectionName         The section name
     * @param   {CommandInterface[]}    commands            The command list
     */
    public addCommands(sectionName:string, commands:CommandInterface[])
    {
        // Do nothing if there is no commands
        if (commands.length <= 0) {
            return;
        }

        // Create the section if not exist
        if (this.commands[sectionName] instanceof Array === false) {
            this.commands[sectionName] = [];
        }

        // Add the commands into the section
        this.commands[sectionName] = this.commands[sectionName].concat(commands);
    }
}


export = Application;