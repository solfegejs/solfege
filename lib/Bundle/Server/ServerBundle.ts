import Application = module('../../Component/Kernel/Application');
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
     * Daemon instance
     *
     * @property daemon
     * @type {Object}
     * @private
     */
    private daemon:any;

    /**
     * The environment of the application
     *
     * @property environment
     * @type {string}
     * @private
     */
    private environment:string;


    /**
     * Constructor
     */
    constructor()
    {
        super(__dirname);

        this.environment = "prod";
    }

    /**
     * Initialize the console commands
     */
    public initializeConsoleCommands()
    {
        var command:Command;

        // Add the command to start the web server
        command = new Command("server:start", "Start the web server", this.startServer.bind(this));
        this.addConsoleCommand(command);

        // Add the command to stop the web server
        command = new Command('server:stop', "Stop the web server", this.stopServer.bind(this));
        this.addConsoleCommand(command);

        super.initializeConsoleCommands();
    }

    /**
     * Start the server
     *
     * @param   {string}    environment     The environment of application
     */
    public startServer(environment:string = "prod")
    {
        this.environment = environment;

        var daemon = this.getDaemon();
        daemon.start();
    }

    /**
     * Stop the server
     */
    public stopServer()
    {
        var daemon = this.getDaemon();
        daemon.stop();
    }

    /**
     * Get the daemon instance
     */
    private getDaemon()
    {
        if (this.daemon) {
            return this.daemon;
        }

        // Initialize "charm"
        var charm = require("charm")();
        charm.pipe(process.stdout);

        // Initialize "daemonize2"
        var os = require("os");
        var sha1 = require("sha1");
        var application:Application = this.getApplication();
        var applicationRootDirectory:string = application.getRootDirectory();
        var applicationName:string = "app_" + sha1(applicationRootDirectory);
        var applicationEnvironment:string = this.environment;
        this.daemon = require("daemonize2").setup({
            main: __dirname + "/app.js",
            name: applicationName,
            pidfile: os.tmpdir() + applicationName + ".pid",
            silent: true,
            argv: [
                applicationRootDirectory,
                applicationEnvironment
            ]
        });

        this.daemon.on("starting", function()
        {
            charm.foreground("white").write("Starting web server (environment: " + applicationEnvironment + ") ... ");
        });
        this.daemon.on("started", function(pid)
        {
            charm.foreground("green").write("OK (PID: " + pid + ")");
        });
        this.daemon.on("stopping", function()
        {
            charm.foreground("white").write("Stopping web server ... ");
        });
        this.daemon.on("stopped", function(pid)
        {
            charm.foreground("green").write("OK (PID: " + pid + ")");
        });
        this.daemon.on("running", function(pid)
        {
            charm.foreground("yellow").write("The web server is already running. PID: " + pid);
        });
        this.daemon.on("notrunning", function()
        {
            charm.foreground("yellow").write("The web server is not running.");
        });
        this.daemon.on("error", function(error)
        {
            charm.foreground("red").write("ERROR\n");
            charm.foreground("white").write("The web server fail to start: ").foreground("yellow").write(error.message);
        });

        return this.daemon;
    }
}

export = ServerBundle;