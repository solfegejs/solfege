
var ListenerFile = require("./ListenerFile");

var Logger = (function () {
    function Logger() {
        if (Logger.singletonInstance) {
            throw new Error("Instantiation failed: Use Logger.getInstance() instead of new.");
        }
        Logger.singletonInstance = this;

        this.winston = require('winston');
        this.winston.remove(this.winston.transports.Console);
    }
    Logger.getInstance = function () {
        if (Logger.singletonInstance === null) {
            Logger.singletonInstance = new Logger();
        }
        return Logger.singletonInstance;
    };

    Logger.prototype.addListener = function (listener) {
        var filePath;

        if (listener instanceof ListenerFile) {
            filePath = (listener).getFilePath();

            this.winston.add(this.winston.transports.File, {
                filename: filePath,
                handleExceptions: true
            });
        }
    };

    Logger.prototype.log = function (level, message) {
        this.winston.log(level, message);
    };

    Logger.prototype.info = function (message) {
        this.winston.info(message);
    };
    Logger.singletonInstance = null;
    return Logger;
})();


module.exports = Logger;

