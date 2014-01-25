var solfege = require('../solfege');
var co = require('co');

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
    this.bundles = {};

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
 * @type {Object}
 * @api private
 */
proto.bundles = null;

/**
 * Add a bundle
 *
 * @param   {String}    id      The bundle identifier
 * @param   {any}       bundle  The bundle instance
 */
proto.addBundle = function(id, bundle)
{
    this.bundles[id] = bundle;
};

/**
 * Get a bundle by its id
 *
 * @param   {String}    id      The bundle identifier
 * @return  {any}               The bundle instance
 */
proto.getBundle = function(id)
{
    return this.bundles[id];
};

/**
 * Get all bundles
 *
 * @return  {Arra}              The bundle list
 */
proto.getBundles = function()
{
    return this.bundles;
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
        // A bundle can implement a method "setApplication" to get an instance of the application
        for (var bundleId in self.bundles) {
            var bundle = self.bundles[bundleId];
            if (typeof bundle.setApplication !== 'function') {
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
