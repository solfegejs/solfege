"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _GeneratorUtil = require("../../utils/GeneratorUtil");

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
        this.application.on(_Application2.default.EVENT_START, (0, _GeneratorUtil.bindGenerator)(this, this.onStart));
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
                if (!(0, _GeneratorUtil.isGenerator)(command.configure)) {
                    throw new Error("Command must implement \"configure\" method.");
                }
                if (typeof command.getName !== "function") {
                    throw new Error("Command must implement \"getName\" method.");
                }

                yield command.configure();
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
            var commandName = parameters[0];

            if (commandMap.has(commandName)) {
                var _command = commandMap.get(commandName);

                // Execute the command
                yield _command.execute();
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
                var description = command.getDescription();

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