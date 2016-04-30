'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.bindGenerator = bindGenerator;
exports.isGenerator = isGenerator;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bind a generator function
 *
 * @param   {Object}    scope   The scope object
 * @param   {Function}  target  The generator function
 * @return  {Function}          The binded function
 */
function bindGenerator(scope, target) {
    // Check parameters
    _assert2.default.strictEqual(typeof target === 'undefined' ? 'undefined' : _typeof(target), 'function', 'The target must be a function');

    return function* () {
        return yield target.apply(scope, arguments);
    };
};

/**
 * Indicates if the target is a generator function
 *
 * @param   {Function}  target      The target
 * @return  {Boolean}               true if the target is a generator function, false otherwise
 */
function isGenerator(target) {
    if (typeof target !== 'function') {
        return false;
    }
    if ('GeneratorFunction' !== target.constructor.name) {
        return false;
    }
    return true;
};