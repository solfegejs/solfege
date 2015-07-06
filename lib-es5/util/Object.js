'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

/**
 * Define a constant
 *
 * @param   {Object}    target  The target object
 * @param   {String}    name    The constant name
 * @param   {*}         value   The constant value
 */
exports.define = define;

/**
 * Merge objects
 *
 * @example
 * var merged = solfege.util.Object.merge(object1, object2, object3);
 *
 * @param   {...Object} object  An object
 */
exports.merge = merge;
/**
 * @module solfege.util.Object
 */

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function define(target, name, value) {
    // Check parameters
    _assert2['default'].strictEqual(typeof name, 'string', 'The name must be a string');

    Object.defineProperty(target, name, {
        get: function get() {
            return value;
        }
    });
}

function merge() {
    for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
    }

    var result = items.shift();
    var count = items.length;

    if (count > 0 && (typeof result !== 'object' || result instanceof Array)) {
        return items.pop();
    }

    for (var index = 0; index < count; ++index) {
        var item = items[index];

        for (var key in item) {
            result[key] = arguments.callee(result[key], item[key]);
        }
    }

    return result;
}