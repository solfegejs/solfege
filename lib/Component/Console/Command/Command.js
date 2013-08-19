

var Command = (function () {
    function Command(name, description, commandFunction) {
        this.name = name;
        this.description = description;
        this.commandFunction = commandFunction;
    }
    Command.prototype.getName = function () {
        return this.name;
    };

    Command.prototype.getDescription = function () {
        return this.description;
    };

    Command.prototype.getFunction = function () {
        return this.commandFunction;
    };

    Command.prototype.execute = function (parameters) {
        if (typeof parameters === "undefined") { parameters = []; }
        return this.commandFunction.apply(this, parameters);
    };
    return Command;
})();


module.exports = Command;

