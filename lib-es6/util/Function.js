/**
 * @module solfege.util.Function
 */
import assert from 'assert';

/**
 * Bind a generator function
 *
 * @param   {Object}    scope   The scope object
 * @param   {Function}  target  The generator function
 * @return  {Function}          The binded function
 */
export function bindGenerator(scope, target)
{
    // Check parameters
    assert.strictEqual(typeof target, 'function', 'The target must be a function');

    return function*() {
        return yield target.apply(scope, arguments);
    };
};


/**
 * Create a thunk of a function
 *
 * <p>The last argument of the function must be the callback.</p>
 * <p>The first argument of the callback must be the error object.</p>
 *
 * @param   {Function}  func    The function
 * @return  {Function}          The thunk
 */
export function createThunk(func)
{
    // Check parameter
    assert.strictEqual(typeof func, 'function', 'The func must be a function');

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
