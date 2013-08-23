


var Application = require('../Application');

var Bundle = (function () {
    function Bundle(path) {
        this.path = path;

        this.name = this["constructor"].name;

        this.isCommandsInitialized = false;
        this.consoleCommands = [];
    }
    Bundle.prototype.getName = function () {
        return this.name;
    };

    Bundle.prototype.getPath = function () {
        return this.path;
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

    Bundle.prototype.getController = function (name) {
        var controllerClass, controller;

        try  {
            controllerClass = require(this.path + "/Controller/" + name + "Controller");
            controller = new controllerClass();
            return controller;
        } catch (error) {
        }

        return null;
    };
    return Bundle;
})();


module.exports = Bundle;

