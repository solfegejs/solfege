"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _isGenerator = require("is-generator");

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _CommandCompilerPass = require("./DependencyInjection/Compiler/CommandCompilerPass");

var _CommandCompilerPass2 = _interopRequireDefault(_CommandCompilerPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Console bundle
 */
class Bundle {
    /**
     * Constructor
     */
    constructor() {
        // Initialize properties
        this.application;
        this.container;
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

        // Listen the application start
        this.application.on(_Application2.default.EVENT_START, (0, _bindGenerator2.default)(this, this.onStart));
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container       Service container
     */
    *configureContainer(container) {
        this.container = container;

        // Add the compiler pass that handle command tags
        this.container.addCompilerPass(new _CommandCompilerPass2.default());
    }

    /**
     * The application is started
     *
     * @param   {solfege/kernel/Application}    application     The application
     * @param   {Array}                         parameters      The parameters
     */
    *onStart(application, parameters) {
        // Get commands
        var commandsRegistry = yield this.container.get("solfege_console_commands_registry");
        var commands = commandsRegistry.getCommands();

        // Copy parameters
        parameters = parameters.slice(0);

        // Configure commands
        // and create a map
        var commandMap = new Map();

        if (!(commands && (typeof commands[Symbol.iterator] === 'function' || Array.isArray(commands)))) {
            throw new TypeError("Expected commands to be iterable, got " + _inspect(commands));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var command = _step.value;

                // Check signature requirements
                if (typeof command.getName !== "function") {
                    throw new Error("Command must implement \"getName\" method.");
                }

                if ((0, _isGenerator.fn)(command.configure)) {
                    yield command.configure();
                }

                var name = command.getName();
                commandMap.set(name, command);
            }

            // Check if the user executes a command
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

        if (parameters.length > 0) {
            var commandName = parameters.shift();

            if (commandMap.has(commandName)) {
                var _command = commandMap.get(commandName);

                // Execute the command
                var commandParameters = parameters.slice(0);
                yield _command.execute(commandParameters);
                return;
            }
        }

        // Display the header
        var title = "SolfegeJS CLI";
        console.info(title.bgBlack.cyan);
        console.info("-".repeat(title.length).bgBlack.cyan + "\n");

        // Display command list
        yield this.displayAvailableCommands(commands);
    }

    /**
     * Display available commands
     *
     * @param   {Set}   commands    Commands
     */
    *displayAvailableCommands(commands) {
        if (!(commands instanceof Set)) {
            throw new TypeError("Value of argument \"commands\" violates contract.\n\nExpected:\nSet\n\nGot:\n" + _inspect(commands));
        }

        if (!(commands && (typeof commands[Symbol.iterator] === 'function' || Array.isArray(commands)))) {
            throw new TypeError("Expected commands to be iterable, got " + _inspect(commands));
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = commands[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var command = _step2.value;

                var name = command.getName();
                var description = "";
                if (typeof command.getDescription === "function") {
                    description = command.getDescription();
                }

                console.info(name.green + "   " + description);
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