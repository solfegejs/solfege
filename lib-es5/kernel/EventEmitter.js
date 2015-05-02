'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var solfege = require('../solfege');
var assert = require('assert');

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
        this.listeners = new _Map();
    }

    _createClass(EventEmitter, [{
        key: 'emit',

        /**
         * Emit an event
         *
         * @public
         * @method  solfege.kernel.EventEmitter.prototype.emit
         * @param   {String} name - The event name
         * @param   {...*} parameter - A parameter
         */
        value: _regeneratorRuntime.mark(function emit(name) {
            var eventListeners,
                handlerArguments,
                argumentCount,
                argumentIndex,
                listenerCount,
                listenerIndex,
                handler,
                args$2$0 = arguments;
            return _regeneratorRuntime.wrap(function emit$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        // Check the parameters
                        assert.strictEqual(typeof name, 'string', 'The name must be a string');

                        eventListeners = this.getEventListeners(name);
                        handlerArguments = [];
                        argumentCount = args$2$0.length;

                        for (argumentIndex = 1; argumentIndex < argumentCount; ++argumentIndex) {
                            handlerArguments.push(args$2$0[argumentIndex]);
                        }

                        listenerCount = eventListeners.length;
                        listenerIndex = 0;

                    case 7:
                        if (!(listenerIndex < listenerCount)) {
                            context$2$0.next = 13;
                            break;
                        }

                        handler = eventListeners[listenerIndex];
                        return context$2$0.delegateYield(handler.apply(this, handlerArguments), 't52', 10);

                    case 10:
                        ++listenerIndex;
                        context$2$0.next = 7;
                        break;

                    case 13:
                    case 'end':
                        return context$2$0.stop();
                }
            }, emit, this);
        })
    }, {
        key: 'on',

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
            assert.strictEqual(typeof name, 'string', 'The name must be a string');

            // Check the handler
            assert.strictEqual(typeof handler, 'function', 'The event handler must be a generator function');
            assert.strictEqual(handler.constructor.name, 'GeneratorFunction', 'The event handler must be a generator function');

            var eventListeners = this.getEventListeners(name);
            eventListeners.push(handler);
        }
    }, {
        key: 'getEventListeners',

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
            assert.strictEqual(typeof name, 'string', 'The name must be a string');

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

exports['default'] = EventEmitter;
module.exports = exports['default'];
// Get the listeners

// Build the handler arguments
// Execute each handler