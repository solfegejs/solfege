/**
 * @module solfege.util.Function
 */

/**
 * Bind a generator function
 *
 * @static
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


/**
 * Create a thunk of a function
 *
 * The last argument of the function must be the callback.
 * The first argument of the callback must be the error object.
 *
 * @param   {Function}  func    The function
 * @return  {Function}          The thunk
 */
module.exports.createThunk = function(func)
{
    var assert = require('assert');
    assert(typeof func === 'function', 'solfege.util.Function.createThunk(func:Function)  ~> func is not a function');

    return function() {
        var self = this;
        var args = [];

        for (var index = 0, total = arguments.length; index < total; ++index) {
            args[index] = arguments[index];
        }

        return function(done) {
            args.push(done);

            try {
                func.apply(self, args);
            } catch (error) {
                done(error);
            }
        }
    }
};
