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

    // Initialize the public properties about the command line
    this.nodePath = process.execPath;
    this.nodeArguments = [].concat(process.execArgv);
    this.scriptArguments = [].concat(process.argv);
    this.scriptArguments.shift();
    this.scriptPath = this.scriptArguments.shift();
    this.commandLine = [this.nodePath].concat(this.nodeArguments);
    this.commandLine.push(this.scriptPath);
    this.commandLine = this.commandLine.concat(this.scriptArguments);

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
solfege.util.Object.define(Application, 'EVENT_BUNDLES_INITIALIZED', 'bundles_initialized');
solfege.util.Object.define(Application, 'EVENT_START', 'start');
solfege.util.Object.define(Application, 'EVENT_END', 'end');

/**
 * The root path of the application
 *
 * @type {String}
 * @api private
 */
proto.rootPath;

/**
 * Registred bundles
 *
 * @type {Object}
 * @api private
 */
proto.bundles;

/**
 * The custom configuration of the bundles
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * The command line
 *
 * @type {Array}
 * @api public
 */
proto.commandLine;

/**
 * The node path
 *
 * @type {String}
 * @api public
 */
proto.nodePath;

/**
 * The node arguments
 *
 * @type {Array}
 * @api public
 */
proto.nodeArguments;

/**
 * The script path that started the process
 *
 * @type {String}
 * @api public
 */
proto.scriptPath;

/**
 * The script arguments
 *
 * @type {Array}
 * @api public
 */
proto.scriptArguments;


/**
 * Add a bundle
 *
 * @param   {String}    id      The bundle identifier
 * @param   {any}       bundle  The bundle instance
 */
proto.addBundle = function(id, bundle)
{
    // Check the id pattern
    var idRegexp = /^[a-zA-Z0-9\-]+$/;
    if (!idRegexp.test(id)) {
        throw new Error('Invalid bundle name: "' + id + '"');
    }

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
 * @return  {Object}            The bundle list
 */
proto.getBundles = function()
{
    return this.bundles;
};

/**
 * Override the configuration of the bundles
 *
 * @param   {Object}    configuration   The configuration object
 * @api public
 */
proto.overrideConfiguration = function(configuration)
{
    this.configuration = configuration;
};

/**
 * Parse a solfege URI
 *
 * @param   {String}    uri             The solfege URI
 * @param   {any}       bundleCaller    The current bundle instance (required to handle '@this')
 * @return  {any}                       The target
 */
proto.parseSolfegeUri = function(uri, bundleCaller)
{
    var nodePath = require('path');
    var regexp = /^@([a-zA-Z0-9\-]+)(.*)$/;
    var parts = regexp.exec(uri);

    // No bundle found
    if (!parts) {
        return null;
    }

    var bundleId = parts[1];
    var targetPath = parts[2];

    // Get the bundle
    var bundle;
    if ('this' === bundleId) {
        bundle = bundleCaller;
    } else {
        bundle = this.getBundle(bundleId);
    }

    // No bundle found
    if (!bundle) {
        return null;
    }

    // If there is no target path, then return the bundle instance
    if (!targetPath) {
        return bundle;
    }

    // Separate the object path and the file path
    var targetParts = targetPath.split(':');
    var objectPath = targetParts.shift();
    var filePath = (targetParts.length)? targetParts.shift() : null;


    // Parse the object path
    var objectParts = objectPath.split('.');
    var total = objectParts.length;
    var targetObject = bundle;
    for (var index = 0; index < total; ++index) {
        var part = objectParts[index];

        // Skip empty part
        if ('' === part) {
            continue;
        }

        // If the part is undefined in the current target, then return null
        if ('undefined' === typeof targetObject[part]) {
            return null;
        }

        // Set the current target
        targetObject = targetObject[part];
    }

    // Parse the file path
    if (filePath) {

        // The target object must implement the "__dirname" property
        if ('string' !== typeof targetObject.__dirname) {
            throw new Error('The target @' + bundleId + objectPath + ' must implement the "__dirname" property');
        }

        // Resolve the absolute path
        var basePath = targetObject.__dirname;
        var absoluteFilePath = nodePath.resolve(basePath, filePath);

        // Return the absolute file path
        return absoluteFilePath;
    }

    // Return the target object
    return targetObject;
};

/**
 * Get the bundle instance from a solfege URI
 *
 * @param   {String}    uri             The solfege URI
 * @param   {any}       bundleCaller    The current bundle instance (required to handle '@this')
 * @return  {any}                       The bundle instance
 */
proto.getBundleFromSolfegeUri = function(uri, bundleCaller)
{
    var regexp = /^@([a-zA-Z0-9\-]+)(.*)$/;
    var parts = regexp.exec(uri);

    // No bundle found
    if (!parts) {
        return null;
    }

    var bundleId = parts[1];
    var targetPath = parts[2];

    // Get the bundle
    var bundle;
    if ('this' === bundleId) {
        bundle = bundleCaller;
    } else {
        bundle = this.getBundle(bundleId);
    }

    // No bundle found
    if (!bundle) {
        return null;
    }

    return bundle;
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

            try {
                // Override the configuration
                var bundleConfiguration;
                if (self.configuration && self.configuration[bundleId]) {
                    bundleConfiguration = self.configuration[bundleId];
                }
                if (bundleConfiguration && typeof bundle.overrideConfiguration === 'function') {
                    if ('GeneratorFunction' !== bundle.overrideConfiguration.constructor.name) {
                        console.error('The bundle ' + bundle + ' must implement a generator function "overrideConfiguration"');
                    } else {
                        yield bundle.overrideConfiguration(bundleConfiguration);
                    }
                }

                // Set the application instance
                if (typeof bundle.setApplication === 'function') {
                    if ('GeneratorFunction' !== bundle.setApplication.constructor.name) {
                        console.error('The bundle ' + bundle + ' must implement a generator function "setApplication"');
                    } else {
                        yield bundle.setApplication(self);
                    }
                }
            } catch (error) {
                // Display the error of the bundle
                throw new Error('[' + bundleId + '] ' + error.message);
            }
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
    var self = this;

    co(function *()
    {
        yield self.emit(Application.EVENT_END, self);
    })();
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
