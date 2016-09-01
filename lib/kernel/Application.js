"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _coFs = require("co-fs");

var _coFs2 = _interopRequireDefault(_coFs);

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _isGenerator = require("is-generator");

var _EventEmitter = require("./EventEmitter");

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An application
 */
function _ref(error) {
    console.error(error.message);
    console.error(error.stack);
}

class Application extends _EventEmitter2.default {
    /**
     * Constructor
     */
    constructor() {
        super();

        // Configuration file path
        this.configurationFilePath;

        // Initialize the bundle registry
        this.bundles = new Set();

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

    /**
     * Event name of the configuration load
     *
     * @constant    {String} solfege.kernel.Application.EVENT_CONFIGURATION_LOADED
     * @default     "configuration_loaded"
     */
    static get EVENT_CONFIGURATION_LOADED() {
        return "configuration_loaded";
    }

    /**
     * Event name of the end of the bundles initialization
     *
     * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_INITALIZED
     * @default     "bundles_initialized"
     */
    static get EVENT_BUNDLES_INITIALIZED() {
        return "bundles_initialized";
    }

    /**
     * Event name of the end of the bundles boot
     *
     * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_BOOTED
     * @default     "bundles_booted"
     */
    static get EVENT_BUNDLES_BOOTED() {
        return "bundles_booted";
    }

    /**
     * Event name of the application start
     *
     * @constant    {String} solfege.kernel.Application.EVENT_START
     * @default     "start"
     */
    static get EVENT_START() {
        return "start";
    }

    /**
     * Event name of the application end
     *
     * @constant    {String} solfege.kernel.Application.EVENT_END
     * @default     "end"
     */
    static get EVENT_END() {
        return "end";
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {*}     bundle  A bundle
     */
    addBundle(bundle) {
        // Check the validity
        //assert.strictEqual(typeof bundle.getPath, 'function', `The bundle ${bundle} must implement getPath method`);

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Get bundles
     *
     * @return  {Set}           The bundles
     */
    getBundles() {
        return this.bundles;
    }

    /**
     * Get bundle file path
     *
     * @param   {object}    bundle  THe bundle instance
     * @return  {string}            The bundle file path
     */
    getBundleFilePath(bundle) {
        try {
            bundle.constructor();
        } catch (error) {
            var result = error.stack.match(/\((.*):\d+:\d+\)/);
            if (result) {
                var bundleFilePath = result[1];

                return bundleFilePath;
            }
        }

        if (typeof bundle.getPath === "function") {
            return bundle.getPath();
        }

        return null;
    }

    /**
     * Get bundle directory path
     *
     * @param   {object}    bundle  THe bundle instance
     * @return  {string}            The bundle directory path
     */
    getBundleDirectoryPath(bundle) {
        var filePath = this.getBundleFilePath(bundle);

        if (filePath) {
            return _path2.default.dirname(filePath);
        }

        return null;
    }

    /**
     * Load configuration file
     *
     * @param   {string}    filePath    Configuration file path
     */
    loadConfiguration(filePath) {
        if (!(typeof filePath === 'string')) {
            throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
        }

        this.configurationFilePath = _path2.default.resolve(filePath);
    }

    /**
     * Start the application
     *
     * @param   {Array}     parameters  Application parameters
     */
    start() {
        var parameters = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        if (!Array.isArray(parameters)) {
            throw new TypeError("Value of argument \"parameters\" violates contract.\n\nExpected:\nArray\n\nGot:\n" + _inspect(parameters));
        }

        var self = this;

        // Start the generator based flow
        (0, _co2.default)(function* () {
            _self$bundles = self.bundles;

            if (!(_self$bundles && (typeof _self$bundles[Symbol.iterator] === 'function' || Array.isArray(_self$bundles)))) {
                throw new TypeError("Expected _self$bundles to be iterable, got " + _inspect(_self$bundles));
            }

            // Initialize registered bundles
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _self$bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _self$bundles;

                    var bundle = _step.value;


                    if (!(0, _isGenerator.fn)(bundle.initialize)) {
                        continue;
                    }

                    yield bundle.initialize(self);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

            // Load configuration file
            if (typeof self.configurationFilePath === "string") {
                var configurationFileExists = yield _coFs2.default.exists(self.configurationFilePath);
                if (!configurationFileExists) {
                    throw new Error("Configuration file not found: " + self.configurationFilePath);
                }
                var configuration = (0, _configYaml2.default)(self.configurationFilePath, { encoding: "utf8" });
                var configurationDirectory = _path2.default.dirname(self.configurationFilePath);

                if (!(typeof configurationDirectory === 'string')) {
                    throw new TypeError("Value of variable \"configurationDirectory\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(configurationDirectory));
                }

                yield self.emit(Application.EVENT_CONFIGURATION_LOADED, self, configuration, configurationDirectory);
            } else {
                yield self.emit(Application.EVENT_CONFIGURATION_LOADED, self, {}, null);
            }

            // Boot registered bundles
            _self$bundles2 = self.bundles;

            if (!(_self$bundles2 && (typeof _self$bundles2[Symbol.iterator] === 'function' || Array.isArray(_self$bundles2)))) {
                throw new TypeError("Expected _self$bundles2 to be iterable, got " + _inspect(_self$bundles2));
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _self$bundles2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _self$bundles2;

                    var _bundle = _step2.value;

                    if (!(0, _isGenerator.fn)(_bundle.boot)) {
                        continue;
                    }

                    yield _bundle.boot();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            yield self.emit(Application.EVENT_BUNDLES_BOOTED, self);

            // Start the application
            yield self.emit(Application.EVENT_START, self, parameters);
        })

        // End
        .then(function* () {
            yield self.emit(Application.EVENT_END, self);
        })

        // Handle error
        .catch(_ref);
    }

    /**
     * An unknown error occurred
     *
     * @private
     * @param   {Error}     error   Error instance
     */
    onErrorUnknown(error) {
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }

    /**
     * The application is stopped
     *
     * @private
     */
    onExit() {
        var self = this;

        (0, _co2.default)(function* () {
            yield self.emit(Application.EVENT_END, self);
        });
    }

    /**
     * The application is killed
     *
     * @private
     */
    onKill() {
        process.exit();
    }
}
exports.default = Application;

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}

module.exports = exports["default"];