/* @flow */
import assert from "assert";

/**
 * An event emitter written with generators
 *
 * @class solfege.kernel.EventEmitter
 */
export default class EventEmitter
{
    /**
     * Listeners
     */
    listeners:*;

    /**
     * Constructor
     */
    constructor():void
    {
        // Initialize the map of listeners
        this.listeners = new Map();
    }

    /**
     * Emit an event
     *
     * @param   {string}    name        Event name
     * @param   {...*}      parameters  Parameters
     */
    *emit(name:string, ...parameters:*):*
    {
        // Get the listeners
        let eventListeners = this.getEventListeners(name);

        // Build the handler arguments
        let handlerArguments:Array<string> = [];
        let argumentCount:number = arguments.length;
        for (let argumentIndex:number = 1; argumentIndex < argumentCount; ++argumentIndex) {
            handlerArguments.push(arguments[argumentIndex]);
        }

        // Execute each handler
        let listenerCount:number = eventListeners.length;
        for (let listenerIndex:number = 0; listenerIndex < listenerCount; ++listenerIndex) {
            let handler = eventListeners[listenerIndex];
            yield *handler.apply(this, handlerArguments);
        }
    }

    /**
     * Add a listener
     *
     * @param   {string}    name        The event name
     * @param   {Function}  handler     The listener function
     */
    on(name:string, handler:Function):void
    {
        // Check the handler
        assert.strictEqual(typeof handler, "function", "The event handler must be a generator function");
        assert.strictEqual(handler.constructor.name, "GeneratorFunction", "The event handler must be a generator function");

        let eventListeners = this.getEventListeners(name);
        eventListeners.push(handler);
    }

    /**
     * Get the listeners of an event name
     *
     * @private
     * @param   {string}        name    The event name
     * @return  {Function[]}            The listeners
     */
    getEventListeners(name:string):*
    {
        let eventListeners:* = [];

        if (this.listeners.has(name)) {
            eventListeners = this.listeners.get(name);
        } else {
            this.listeners.set(name, eventListeners);
        }

        return eventListeners;
    }
}

