/**
 * @module solfege.util.Object
 */

/**
 * Define a constant
 *
 * @param   {Object}    target  The target object
 * @param   {String}    name    The constant name
 * @param   {mixed}     value   The constant value
 */
module.exports.define = function(target, name, value)
{
    Object.defineProperty(target, name, {
        get: function() {
            return value;
        }
    });
};

/**
 * Merge objects
 *
 * Example:
 * var merged = solfege.util.Object.merge(object1, object2, object3);
 */
module.exports.merge = function()
{
    var items = Array.prototype.slice.call(arguments);
    var result = items.shift();
    var count = items.length;

    if (count > 0 && (typeof result !== 'object' || result instanceof Array)) {
        return items.pop();
    }

    for (var index = 0; index < count; ++index) {
        var item = items[index];

        for (var key in item) {
            result[key] = arguments.callee(result[key], item[key]);
        }
    }

    return result;
};
