"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _solfege = require("../solfege");

var _solfege2 = _interopRequireDefault(_solfege);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An event emitter written with generators
 *
 * @class solfege.kernel.EventEmitter
 */
class EventEmitter {
    /**
     * Constructor
     */
    constructor() {
        // Initialize the map of listeners
        this.listeners = new Map();
    }

    /**
     * Emit an event
     *
     * @public
     * @method  solfege.kernel.EventEmitter.prototype.emit
     * @param   {String} name - The event name
     * @param   {...*} parameter - A parameter
     */
    *emit(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        // Get the listeners
        var eventListeners = this.getEventListeners(name);

        // Build the handler arguments
        var handlerArguments = [];
        var argumentCount = arguments.length;
        for (var argumentIndex = 1; argumentIndex < argumentCount; ++argumentIndex) {
            handlerArguments.push(arguments[argumentIndex]);
        }

        // Execute each handler
        var listenerCount = eventListeners.length;
        for (var listenerIndex = 0; listenerIndex < listenerCount; ++listenerIndex) {
            var handler = eventListeners[listenerIndex];
            yield* handler.apply(this, handlerArguments);
        }
    }

    /**
     * Add a listener
     *
     * @public
     * @method  solfege.kernel.EventEmitter.prototype.on
     * @param   {String} name - The event name
     * @param   {Function} handler - The listener function
     */
    on(name, handler) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        // Check the handler
        _assert2.default.strictEqual(typeof handler === "undefined" ? "undefined" : _typeof(handler), 'function', 'The event handler must be a generator function');
        _assert2.default.strictEqual(handler.constructor.name, 'GeneratorFunction', 'The event handler must be a generator function');

        var eventListeners = this.getEventListeners(name);
        eventListeners.push(handler);
    }

    /**
     * Get the listeners of an event name
     *
     * @private
     * @method  solfege.kernel.EventEmitter.prototype.getEventListeners
     * @param   {String} name - The event name
     * @return  {Function[]} The listeners
     */
    getEventListeners(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        var eventListeners;

        if (this.listeners.has(name)) {
            eventListeners = this.listeners.get(name);
        } else {
            eventListeners = [];
            this.listeners.set(name, eventListeners);
        }

        return eventListeners;
    }
}
exports.default = EventEmitter;

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