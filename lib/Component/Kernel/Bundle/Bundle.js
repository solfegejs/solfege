

var Application = require('../Application');

var Bundle = (function () {
    function Bundle() {
        this.name = this["constructor"].name;

        this.isCommandsInitialized = false;
        this.consoleCommands = [];
    }
    Bundle.prototype.getName = function () {
        return this.name;
    };

    Bundle.prototype.setName = function (name) {
        this.name = name;
    };

    Bundle.prototype.getApplication = function () {
        return this.application;
    };

    Bundle.prototype.setApplication = function (application) {
        this.application = application;
    };

    Bundle.prototype.addConsoleCommand = function (command) {
        this.consoleCommands.push(command);
    };

    Bundle.prototype.initializeConsoleCommands = function () {
        this.isCommandsInitialized = true;
    };

    Bundle.prototype.getConsoleCommands = function () {
        if (!this.isCommandsInitialized) {
            this.initializeConsoleCommands();
        }

        return this.consoleCommands;
    };
    return Bundle;
})();


module.exports = Bundle;

