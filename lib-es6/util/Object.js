/**
 * @module solfege.util.Object
 */
import assert from 'assert';


/**
 * Define a constant
 *
 * @param   {Object}    target  The target object
 * @param   {String}    name    The constant name
 * @param   {*}         value   The constant value
 */
export function define(target, name, value)
{
    // Check parameters
    assert.strictEqual(typeof name, 'string', 'The name must be a string');

    Object.defineProperty(target, name, {
        get: function() {
            return value;
        }
    });
}

/**
 * Merge objects
 *
 * @example
 * var merged = solfege.util.Object.merge(object1, object2, object3);
 *
 * @param   {...Object} object  An object
 */
export function merge(...items)
{
    let result = items.shift();
    let count = items.length;

    if (count > 0 && (typeof result !== 'object' || result instanceof Array)) {
        return items.pop();
    }

    for (let index = 0; index < count; ++index) {
        let item = items[index];

        for (var key in item) {
            result[key] = arguments.callee(result[key], item[key]);
        }
    }

    return result;
}
