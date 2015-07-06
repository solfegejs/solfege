'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

/**
 * Bind a generator function
 *
 * @param   {Object}    scope   The scope object
 * @param   {Function}  target  The generator function
 * @return  {Function}          The binded function
 */
exports.bindGenerator = bindGenerator;

/**
 * Create a thunk of a function
 *
 * <p>The last argument of the function must be the callback.</p>
 * <p>The first argument of the callback must be the error object.</p>
 *
 * @param   {Function}  func    The function
 * @return  {Function}          The thunk
 */
exports.createThunk = createThunk;
/**
 * @module solfege.util.Function
 */

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function bindGenerator(scope, target) {
    // Check parameters
    _assert2['default'].strictEqual(typeof target, 'function', 'The target must be a function');

    return function* () {
        return yield target.apply(scope, arguments);
    };
}

;
function createThunk(func) {
    // Check parameter
    _assert2['default'].strictEqual(typeof func, 'function', 'The func must be a function');

    return function () {
        var self = this;
        var args = [];

        for (var index = 0, total = arguments.length; index < total; ++index) {
            args[index] = arguments[index];
        }

        return function (done) {
            args.push(done);

            try {
                func.apply(self, args);
            } catch (error) {
                done(error);
            }
        };
    };
}

;