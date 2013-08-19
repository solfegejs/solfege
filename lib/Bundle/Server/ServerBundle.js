var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        console.log("start ...");
    };

    ServerBundle.prototype.stopServer = function () {
        console.log("stop ...");
    };
    return ServerBundle;
})(Bundle);


module.exports = ServerBundle;

