/**
 * @module solfege.util.Class
 */
var assert = require('assert');

/**
 * Create a class
 *
 * @param   {Function}  constructor     - The constructor
 * @param   {String}    name            - The name
 * @param   {Function}  [parentClass]   - The class to inherit
 */
module.exports.create = function(constructor, name, parentClass)
{
    // Check parameters
    assert.strictEqual(typeof constructor, 'function', 'The constructor must be a function');
    assert.strictEqual(typeof name, 'string', 'The name must be a string');

    // Extends a class
    if (parentClass) {
        assert.strictEqual(typeof parentClass, 'function', 'The constructor must be a function');
        constructor.prototype.__proto__ = parentClass.prototype;
    }


    var proto = constructor.prototype;

    // Define the default string representation
    proto.toString = function()
    {
        return '{' + name + '}';
    };

    return constructor;
};
