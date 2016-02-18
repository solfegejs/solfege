'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * Utils for virtualized objects (proxies)
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   * @module solfege.util.ObjectProxy
                                                                                                                                                                                                                                                   */

exports.createPackage = createPackage;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a package
 *
 * @param   {string}    directoryPath   The directory path of the package
 * @param   {Object}    [getters]       The additional getters
 * @param   {Object}    [setters]       The additional setters
 */

function _ref(name) {
    var property = this.get(name);
    if ('undefined' === typeof property) {
        return {};
    }

    return {
        configurable: true,
        enumerable: true,
        value: property
    };
}

function _ref2() {
    return [];
}

function _ref3(name) {
    var property = this.get(name);
    if ('undefined' !== typeof property) {
        return true;
    }
    return false;
}

function createPackage(directoryPath, getters, setters) {
    if (!(typeof directoryPath === 'string')) {
        throw new TypeError('Value of argument "directoryPath" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(directoryPath));
    }

    var cache = {};

    var proxy = Proxy.create({
        // Returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain)
        getOwnPropertyDescriptor: _ref,

        // Returns an array of all properties (enumerable or not) found
        getOwnPropertyNames: _ref2,

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
            if (_fs2.default.existsSync(subPackagePath)) {
                var subPackage = require(subPackagePath);
                cache[name] = subPackage;
                return subPackage;
            }

            // Return a class
            var classPath = subPackagePath + '.js';
            if (_fs2.default.existsSync(classPath)) {
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
        has: _ref3
    });

    return proxy;
};

function _inspect(input) {
    function _ref5(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref4(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref4)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        var entries = keys.map(_ref5).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}