'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

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

    return _regeneratorRuntime.mark(function callee$1$0() {
        var args$2$0 = arguments;
        return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return target.apply(scope, args$2$0);

                case 2:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                    return context$2$0.stop();
            }
        }, callee$1$0, this);
    });
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