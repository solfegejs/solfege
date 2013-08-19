var Input = require('./Input/Input');


var Application = (function () {
    function Application(name, version) {
        if (typeof name === "undefined") { name = 'UNKNOWN'; }
        if (typeof version === "undefined") { version = 'UNKNOWN'; }
        this.name = name;
        this.version = version;

        this.commands = {};
    }
    Application.prototype.run = function (input) {
        var arguments = input.getArguments(), argument, command;

        while (arguments.length > 0) {
            argument = arguments.shift();

            switch (argument) {
                case '--help':
                    this.displayHelp();
                    return;
            }

            command = this.getCommand(argument);
            if (!command) {
                this.displayHelp();
                return;
            }

            command.execute(arguments);
            return;
        }

        this.displayHelp();
    };

    Application.prototype.displayHelp = function () {
        var charm = require('charm')(), stringHelper = require('string'), sectionLength, sectionIndex, sectionNames, sectionName, section, commandLength, commandIndex, commandNames, commandName, commandDescription, commands, command, commandWidth;

        commandWidth = 23;

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
        charm.foreground('green').write("    " + stringHelper("--help").padRight(commandWidth).s + " ");
        charm.foreground('white').write("Display this help message.\n");

        sectionNames = Object.keys(this.commands).sort();
        sectionLength = sectionNames.length;
        charm.write("\n");
        for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex++) {
            sectionName = sectionNames[sectionIndex];
            section = this.commands[sectionName];

            charm.foreground('yellow');
            charm.write("Commands from " + sectionName + ":\n");

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

                charm.foreground('green').write("    " + stringHelper(commandName).padRight(commandWidth).s + " ");

                charm.foreground('white').write(commandDescription);

                charm.write("\n");
            }

            charm.write("\n");
        }

        console.log("");
    };

    Application.prototype.getCommand = function (name) {
        var sectionName, section, commandIndex, command, commandName;

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
    };

    Application.prototype.addCommands = function (sectionName, commands) {
        if (commands.length <= 0) {
            return;
        }

        if (this.commands[sectionName] instanceof Array === false) {
            this.commands[sectionName] = [];
        }

        this.commands[sectionName] = this.commands[sectionName].concat(commands);
    };
    return Application;
})();


module.exports = Application;

