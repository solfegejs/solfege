"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _solfege = require("../solfege");

var _solfege2 = _interopRequireDefault(_solfege);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

/**
 * The main class of the SolfegeJS application
 *
 * @class   solfege.kernel.Application
 */

var Application = (function (_solfege$kernel$EventEmitter) {

    /**
     * Constructor
     *
     * @param   {string} rootPath - Root path of the application
     */

    function Application(rootPath) {
        _classCallCheck(this, Application);

        if (typeof rootPath !== "string") throw new TypeError("Value of argument 'rootPath' violates contract.");

        _get(Object.getPrototypeOf(Application.prototype), "constructor", this).call(this);

        // The root path of the application
        this.rootPath = rootPath;

        // Registered bundles
        this.bundles = new Map();

        // The custom configuration of the bundles
        this.configuration = {};

        // Set general properties
        this.rootPath = rootPath;

        // Exit handler
        var bindedExitHandler = this.onExit.bind(this);
        var bindedKillHandler = this.onKill.bind(this);
        process.on("exit", bindedExitHandler);
        process.on("SIGINT", bindedKillHandler);

        process.on("SIGTERM", bindedKillHandler);
        process.on("SIGHUP", bindedKillHandler);

        // Error handler
        process.on("uncaughtException", this.onErrorUnknown.bind(this));
    }

    _inherits(Application, _solfege$kernel$EventEmitter);

    _createClass(Application, [{
        key: "addBundle",

        /**
         * Add a bundle
         *
         * @public
         * @method  solfege.kernel.Application.prototype.addBundle
         * @param   {string} id - The bundle identifier
         * @param   {*} bundle - The bundle instance
         */
        value: function addBundle(id, bundle) {
            if (typeof id !== "string") throw new TypeError("Value of argument 'id' violates contract.");

            // Check the id pattern
            if (!Application.REGEXP_BUNDLE_NAME.test(id)) {
                throw new Error("Invalid bundle name: \"" + id + "\"");
            }

            this.bundles.set(id, bundle);
        }
    }, {
        key: "getBundle",

        /**
         * Get a bundle by its id
         *
         * @public
         * @method  solfege.kernel.Application.prototype.getBundle
         * @param   {string} id - The bundle identifier
         * @return  {*} The bundle instance
         */
        value: function getBundle(id) {
            if (typeof id !== "string") throw new TypeError("Value of argument 'id' violates contract.");

            return this.bundles.get(id);
        }
    }, {
        key: "getBundles",

        /**
         * Get all bundles
         *
         * @public
         * @method  solfege.kernel.Application.prototype.getBundles
         * @return  {Map} The bundle list
         */
        value: function getBundles() {
            return this.bundles;
        }
    }, {
        key: "overrideConfiguration",

        /**
         * Override the configuration of the bundles
         *
         * @public
         * @method  solfege.kernel.Application.prototype.overrideConfiguration
         * @param   {Object} configuration - The configuration object
         */
        value: function overrideConfiguration(configuration) {
            this.configuration = configuration;
        }
    }, {
        key: "isSolfegeUri",

        /**
         * Indicates that an URI is a Solfege URI or not
         *
         * @public
         * @method  solfege.kernel.Application.prototype.isSolfegeUri
         * @param   {string} uri - The solfege URI
         * @return  {Boolean} <code>true</code> if the URI is a Solfege URI, <code>false</code> otherwise
         */
        value: function isSolfegeUri(uri) {
            if (typeof uri !== "string") throw new TypeError("Value of argument 'uri' violates contract.");

            return Application.REGEXP_SOLFEGE_URI.test(uri);
        }
    }, {
        key: "parseSolfegeUri",

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
        value: function parseSolfegeUri(uri, bundleCaller) {
            if (typeof uri !== "string") throw new TypeError("Value of argument 'uri' violates contract.");

            // Check arguments
            _assert2["default"].ok(this.isSolfegeUri(uri), "The URI must be a valid solfege URI");

            var parts = Application.REGEXP_SPLIT_SOLFEGE_URI.exec(uri);
            var result = {};

            // Bundle
            if (parts && parts[1]) {
                // Get the bundle id
                result.bundleId = parts[1];

                // Get the bundle instance
                if ("this" === result.bundleId) {
                    result.bundle = bundleCaller;
                } else {
                    result.bundle = this.getBundle(result.bundleId);
                }

                // By default, the object instance is the bundle
                result.object = result.bundle;
            }

            function _ref(part) {
                // Skip empty part
                if ("" === part) {
                    return true;
                }

                // If the part is undefined in the current object, then the object path is invalid
                if ("undefined" === typeof result.object[part]) {
                    result.object = null;
                    return false;
                }

                // Set the current object
                result.object = result.object[part];
                return true;
            }

            // Object
            if (parts && parts[2]) {
                // Get the object path
                result.objectPath = parts[2];

                // Parse the object path
                if (result.bundle) {
                    var objectParts = result.objectPath.split(".");
                    result.object = result.bundle;
                    objectParts.every(_ref);
                }
            }

            // File
            if (parts && parts[3]) {
                // Get the file pattern
                result.filePattern = parts[3];

                // Parse the file pattern
                if (result.object) {
                    (function () {
                        // The object must implement the "__dirname" property
                        if ("string" !== typeof result.object.__dirname) {
                            if (result.objectPath) {
                                throw new Error("The target @" + result.bundleId + "." + result.objectPath + " must implement the \"__dirname\" property");
                            } else {
                                throw new Error("The target @" + result.bundleId + " must implement the \"__dirname\" property");
                            }
                        }

                        // Resolve the absolute path
                        var basePath = result.object.__dirname;
                        var relativeFilePath = result.filePattern;
                        var relativeFilePaths = [];
                        var absoluteFilePath = _path2["default"].resolve(basePath, result.filePattern);
                        var absoluteFilePaths = [];

                        // Try glob search and get multiple files
                        try {
                            var globPaths = _glob2["default"].sync(result.filePattern, {
                                cwd: basePath
                            });
                            if (globPaths && globPaths.length) {
                                globPaths.forEach(function (globPath) {
                                    relativeFilePaths.push(globPath);
                                    absoluteFilePaths.push(_path2["default"].resolve(basePath, globPath));
                                });
                            }
                        } catch (error) {}

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
                    })();
                }
            }

            return result;
        }
    }, {
        key: "resolveSolfegeUri",

        /**
         * Resolve a solfege URI
         *
         * @public
         * @method  solfege.kernel.Application.prototype.resolveSolfegeUri
         * @param   {string} uri - The solfege URI
         * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
         * @return  {*} The target
         */
        value: function resolveSolfegeUri(uri, bundleCaller) {
            if (typeof uri !== "string") throw new TypeError("Value of argument 'uri' violates contract.");

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
    }, {
        key: "getBundleFromSolfegeUri",

        /**
         * Get the bundle instance from a solfege URI
         *
         * @method  solfege.kernel.Application.prototype.getBundleFromSolfegeUri
         * @param   {string} uri - The solfege URI
         * @param   {*} [bundleCaller] - The current bundle instance (required to handle '@this')
         * @return  {*} The bundle instance
         */
        value: function getBundleFromSolfegeUri(uri, bundleCaller) {
            if (typeof uri !== "string") throw new TypeError("Value of argument 'uri' violates contract.");

            var regexp = /^@([a-zA-Z0-9\-]+)(.*)$/;
            var parts = regexp.exec(uri);

            // No bundle found
            if (!parts) {
                return null;
            }

            var bundleId = parts[1];
            var targetPath = parts[2];

            // Get the bundle
            var bundle = undefined;
            if ("this" === bundleId) {
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
    }, {
        key: "start",

        /**
         * Start the application
         *
         * @public
         * @method  solfege.kernel.Application.prototype.start
         */
        value: function start() {
            var self = this;

            // Start the generator based flow
            (0, _co2["default"])(function* () {
                // Check if the root directory exists
                var fs = _solfege2["default"].util.Node.fs;
                var rootPathExists = yield fs.exists(self.rootPath);
                if (!rootPathExists) {
                    throw new Error("The root path of the application does not exist");
                }

                // Initialize bundles
                // A bundle can implement a method "setApplication" to get an instance of the application
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = self.bundles.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2);

                        var bundleId = _step$value[0];
                        var bundle = _step$value[1];

                        try {
                            // Override the configuration
                            var bundleConfiguration;
                            if (self.configuration && self.configuration[bundleId]) {
                                bundleConfiguration = self.configuration[bundleId];
                            }
                            if (bundleConfiguration && typeof bundle.overrideConfiguration === "function") {
                                if ("GeneratorFunction" !== bundle.overrideConfiguration.constructor.name) {
                                    console.error("The bundle " + bundle + " must implement a generator function \"overrideConfiguration\"");
                                } else {
                                    yield bundle.overrideConfiguration(bundleConfiguration);
                                }
                            }

                            // Set the application instance
                            if (typeof bundle.setApplication === "function") {
                                if ("GeneratorFunction" !== bundle.setApplication.constructor.name) {
                                    console.error("The bundle " + bundle + " must implement a generator function \"setApplication\"");
                                } else {
                                    yield bundle.setApplication(self);
                                }
                            }
                        } catch (error) {
                            // Display the error of the bundle
                            throw new Error("[" + bundleId + "] " + error.message);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

                // Start the application
                yield self.emit(Application.EVENT_START, self);
            })

            // Handle error
            ["catch"](function (error) {
                console.error(self.bundles);
                console.error(error);
                console.error(error.stack);
            });
        }
    }, {
        key: "onErrorUnknown",

        /**
         * An unknown error occurred
         *
         * @private
         * @method  solfege.kernel.Application.prototype.onErrorUnknown
         * @param   {Error} error - Error instance
         */
        value: function onErrorUnknown(error) {
            // @todo Use a log manager
            console.error(error.message);
            if (error.stack) {
                console.error(error.stack);
            }
        }
    }, {
        key: "onExit",

        /**
         * The application is stopped
         *
         * @private
         * @method  solfege.kernel.Application.prototype.onExit
         */
        value: function onExit() {
            var self = this;

            (0, _co2["default"])(function* () {
                yield self.emit(Application.EVENT_END, self);
            });
        }
    }, {
        key: "onKill",

        /**
         * The application is killed
         *
         * @private
         * @method  solfege.kernel.Application.prototype.onKill
         */
        value: function onKill() {
            process.exit();
        }
    }, {
        key: "nodePath",

        /**
         * The node path
         *
         * @public
         * @member  {string} solfege.kernel.Application.nodePath
         */
        get: function get() {
            return process.execPath;
        }
    }, {
        key: "nodeArguments",

        /**
         * The node arguments
         *
         * @public
         * @member  {String[]} solfege.kernel.Application.nodeArguments
         */
        get: function get() {
            if (this._nodeArguments) {
                return this._nodeArguments;
            }
            this._nodeArguments = [].concat(process.execArgv);
            return this._nodeArguments;
        }
    }, {
        key: "commandLine",

        /**
         * The command line
         *
         * @public
         * @member  {String[]} solfege.kernel.Application.prototype.commandLine
         */
        get: function get() {
            if (this._commandLine) {
                return this._commandLine;
            }
            var commandLine = [this.nodePath].concat(this.nodeArguments);
            commandLine.push(this.scriptPath);
            this._commandLine = commandLine.concat(this.scriptArguments);
            return this._commandLine;
        }
    }, {
        key: "scriptPath",

        /**
         * The script path that started the process
         *
         * @public
         * @member  {String} solfege.kernel.Application.scriptPath
         */
        get: function get() {
            if (this._scriptPath) {
                return this._scriptPath;
            }
            var scriptArguments = [].concat(process.argv);
            scriptArguments.shift();
            this._scriptPath = scriptArguments.shift();
            return this._scriptPath;
        }
    }, {
        key: "scriptArguments",

        /**
         * The script arguments
         *
         * @public
         * @member  {Array} solfege.kernel.Application.scriptArguments
         */
        get: function get() {
            if (this._scriptArguments) {
                return this._scriptArguments;
            }
            this._scriptArguments = [].concat(process.argv);
            this._scriptArguments.shift();
            this._scriptArguments.shift();
            return this._scriptArguments;
        }
    }], [{
        key: "EVENT_BUNDLES_INITIALIZED",

        /**
         * Event name of the end of the bundles initialization
         *
         * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_INITALIZED
         * @default     'bundles_initialized'
         */
        get: function get() {
            return "bundles_initialized";
        }
    }, {
        key: "EVENT_START",

        /**
         * Event name of the application start
         *
         * @constant    {String} solfege.kernel.Application.EVENT_START
         * @default     'start'
         */
        get: function get() {
            return "start";
        }
    }, {
        key: "EVENT_END",

        /**
         * Event name of the application end
         *
         * @constant    {String} solfege.kernel.Application.EVENT_END
         * @default     'end'
         */
        get: function get() {
            return "end";
        }
    }, {
        key: "REGEXP_BUNDLE_NAME",

        /**
         * Regular expression of a valid bundle name
         *
         * @constant    {RegExp} solfege.kernel.Application.REGEXP_BUNDLE_NAME
         * @default     /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/
         */
        get: function get() {
            return /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/;
        }
    }, {
        key: "REGEXP_SOLFEGE_URI",

        /**
         * Regular expression of a valid Solfege URI
         *
         * @constant    {RegExp} solfege.kernel.Application.REGEXP_SOLFEGE_URI
         * @default     /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/
         */
        get: function get() {
            return /^@[a-zA-Z]+(-[a-zA-Z0-9]+)*(\.:)?.*$/;
        }
    }, {
        key: "REGEXP_SPLIT_SOLFEGE_URI",

        /**
         * Regular expression for splitting into parts a Solfege URI
         *
         * @constant    {RegExp} solfege.kernel.Application.REGEXP_SPLIT_SOLFEGE_URI
         * @default     /^@([^:\.]+)\.?([^:]*):?(.*)$/
         */
        get: function get() {
            return /^@([^:\.]+)\.?([^:]*):?(.*)$/;
        }
    }]);

    return Application;
})(_solfege2["default"].kernel.EventEmitter);

exports["default"] = Application;
module.exports = exports["default"];