/**
 * @module solfege.util.Function
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.bindGenerator = bindGenerator;
exports.createThunk = createThunk;
exports.createPromise = createPromise;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

/**
 * Bind a generator function
 *
 * @param   {Object}    scope   The scope object
 * @param   {Function}  target  The generator function
 * @return  {Function}          The binded function
 */

function bindGenerator(scope, target) {
    // Check parameters
    _assert2['default'].strictEqual(typeof target, 'function', 'The target must be a function');

    return function* () {
        return yield target.apply(scope, arguments);
    };
}

;

/**
 * Create a thunk of a function
 *
 * <p>The last argument of the function must be the callback.</p>
 * <p>The first argument of the callback must be the error object.</p>
 *
 * @param   {Function}  func    The function
 * @return  {Function}          The thunk
 */

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

/**
 * Create a primise of a function
 *
 * <p>The last argument of the function must be the callback.</p>
 *
 * @param   {Function}  func    The function
 * @return  {Function}          The Promise
 */

function createPromise(func) {
    // Check parameter
    _assert2['default'].strictEqual(typeof func, 'function', 'The func must be a function');

    return function () {
        var self = this;
        var args = [];

        for (var index = 0, total = arguments.length; index < total; ++index) {
            args[index] = arguments[index];
        }

        return new Promise(function (resolve, reject) {
            args.push(function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            });
            try {
                func.apply(self, args);
            } catch (error) {
                reject(error);
            }
        });
    };
}

;