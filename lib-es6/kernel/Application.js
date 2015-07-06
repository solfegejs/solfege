import assert from "assert";
import solfege from "../solfege";
import co from "co";

/**
 * The main class of the SolfegeJS application
 *
 * @class   solfege.kernel.Application
 */
export default class Application extends solfege.kernel.EventEmitter
{
    /**
     * Constructor
     *
     * @param   {String} rootPath - Root path of the application
     */
    constructor(rootPath)
    {
        super();

        // The root path of the application
        this.rootPath = rootPath;

        // Registered bundles
        this.bundles = {};

        // The custom configuration of the bundles
        this.configuration = {};


        // Set general properties
        this.rootPath = rootPath;
        this.bundles = {};

        // Exit handler
        let bindedExitHandler = this.onExit.bind(this);
        let bindedKillHandler = this.onKill.bind(this);
        process.on('exit', bindedExitHandler);
        process.on('SIGINT', bindedKillHandler);

        process.on('SIGTERM', bindedKillHandler);
        process.on('SIGHUP', bindedKillHandler);

        // Error handler
        process.on('uncaughtException', this.onErrorUnknown.bind(this));
    }

    /**
     * The node path
     *
     * @public
     * @member  {String} solfege.kernel.Application.nodePath
     */
    get nodePath()
    {
        return process.execPath;
    }

    /**
     * The node arguments
     *
     * @public
     * @member  {String[]} solfege.kernel.Application.nodeArguments
     */
    get nodeArguments()
    {
        if (this._nodeArguments) {
            return this._nodeArguments;
        }
        this._nodeArguments = [].concat(process.execArgv);
        return this._nodeArguments;
    }

    /**
     * The command line
     *
     * @public
     * @member  {String[]} solfege.kernel.Application.prototype.commandLine
     */
    get commandLine()
    {
        if (this._commandLine) {
            return this._commandLine;
        }
        let commandLine = [this.nodePath].concat(this.nodeArguments);
        commandLine.push(this.scriptPath);
        this._commandLine = commandLine.concat(this.scriptArguments);
        return this._commandLine;
    }

    /**
     * The script path that started the process
     *
     * @public
     * @member  {String} solfege.kernel.Application.scriptPath
     */
    get scriptPath()
    {
        if (this._scriptPath) {
            return this._scriptPath;
        }
        let scriptArguments = [].concat(process.argv);
        scriptArguments.shift();
        this._scriptPath = scriptArguments.shift();
        return this._scriptPath;
    }

    /**
     * The script arguments
     *
     * @public
     * @member  {Array} solfege.kernel.Application.scriptArguments
     */
    get scriptArguments()
    {
        if (this._scriptArguments) {
            return this._scriptArguments;
        }
        this._scriptArguments = [].concat(process.argv);
        this._scriptArguments.shift();
        this._scriptArguments.shift();
        return this._scriptArguments;
    }

    /**
     * Add a bundle
     *
     * @public
     * @method  solfege.kernel.Application.prototype.addBundle
     * @param   {String} id - The bundle identifier
     * @param   {*} bundle - The bundle instance
     */
    addBundle(id, bundle)
    {
        // Check arguments
        assert.strictEqual(typeof id, 'string', 'The id is required and must be a string');

        // Check the id pattern
        if (!Application.REGEXP_BUNDLE_NAME.test(id)) {
            throw new Error('Invalid bundle name: "' + id + '"');
        }

        this.bundles[id] = bundle;
    }

    /**
     * Get a bundle by its id
     *
     * @public
     * @method  solfege.kernel.Application.prototype.getBundle
     * @param   {String} id - The bundle identifier
     * @return  {*} The bundle instance
     */
    getBundle(id)
    {
        // Check arguments
        assert.strictEqual(typeof id, 'string', 'The id is required and must be a string');

        return this.bundles[id];
    }

    /**
     * Get all bundles
     *
     * @public
     * @method  solfege.kernel.Application.prototype.getBundles
     * @return  {Object} The bundle list
     */
    getBundles()
    {
        return this.bundles;
    }

    /**
     * Override the configuration of the bundles
     *
     * @public
     * @method  solfege.kernel.Application.prototype.overrideConfiguration
     * @param   {Object} configuration - The configuration object
     */
    overrideConfiguration(configuration)
    {
        this.configuration = configuration;
    }

