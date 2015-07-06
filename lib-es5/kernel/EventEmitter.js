"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _solfege = require("../solfege");

var _solfege2 = _interopRequireDefault(_solfege);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

/**
 * An event emitter written with generators
 *
 * @class solfege.kernel.EventEmitter
 */

var EventEmitter = (function () {
    /**
     * Constructor
     */

    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        // Initialize the map of listeners
        this.listeners = new Map();
    }

    _createClass(EventEmitter, [{
        key: "emit",

        /**
         * Emit an event
         *
         * @public
         * @method  solfege.kernel.EventEmitter.prototype.emit
         * @param   {String} name - The event name
         * @param   {...*} parameter - A parameter
         */
        value: function* emit(name) {
            // Check the parameters
            _assert2["default"].strictEqual(typeof name, "string", "The name must be a string");

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
    }, {
        key: "on",

        /**
         * Add a listener
         *
         * @public
         * @method  solfege.kernel.EventEmitter.prototype.on
         * @param   {String} name - The event name
         * @param   {Function} handler - The listener function
         */
        value: function on(name, handler) {
            // Check the name
            _assert2["default"].strictEqual(typeof name, "string", "The name must be a string");

            // Check the handler
            _assert2["default"].strictEqual(typeof handler, "function", "The event handler must be a generator function");
            _assert2["default"].strictEqual(handler.constructor.name, "GeneratorFunction", "The event handler must be a generator function");

            var eventListeners = this.getEventListeners(name);
            eventListeners.push(handler);
        }
    }, {
        key: "getEventListeners",

        /**
         * Get the listeners of an event name
         *
         * @private
         * @method  solfege.kernel.EventEmitter.prototype.getEventListeners
         * @param   {String} name - The event name
         * @return  {Function[]} The listeners
         */
        value: function getEventListeners(name) {
            // Check the name
            _assert2["default"].strictEqual(typeof name, "string", "The name must be a string");

            var eventListeners;

            if (this.listeners.has(name)) {
                eventListeners = this.listeners.get(name);
            } else {
                eventListeners = [];
                this.listeners.set(name, eventListeners);
            }

            return eventListeners;
        }
    }]);

    return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];