var solfege = require('../solfege');
var assert = require('assert');

/**
 * An event emitter written with generators
 *
 * @class solfege.kernel.EventEmitter
 */
export default class EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
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
    *emit(name)
    {
        // Check the parameters
        assert.strictEqual(typeof name, 'string', 'The name must be a string');

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
            yield *handler.apply(this, handlerArguments);
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
    on(name, handler)
    {
        // Check the name
        assert.strictEqual(typeof name, 'string', 'The name must be a string');

        // Check the handler
        assert.strictEqual(typeof handler, 'function', 'The event handler must be a generator function');
        assert.strictEqual(handler.constructor.name, 'GeneratorFunction', 'The event handler must be a generator function');

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
    getEventListeners(name)
    {
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
}

