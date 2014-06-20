/**
 * Utils for virtualized objects (proxies)
 *
 * @module solfege.util.ObjectProxy
 */

var fs = require('fs');
var assert = require('assert');

/**
 * Create a package
 *
 * @param   {string}    directoryPath   The directory path of the package
 * @param   {Object}    [getters]       The additional getters
 * @param   {Object}    [setters]       The additional setters
 */
module.exports.createPackage = function(directoryPath, getters, setters)
{
    // Check parameters
    assert.strictEqual(typeof directoryPath, 'string', 'The directoryPath must be a string');


    var cache = {};

    var proxy = Proxy.create({
        // Returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain)
        getOwnPropertyDescriptor: function(name)
        {
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
        getOwnPropertyNames: function()
        {
            return [];
        },

        // Define the magic getter
        get: function(receiver, name)
        {
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
            if (fs.existsSync(subPackagePath)) {
                var subPackage = require(subPackagePath);
                cache[name] = subPackage;
                return subPackage;
            }

            // Return a class
            var classPath = subPackagePath + '.js';
            if (fs.existsSync(classPath)) {
                var classReference = require(classPath);
                cache[name] = classReference;
                return classReference;
            }

            // By default, return undefined
            return undefined;
        },

        // Define the magic setters
        set: function(receiver, name, value)
        {
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
        has: function(name)
        {
            var property = this.get(name);
            if ('undefined' !== typeof property) {
                return true;
            }
            return false;
        }
    });

    return proxy;
};

