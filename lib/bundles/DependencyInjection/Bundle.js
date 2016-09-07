"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _coFs = require("co-fs");

var _coFs2 = _interopRequireDefault(_coFs);

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _isGenerator = require("is-generator");

var _Container = require("./ServiceContainer/Container");

var _Container2 = _interopRequireDefault(_Container);

var _DefinitionBuilder = require("./ServiceContainer/DefinitionBuilder");

var _DefinitionBuilder2 = _interopRequireDefault(_DefinitionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service container bundle
 */
class Bundle {
    /**
     * Constructor
     */
    constructor() {
        // Declare application property
        this.application;

        // Initialize the definition builder
        this.definitionBuilder = new _DefinitionBuilder2.default();

        // Initialize the service container
        this.container = new _Container2.default();
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath() {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application) {
        this.application = application;

        // Listen the end of configuration loading
        this.application.on(_Application2.default.EVENT_CONFIGURATION_LOADED, (0, _bindGenerator2.default)(this, this.onConfigurationLoaded));

        // Listen the end of bundles initialization
        this.application.on(_Application2.default.EVENT_BUNDLES_INITIALIZED, (0, _bindGenerator2.default)(this, this.onBundlesInitialized));

        // The first service is the container itself
        var definition = this.container.register("container", this.container);
        definition.setClassPath("" + __dirname + _path2.default.sep + "ServiceContainer" + _path2.default.sep + "Container");
    }

    /**
     * The configuration is loaded
     *
     * @param   {solfegejs/kernel/Application}      application     Solfege application
     * @param   {solfegejs/kernel/Configuration}    configuration   Solfege configuration
     */
    *onConfigurationLoaded(application, configuration) {
        this.container.setConfiguration(configuration);
    }

    /**
     * The bundles are initialized
     */
    *onBundlesInitialized() {
        var bundles = this.application.getBundles();

        // Load services from the bundles

        if (!(bundles && (typeof bundles[Symbol.iterator] === 'function' || Array.isArray(bundles)))) {
            throw new TypeError("Expected bundles to be iterable, got " + _inspect(bundles));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var bundle = _step.value;

                // If the bundle implements configureContainer method, then call it
                if ((0, _isGenerator.fn)(bundle.configureContainer)) {
                    yield bundle.configureContainer(this.container);
                }

                // Otherwise, look at the default configuration file
                var bundlePath = this.application.getBundleDirectoryPath(bundle);
                if (!bundlePath) {
                    throw new Error("Unable to find bundle directory path");
                }
                var configurationFile = "" + bundlePath + _path2.default.sep + "services.yml";
                if (yield _coFs2.default.exists(configurationFile)) {
                    yield this.loadConfigurationFile(configurationFile);
                }
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
    }

    /**
     * Boot the bundle
     */
    *boot() {
        // Compile
        yield this.container.compile();

        // The container is ready
    }

    /**
     * Load a configuration file
     *
     * @param   {String}    filePath    The file path
     */
    *loadConfigurationFile(filePath) {
        if (!(typeof filePath === 'string')) {
            throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
        }

        var configuration = (0, _configYaml2.default)(filePath, { encoding: "utf8" });

        // Parse the services
        if (_typeof(configuration.services) !== 'object') {
            return;
        }
        for (var serviceId in configuration.services) {
            var serviceConfiguration = configuration.services[serviceId];

            // Class path is relative to configuration file if it exists
            if (serviceConfiguration.class) {
                var directoryPath = _path2.default.dirname(filePath);
                var classPath = directoryPath + _path2.default.sep + serviceConfiguration.class;

                try {
                    var classConstructor = require(classPath);
                    serviceConfiguration.class = classPath;
                } catch (error) {
                    serviceConfiguration.class = serviceConfiguration.class;
                }
            }

            // Build definition and register it
            var definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
            this.container.setDefinition(serviceId, definition);
        }
    }
}
exports.default = Bundle;

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