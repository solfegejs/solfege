import Bundle = module('../../Component/Kernel/Bundle/Bundle');
import Command = module('../../Component/Console/Command/Command');

/**
 * The web server
 *
 * @namespace Bundle.Server
 * @class ServerBundle
 * @constructor
 */
class ServerBundle extends Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        var command:Command;

        super();

        // Add the command to start the web server
        command = new Command('server:start', 'Start the web server', this.startServer.bind(this));
        this.addConsoleCommand(command);

        // Add the command to stop the web server
        command = new Command('server:stop', 'Stop the web server', this.stopServer.bind(this));
        this.addConsoleCommand(command);
    }

    /**
     * Start the server
     */
    public startServer()
    {
        console.log("start ...");
    }

    /**
     * Stop the server
     */
    public stopServer()
    {
        console.log("stop ...");
    }
}

export = ServerBundle;