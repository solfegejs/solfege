

var Application = require('../Application');

var Bundle = (function () {
    function Bundle() {
        this.consoleCommands = [];

        this.name = this["constructor"].name;
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

    Bundle.prototype.getConsoleCommands = function () {
        return this.consoleCommands;
    };
    return Bundle;
})();


module.exports = Bundle;

