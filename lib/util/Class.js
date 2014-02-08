/**
 * Create a class
 *
 * @param   {Function}  constructor     The constructor
 * @param   {String}    name            The name
 * @param   {Function}  parentClass     The class to inherit
 */
module.exports.create = function(constructor, name, parentClass)
{
    // Extends a class
    if (parentClass) {
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
