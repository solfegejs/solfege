var solfege = require('../solfege');
var co = require('co');
var http = require('http');

/**
 * The main class of the SolfegeJS application
 *
 * @param   {String}    rootPath    Root path of the application
 * @api     public
 */
var Application = solfege.util.Class.create(function(rootPath)
{
    // Call parent constructor
    solfege.kernel.EventEmitter.call(this);

    // Set general properties
    this.rootPath = rootPath;
    this.bundles = [];

    // Exit handler
    var bindedExitHandler = this.onExit.bind(this);
    var bindedKillHandler = this.onKill.bind(this);
    process.on('exit', bindedExitHandler);
    process.on('SIGINT', bindedKillHandler);
    process.on('SIGTERM', bindedKillHandler);
    process.on('SIGHUP', bindedKillHandler);

    // Error handler
    process.on('uncaughtException', this.onErrorUnknown.bind(this));
}, 'solfege.kernel.Application', solfege.kernel.EventEmitter);
var proto = Application.prototype;


// Constants
solfege.util.Object.define(Application, 'EVENT_BUNDLES_INITIALIZED', 'bundles initialized');
solfege.util.Object.define(Application, 'EVENT_START', 'start');

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
 * @type {Array}
 * @api private
 */
proto.bundles = null;

/**
 * Configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration = null;

/**
 * Add a bundle
 *
 * @param   {any}   bundle      A bundle instance
 */
proto.addBundle = function(bundle)
{
    this.bundles.push(bundle);
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

        // Initialize bundles
        var bundleCount = self.bundles.length;
        var bundleIndex;
        for (bundleIndex = 0; bundleIndex < bundleCount; ++bundleIndex) {
            var bundle = self.bundles[bundleIndex];
            if (typeof bundle.setApplication !== 'function') {
                console.error('The bundle ' + bundle + ' must implement "setApplication"');
                continue;
            }
            if ('GeneratorFunction' !== bundle.setApplication.constructor.name) {
                console.error('The bundle ' + bundle + ' must implement a generator function "setApplication"');
                continue;
            }
            yield bundle.setApplication(self);
        }
        yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

        // Start the application
        yield self.emit(Application.EVENT_START, self);
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
