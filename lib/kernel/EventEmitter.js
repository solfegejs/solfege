var solfege = require('../solfege');

/**
 * An event emitter written with generators
 */
var EventEmitter = solfege.util.Class.create(function()
{
    // Initialize the map of listeners
    this.listeners = new Map();

}, 'solfege.kernel.EventEmitter');
var proto = EventEmitter.prototype;


/**
 * The listeners
 *
 * @type {Map}
 * @api private
 */
proto.listeners;

/**
 * Emit an event
 *
 * @param   {String}    name    The event name
 * @param   {any}       param1  The first parameter
 * ...
 * @api public
 */
proto.emit = function*(name)
{
    var eventListeners = this.getEventNameListeners(name);

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
};

/**
 * Add a listener
 *
 * @param   {String}    name    The event name
 * @param   {Function}  handler The listener function
 * @api public
 */
proto.on = function(name, handler)
{
    // Check the handler
    if ('function' !== typeof handler) {
        console.error('The event handler must be a function');
        return;
    }
    if ('GeneratorFunction' !== handler.constructor.name) {
        console.error('The event handler must be a generator function');
        return;
    }

    var eventListeners = this.getEventNameListeners(name);
    eventListeners.push(handler);
};

/**
 * Get the listeners of an event name
 *
 * @param   {String}    name    The event name
 * @return  {array}             The set
 * @api private
 */
proto.getEventNameListeners = function(name)
{
    var eventListeners;

    if (this.listeners.has(name)) {
        eventListeners = this.listeners.get(name);
    } else {
        eventListeners = [];
        this.listeners.set(name, eventListeners);
    }

    return eventListeners;
};

module.exports = EventEmitter;