    /**
     * Indicates that an URI is a Solfege URI or not
     *
     * @public
     * @method  solfege.kernel.Application.prototype.isSolfegeUri
     * @param   {String} uri - The solfege URI
     * @return  {Boolean} <code>true</code> if the URI is a Solfege URI, <code>false</code> otherwise
     */
    isSolfegeUri(uri)
    {
        // Check arguments
        assert.strictEqual(typeof uri, 'string', 'The URI is required and must be a string');


        var result = Application.REGEXP_SOLFEGE_URI.test(uri);

        return result;
    }

    /**
     * Parse a solfege URI
     *
     * <p>The available parts:</p>
     * <ul>
     *     <li><code>bundleId</code></li>
     *     <li><code>bundle</code></li>
     *     <li><code>objectPath</code></li>
     *     <li><code>object</code></li>
     *     <li><code>filePattern</code></li>
     *     <li><code>relativeFilePath</code></li>
     *     <li><code>relativeFilePaths</code></li>
     *     <li><code>filePath</code></li>
     *     <li><code>filePaths</code></li>
     * </ul>
     *
     * @public
     * @method  solfege.kernel.Application.prototype.parseSolfegeUri
     * @param   {String} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {Object} The parts
     */
    parseSolfegeUri(uri, bundleCaller)
    {
        // Check arguments
        assert.strictEqual(typeof uri, 'string', 'The URI is required and must be a string');
        assert.ok(this.isSolfegeUri(uri), 'The URI must be a valid solfege URI');


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
                objectParts.every(part => {
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
                        globPaths.forEach(globPath => {
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
    }

    /**
     * Resolve a solfege URI
     *
     * @public
     * @method  solfege.kernel.Application.prototype.resolveSolfegeUri
     * @param   {String} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {*} The target
     */
    resolveSolfegeUri(uri, bundleCaller)
    {
        var parts = this.parseSolfegeUri(uri, bundleCaller);

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
    }

    /**
     * Get the bundle instance from a solfege URI
     *
     * @method  solfege.kernel.Application.prototype.getBundleFromSolfegeUri
     * @param   {String} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {*} The bundle instance
     */
    getBundleFromSolfegeUri(uri, bundleCaller)
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
    }

    /**
     * Start the application
     *
     * @public
     * @method  solfege.kernel.Application.prototype.start
     */
    start()
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
    }

    /**
     * An unknown error occurred
     *
     * @private
     * @method  solfege.kernel.Application.prototype.onErrorUnknown
     * @param   {Error} error - Error instance
     */
    onErrorUnknown(error)
    {
        // @todo Use a log manager
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }

    /**
     * The application is stopped
     *
     * @private
     * @method  solfege.kernel.Application.prototype.onExit
     */
    onExit()
    {
        var self = this;

        co(function *()
        {
            yield self.emit(Application.EVENT_END, self);
        })();
    }

    /**
     * The application is killed
     *
     * @private
     * @method  solfege.kernel.Application.prototype.onKill
     */
    onKill()
    {
        process.exit();
    }
}

/**
 * Event name of the end of the bundles initialization
 *
 * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_INITALIZED
 * @default     'bundles_initialized'
 */
solfege.util.Object.define(Application, 'EVENT_BUNDLES_INITIALIZED', 'bundles_initialized');

/**
 * Event name of the application start
 *
 * @constant    {String} solfege.kernel.Application.EVENT_START
 * @default     'start'
 */
solfege.util.Object.define(Application, 'EVENT_START', 'start');

/**
 * Event name of the application end
 *
 * @constant    {String} solfege.kernel.Application.EVENT_END
 * @default     'end'
 */
solfege.util.Object.define(Application, 'EVENT_END', 'end');

/**
 * Regular expression of a valid bundle name
 *
 * @constant    {RegExp} solfege.kernel.Application.REGEXP_BUNDLE_NAME
 * @default     /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/
 */
solfege.util.Object.define(Application, 'REGEXP_BUNDLE_NAME', /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/);

/**
 * Regular expression of a valid Solfege URI
 *
 * @constant    {RegExp} solfege.kernel.Application.REGEXP_SOLFEGE_URI
 * @default     /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/
 */
solfege.util.Object.define(Application, 'REGEXP_SOLFEGE_URI', /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/);

/**
 * Regular expression for splitting into parts a Solfege URI
 *
 * @constant    {RegExp} solfege.kernel.Application.REGEXP_SPLIT_SOLFEGE_URI
 * @default     /^@([^:\.]+)\.?([^:]*):?(.*)$/
 */
solfege.util.Object.define(Application, 'REGEXP_SPLIT_SOLFEGE_URI', /^@([^:\.]+)\.?([^:]*):?(.*)$/);

