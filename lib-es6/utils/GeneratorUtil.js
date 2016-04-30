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
 * Indicates if the target is a generator function
 *
 * @param   {Function}  target      The target
 * @return  {Boolean}               true if the target is a generator function, false otherwise
 */
export function isGenerator(target)
{
    if (typeof target !== 'function') {
        return false;
    }
    if ('GeneratorFunction' !== target.constructor.name) {
        return false;
    }
    return true;
};
