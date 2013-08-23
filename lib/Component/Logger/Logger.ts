import ListenerInterface = module("./ListenerInterface");
import ListenerFile = module("./ListenerFile");

/**
 * The logger
 *
 * @namespace Component.Logger
 * @class Logger
 * @constructor
 */
class Logger
{
    /**
     * Singleton instance
     *
     * @property singletonInstance
     * @type {Component.Logger.Logger}
     * @private
     */
    private static singletonInstance:Logger = null;

    /**
     * Winston instance
     *
     * @see https://github.com/flatiron/winston/
     * @property winston
     * @type {any}
     * @private
     */
    private winston:any;

    /**
     * Constructor
     */
    constructor()
    {
        if(Logger.singletonInstance){
            throw new Error("Instantiation failed: Use Logger.getInstance() instead of new.");
        }
        Logger.singletonInstance = this;

        this.winston = require('winston');
        this.winston.remove(this.winston.transports.Console);
    }

    public static getInstance():Logger
    {
        if(Logger.singletonInstance === null) {
            Logger.singletonInstance = new Logger();
        }
        return Logger.singletonInstance;
    }

    /**
     * Add a listener
     *
     * @param   {Component.Logger.ListenerInterface}    listener        The listener instance
     */
    public addListener(listener:ListenerInterface)
    {
        var filePath:string;

        // Add file listener
        if (listener instanceof ListenerFile) {
            filePath = (<ListenerFile> listener).getFilePath();

            this.winston.add(this.winston.transports.File, {
                filename: filePath,
                handleExceptions: true
            });
        }
    }

    /**
     * Log a message
     *
     * @param   {string}    level       The message level
     * @param   {string}    message     The message
     */
    public log(level:string, message:string)
    {
        this.winston.log(level, message);
    }

    /**
     * Log a message with the level "info"
     *
     * @param   {string}    message     The message
     */
    public info(message:string)
    {
        this.winston.info(message);
    }
}

export = Logger;