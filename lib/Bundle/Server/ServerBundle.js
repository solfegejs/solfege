var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Application = require('../../Component/Kernel/Application');
var Bundle = require('../../Component/Kernel/Bundle/Bundle');
var Command = require('../../Component/Console/Command/Command');

var ServerBundle = (function (_super) {
    __extends(ServerBundle, _super);
    function ServerBundle() {
        var command;

        _super.call(this);

        command = new Command('server:start', 'Start the web server', this.startServer.bind(this));
        this.addConsoleCommand(command);

        command = new Command('server:stop', 'Stop the web server', this.stopServer.bind(this));
        this.addConsoleCommand(command);
    }
    ServerBundle.prototype.startServer = function () {
        var daemon = this.getDaemon();

        daemon.start();
    };

    ServerBundle.prototype.stopServer = function () {
        var daemon = this.getDaemon();

        daemon.stop();
    };

    ServerBundle.prototype.getDaemon = function () {
        if (this.daemon) {
            return this.daemon;
        }

        var charm = require('charm')();
        charm.pipe(process.stdout);

        var sha1 = require('sha1');
        var application = this.getApplication();
        var applicationRootDirectory = application.getRootDirectory();
        var applicationName = "app_" + sha1(applicationRootDirectory);
        this.daemon = require("daemonize2").setup({
            main: __dirname + "/app.js",
            name: applicationName,
            pidfile: applicationName + ".pid",
            silent: true,
            argv: [
                applicationRootDirectory
            ]
        });

        this.daemon.on("starting", function () {
            charm.foreground('white').write("Starting web server ... ");
        });
        this.daemon.on("started", function (pid) {
            charm.foreground('green').write("OK (PID: " + pid + ")");
        });
        this.daemon.on("stopping", function () {
            charm.foreground('white').write("Stopping web server ... ");
        });
        this.daemon.on("stopped", function (pid) {
            charm.foreground('green').write("OK (PID: " + pid + ")");
        });
        this.daemon.on("running", function (pid) {
            charm.foreground('yellow').write("The web server is already running. PID: " + pid);
        });
        this.daemon.on("notrunning", function () {
            charm.foreground('yellow').write("The web server is not running.");
        });
        this.daemon.on("error", function (error) {
            charm.foreground('red').write("ERROR\n");
            charm.foreground('white').write("The web server fail to start: ").foreground('yellow').write(error.message);
        });

        return this.daemon;
    };
    return ServerBundle;
})(Bundle);


module.exports = ServerBundle;

