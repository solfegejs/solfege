import Application from "../../kernel/Application";
import {bindGenerator} from "../../utils/GeneratorUtil";
import colors from "colors";
import minimist from "minimist";
import CommandCompilerPass from "./DependencyInjection/Compiler/CommandCompilerPass";

/**
 * Console bundle
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.application;
        this.container;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application)
    {
        this.application = application;

        // Listen the application start
        this.application.on(Application.EVENT_START, bindGenerator(this, this.onStart));
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container       Service container
     */
    *configureContainer(container)
    {
        this.container = container;

        // Add the compiler pass that handle command tags
        this.container.addCompilerPass(new CommandCompilerPass());
    }

    /**
     * The application is started
     *
     * @param   {solfege/kernel/Application}    application     The application
     * @param   {Array}                         parameters      The parameters
     */
    *onStart(application, parameters)
    {
        yield this.displayGlobalHelp();
    }

    /**
     * Display global help
     */
    *displayGlobalHelp()
    {
        // Get commands
        let commandsRegistry = yield this.container.get("solfege_console_commands_registry");
        let commands = commandsRegistry.getCommands();

        // Display the header
        let title = "SolfegeJS CLI";

        console.info(title.bgBlack.cyan);
        console.info("-".repeat(title.length).bgBlack.cyan+"\n");
    }
}
