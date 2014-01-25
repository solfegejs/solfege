/**
 * Bind a generator function
 *
 * @param   {Object}    scope   The scope object
 * @param   {Function}  target  The generator function
 * @return  {Function}          The binded function
 */
module.exports.bindGenerator = function(scope, target)
{
    return function*() {
        return yield target.apply(scope, arguments);
    };
};
