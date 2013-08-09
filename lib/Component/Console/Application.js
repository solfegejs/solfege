var Input = require('./Input/Input');

var Application = (function () {
    function Application(name, version) {
        if (typeof name === "undefined") { name = 'UNKNOWN'; }
        if (typeof version === "undefined") { version = 'UNKNOWN'; }
        this.name = name;
        this.version = version;
    }
    Application.prototype.run = function (input) {
        var arguments = input.getArguments();

        this.displayHelp();
    };

    Application.prototype.displayHelp = function () {
        var charm = require('charm')();
        charm.pipe(process.stdout);

        charm.foreground('green');
        charm.write(this.name + ' ' + this.version);
        charm.write("\n\n");

        charm.foreground('yellow');
        charm.write("Usage: \n");
        charm.foreground('white');
        charm.write("    [options] command [arguments]\n");

        charm.write("\n");
        charm.foreground('yellow');
        charm.write("Options: \n");
        charm.foreground('green').write("    --help               ");
        charm.foreground('white').write("Display this help message.\n");

        charm.write("\n");

        console.log("");
    };
    return Application;
})();


module.exports = Application;

