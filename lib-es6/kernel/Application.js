import assert from "assert";
import solfege from "../solfege";
import ErrorChain from "../error/ErrorChain";
import co from "co";
import glob from "glob";
import modulePath from "path";

/**
 * The main class of the SolfegeJS application
 *
 * @class   solfege.kernel.Application
 */
export default class Application extends solfege.kernel.EventEmitter
{
    /**
     * Event name of the end of the bundles initialization
     *
     * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_INITALIZED
     * @default     'bundles_initialized'
     */
    static get EVENT_BUNDLES_INITIALIZED()
    {
        return "bundles_initialized";
    }

    /**
     * Event name of the application start
     *
     * @constant    {String} solfege.kernel.Application.EVENT_START
     * @default     'start'
     */
    static get EVENT_START()
    {
        return "start";
    }

    /**
     * Event name of the application end
     *
     * @constant    {String} solfege.kernel.Application.EVENT_END
     * @default     'end'
     */
    static get EVENT_END()
    {
        return "end";
    }

    /**
     * Regular expression of a valid bundle name
     *
     * @constant    {RegExp} solfege.kernel.Application.REGEXP_BUNDLE_NAME
     * @default     /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/
     */
    static get REGEXP_BUNDLE_NAME()
    {
        return /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/
    }

    /**
     * Regular expression of a valid Solfege URI
     *
     * @constant    {RegExp} solfege.kernel.Application.REGEXP_SOLFEGE_URI
     * @default     /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/
     */
    static get REGEXP_SOLFEGE_URI()
    {
        return /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/;
    }

    /**
     * Regular expression for splitting into parts a Solfege URI
     *
     * @constant    {RegExp} solfege.kernel.Application.REGEXP_SPLIT_SOLFEGE_URI
     * @default     /^@([^:\.]+)\.?([^:]*):?(.*)$/
     */
    static get REGEXP_SPLIT_SOLFEGE_URI()
    {
        return /^@([^:\.]+)\.?([^:]*):?(.*)$/;
    }

    /**
     * Constructor
     *
     * @param   {string} rootPath - Root path of the application
     */
    constructor(rootPath:string)
    {
        super();

        // The root path of the application
        this.rootPath = rootPath;

        // Registered bundles
        this.bundles = new Map();

        // The custom configuration of the bundles
        this.configuration = {};


        // Set general properties
        this.rootPath = rootPath;

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
     * @member  {string} solfege.kernel.Application.nodePath
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
     * @param   {string} id - The bundle identifier
     * @param   {*} bundle - The bundle instance
     */
    addBundle(id:string, bundle)
    {
        // Check the id pattern
        if (!Application.REGEXP_BUNDLE_NAME.test(id)) {
            throw new Error('Invalid bundle name: "' + id + '"');
        }

        this.bundles.set(id, bundle);
    }

    /**
     * Get a bundle by its id
     *
     * @public
     * @method  solfege.kernel.Application.prototype.getBundle
     * @param   {string} id - The bundle identifier
     * @return  {*} The bundle instance
     */
    getBundle(id:string)
    {
        return this.bundles.get(id);
    }

    /**
     * Get all bundles
     *
     * @public
     * @method  solfege.kernel.Application.prototype.getBundles
     * @return  {Map} The bundle list
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
     * @param   {string} uri - The solfege URI
     * @return  {Boolean} <code>true</code> if the URI is a Solfege URI, <code>false</code> otherwise
     */
    isSolfegeUri(uri:string)
    {
        return Application.REGEXP_SOLFEGE_URI.test(uri);
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
     * @param   {string} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {Object} The parts
     */
    parseSolfegeUri(uri:string, bundleCaller?)
    {
        // Check arguments
        assert.ok(this.isSolfegeUri(uri), 'The URI must be a valid solfege URI');


        let parts = Application.REGEXP_SPLIT_SOLFEGE_URI.exec(uri);
        let result = {};

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
                let objectParts = result.objectPath.split('.');
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
                let basePath = result.object.__dirname;
                let relativeFilePath = result.filePattern;
                let relativeFilePaths = [];
                let absoluteFilePath = modulePath.resolve(basePath, result.filePattern);
                let absoluteFilePaths = [];

                // Try glob search and get multiple files
                try {
                    let globPaths = glob.sync(result.filePattern, {
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
     * @param   {string} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {*} The target
     */
    resolveSolfegeUri(uri:string, bundleCaller?)
    {
        let parts = this.parseSolfegeUri(uri, bundleCaller);

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
     * @param   {string} uri - The solfege URI
     * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
     * @return  {*} The bundle instance
     */
    getBundleFromSolfegeUri(uri:string, bundleCaller?)
    {
        let regexp = /^@([a-zA-Z0-9\-]+)(.*)$/;
        let parts = regexp.exec(uri);

        // No bundle found
        if (!parts) {
            return null;
        }

        let bundleId = parts[1];
        let targetPath = parts[2];

        // Get the bundle
        let bundle;
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
            let fs = solfege.util.Node.fs;
            let rootPathExists = yield fs.exists(self.rootPath);
            if (!rootPathExists) {
                throw new Error('The root path of the application does not exist');
            }

            // Initialize bundles
            // A bundle can implement a method "setApplication" to get an instance of the application
            for (let [bundleId, bundle] of self.bundles.entries()) {

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
                    throw new ErrorChain(error, 'Bundle "'+bundleId+'" failed');
                }
            }
            yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

            // Start the application
            yield self.emit(Application.EVENT_START, self);
        })

        // Handle error
        .catch(error => {
            console.error(error.message);
            console.error(error.stack);
        });
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
        let self = this;

        co(function *()
        {
            yield self.emit(Application.EVENT_END, self);
        });
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

