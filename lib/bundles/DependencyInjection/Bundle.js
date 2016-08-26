"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _coFs = require("co-fs");

var _coFs2 = _interopRequireDefault(_coFs);

var _jsYaml = require("js-yaml");

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _GeneratorUtil = require("../../utils/GeneratorUtil");

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

        // Listen the end of bundles initialization
        this.application.on(_Application2.default.EVENT_BUNDLES_INITIALIZED, (0, _GeneratorUtil.bindGenerator)(this, this.onBundlesInitialized));

        // The first service is the container itself
        var definition = this.container.register("container", this.container);
        definition.setClassPath("" + __dirname + _path2.default.sep + "ServiceContainer" + _path2.default.sep + "Container");
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
                if ((0, _GeneratorUtil.isGenerator)(bundle.configureContainer)) {
                    yield bundle.configureContainer(this.container);
                }

                // Otherwise, look at the default configuration file
                var bundlePath = bundle.getPath();
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
        var content = yield _coFs2.default.readFile(filePath, 'utf8');
        var configuration = _jsYaml2.default.safeLoad(content);

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

function _inspect(input) {
    function _ref2(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
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

        var entries = keys.map(_ref2).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];