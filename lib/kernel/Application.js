var solfege = require('../solfege');
var co = require('co');
var http = require('http');


/**
 * The main class of the SolfegeJS application
 *
 * @param   {String}    rootPath    Root path of the application
 * @api     public
 */
var Application = function(rootPath)
{
    // Set general properties
    this.bundles = [];
    this.rootPath = rootPath;

    // Exit handler
    var bindedExitHandler = this.onExit.bind(this);
    var bindedKillHandler = this.onKill.bind(this);
    process.on('exit', bindedExitHandler);
    process.on('SIGINT', bindedKillHandler);
    process.on('SIGTERM', bindedKillHandler);
    process.on('SIGHUP', bindedKillHandler);

    // Error handler
    process.on('uncaughtException', this.onErrorUnknown.bind(this));
};
proto = Application.prototype;

/**
 * The root path of the application
 *
 * @type {String}
 * @api private
 */
proto.rootPath = null;

/**
 * Registred bundles
 *
 * @property bundles
 * @type {Array}
 * @private
 */
proto.bundles = null;
/**
 * Configuration
 *
 * @property configuration
 * @type {Object}
 * @private
 */
proto.configuration = null;

/**
 * Get the representation string
 *
 * @return  {String}    The representation string
 * @public
 */
proto.toString = function()
{
    return '[solfeje.kernel.Application]';
};

/**
 * Start the application
 *
 * @api public
 */
proto.start = function()
{
    var self = this;

    // Start the generator based flow
    co(function *()
    {
        // Check if the root directory exists
        var fs = solfege.util.Node.fs;
        var rootPathExists = yield fs.exists(self.rootPath);
        if (!rootPathExists) {
            throw new Error('The root path of the application does not exist');
        }

        // Create the server
        var server = http.createServer(function(request, response)
        {
            console.log('request');
        });
        server.listen.apply(server, [1337]);
        console.log('SolfegeJS started');
    })();
};

/**
 * An unknown error occurred
 *
 * @param   {Object}    error           Error instance
 * @api     private
 */
proto.onErrorUnknown = function(error)
{
    // @todo Use a log manager
    console.error(error.message);
};

/**
 * The application is stopped
 *
 * @api     private
 */
proto.onExit = function()
{
    console.log('SolfegeJS stopped');
};

/**
 * The application is killed
 *
 * @api     private
 */
proto.onKill = function()
{
    process.exit();
};

module.exports = Application;
