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
