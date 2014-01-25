var fs = require('fs');


/**
 * Utils for virtualized objects (proxies)
 */
var ObjectProxy = {};

/**
 * Create a package
 *
 * @param   {string}    directoryPath   The directory path of the package
 * @param   {any}       getters         The additional getters
 * @param   {any}       setters         The additional setters
 */
ObjectProxy.createPackage = function(directoryPath, getters, setters)
{
    var cache = {};

    var proxy = Proxy.create({
        getOwnPropertyDescriptor: function(name)
        {
            return {};
        },

        getOwnPropertyNames: function()
        {
            return {};
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
        }
    });

    return proxy;
};

module.exports = ObjectProxy;
