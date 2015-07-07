/**
 * Utils for virtualized objects (proxies)
 *
 * @module solfege.util.ObjectProxy
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createPackage = createPackage;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

/**
 * Create a package
 *
 * @param   {string}    directoryPath   The directory path of the package
 * @param   {Object}    [getters]       The additional getters
 * @param   {Object}    [setters]       The additional setters
 */

function createPackage(directoryPath, getters, setters) {
    // Check parameters
    _assert2['default'].strictEqual(typeof directoryPath, 'string', 'The directoryPath must be a string');

    var cache = {};

    var proxy = Proxy.create({
        // Returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain)
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(name) {
            var property = this.get(name);
            if ('undefined' === typeof property) {
                return {};
            }

            return {
                configurable: true,
                enumerable: true,
                value: property
            };
        },

        // Returns an array of all properties (enumerable or not) found
        getOwnPropertyNames: function getOwnPropertyNames() {
            return [];
        },

        // Define the magic getter
        get: function get(receiver, name) {
            // Check the cache
            if (cache.hasOwnProperty(name)) {
                return cache[name];
            }

            // Check the additional getters
            if (getters) {
                for (var getterName in getters) {
                    if (name === getterName) {
                        cache[name] = getters[name];
                        return getters[name];
                    }
                }
            }

            // Return a sub package
            var subPackagePath = directoryPath + '/' + name;
            if (_fs2['default'].existsSync(subPackagePath)) {
                var subPackage = require(subPackagePath);
                cache[name] = subPackage;
                return subPackage;
            }

            // Return a class
            var classPath = subPackagePath + '.js';
            if (_fs2['default'].existsSync(classPath)) {
                var classReference = require(classPath);
                cache[name] = classReference;
                return classReference;
            }

            // By default, return undefined
            return undefined;
        },

        // Define the magic setters
        set: function set(receiver, name, value) {
            // Check the additional setters
            if (setters) {
                for (var setterName in setters) {
                    if (name === setterName) {
                        setters[setterName] = value;
                        break;
                    }
                }
            }
        },

        // Check if the property exists
        has: function has(name) {
            var property = this.get(name);
            if ('undefined' !== typeof property) {
                return true;
            }
            return false;
        }
    });

    return proxy;
}

;