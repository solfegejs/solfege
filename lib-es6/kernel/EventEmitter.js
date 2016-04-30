import assert from "assert";

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
     * @param   {String}    name        The event name
     * @param   {...*}      parameter   A parameter
     */
    *emit(name:string)
    {
        // Get the listeners
        let eventListeners = this.getEventListeners(name);

        // Build the handler arguments
        let handlerArguments = [];
        let argumentCount = arguments.length;
        for (let argumentIndex = 1; argumentIndex < argumentCount; ++argumentIndex) {
            handlerArguments.push(arguments[argumentIndex]);
        }

        // Execute each handler
        let listenerCount = eventListeners.length;
        for (let listenerIndex = 0; listenerIndex < listenerCount; ++listenerIndex) {
            let handler = eventListeners[listenerIndex];
            yield *handler.apply(this, handlerArguments);
        }
    }

    /**
     * Add a listener
     *
     * @public
     * @param   {String}    name        The event name
     * @param   {Function}  handler     The listener function
     */
    on(name:string, handler)
    {
        // Check the handler
        assert.strictEqual(typeof handler, 'function', 'The event handler must be a generator function');
        assert.strictEqual(handler.constructor.name, 'GeneratorFunction', 'The event handler must be a generator function');

        let eventListeners = this.getEventListeners(name);
        eventListeners.push(handler);
    }

    /**
     * Get the listeners of an event name
     *
     * @private
     * @param   {String}        name    The event name
     * @return  {Function[]}            The listeners
     */
    getEventListeners(name:string)
    {
        let eventListeners;

        if (this.listeners.has(name)) {
            eventListeners = this.listeners.get(name);
        } else {
            eventListeners = [];
            this.listeners.set(name, eventListeners);
        }

        return eventListeners;
    }
}

