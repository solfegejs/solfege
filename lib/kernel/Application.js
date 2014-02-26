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
solfege.util.Object.define(Application, 'REGEXP_BUNDLE_NAME', /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/);
solfege.util.Object.define(Application, 'REGEXP_SOLFEGE_URI', /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/);
solfege.util.Object.define(Application, 'REGEXP_SPLIT_SOLFEGE_URI', /^@([^:\.]+)\.?([^:]*):?(.*)$/);

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
    if (!Application.REGEXP_BUNDLE_NAME.test(id)) {
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
 * Indicates that an URI is a Solfege URI or not
 *
 * @param   {String}    uri             The solfege URI
 * @return  {Boolean}                   true if the URI is a Solfege URI, false otherwise
 */
proto.isSolfegeUri = function(uri)
{
    var result = Application.REGEXP_SOLFEGE_URI.test(uri);

    return result;
};

/**
 * Parse a solfege URI
 *
 * @param   {String}    uri             The solfege URI
 * @param   {any}       bundleCaller    The current bundle instance (required to handle '@this')
 * @return  {any}                       The parts
 */
proto.parseSolfegeUri = function(uri, bundleCaller)
{
    var parts = Application.REGEXP_SPLIT_SOLFEGE_URI.exec(uri);
    var result = {};

    // Bundle
    if (parts && parts[1]) {
        // Get the bundle id
        result.bundleId = parts[1];

        // Get the bundle instance
        if ('this' === result.bundleId) {
            result.bundle = bundleCaller;
        } else {
            result.bundle = this.getBundle(result.bundleId);
        }

        // By default, the object instance is the bundle
        result.object = result.bundle;
    }

    // Object
    if (parts && parts[2]) {
        // Get the object path
        result.objectPath = parts[2];

        // Parse the object path
        if (result.bundle) {
            var objectParts = result.objectPath.split('.');
            result.object = result.bundle;
            objectParts.every(function(part) {
                // Skip empty part
                if ('' === part) {
                    return true;
                }

                // If the part is undefined in the current object, then the object path is invalid
                if ('undefined' === typeof result.object[part]) {
                    result.object = null;
                    return false;
                }

                // Set the current object
                result.object = result.object[part];
                return true;
            });
        }
    }

    // File
    if (parts && parts[3]) {
        // Get the file pattern
        result.filePattern = parts[3];

        // Parse the file pattern
        if (result.object) {
            // The object must implement the "__dirname" property
            if ('string' !== typeof result.object.__dirname) {
                if (result.objectPath) {
                    throw new Error('The target @' + result.bundleId + '.' + result.objectPath + ' must implement the "__dirname" property');
                } else {
                    throw new Error('The target @' + result.bundleId + ' must implement the "__dirname" property');
                }
            }

            // Resolve the absolute path
            var modulePath = require('path');
            var basePath = result.object.__dirname;
            var relativeFilePath = result.filePattern;
            var relativeFilePaths = [];
            var absoluteFilePath = modulePath.resolve(basePath, result.filePattern);
            var absoluteFilePaths = [];

            // Try glob search and get multiple files
            try {
                var glob = require('glob');
                var globPaths = glob.sync(result.filePattern, {
                    cwd: basePath
                });
                if (globPaths && globPaths.length) {
                    globPaths.forEach(function(globPath) {
                        relativeFilePaths.push(globPath);
                        absoluteFilePaths.push(modulePath.resolve(basePath, globPath));
                    });
                }
            } catch (error) {
            }

            // Set the absolute file path
            if (absoluteFilePaths.length === 1) {
                result.relativeFilePath = relativeFilePaths[0];
                result.relativeFilePaths = [result.relativeFilePath];
                result.filePath = absoluteFilePaths[0];
                result.filePaths = [result.filePath];
            } else if (absoluteFilePaths.length > 1) {
                result.relativeFilePaths = relativeFilePaths;
                result.filePaths = absoluteFilePaths;
            } else {
                result.relativeFilePath = relativeFilePath;
                result.relativeFilePaths = [result.relativeFilePath];
                result.filePath = absoluteFilePath;
                result.filePaths = [result.filePath];
            }
        }
    }

    return result;
};

/**
 * Resolve a solfege URI
 *
 * @param   {String}    uri             The solfege URI
 * @param   {any}       bundleCaller    The current bundle instance (required to handle '@this')
 * @return  {any}                       The target
 */
proto.resolveSolfegeUri = function(uri, bundleCaller)
{
    var parts = this.parseSolfegeUri(uri);

    if (parts.filePath) {
        return parts.filePath;
    }
    if (parts.filePaths) {
        return parts.filePaths;
    }
    if (parts.object) {
        return parts.object;
    }

    return null;
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
