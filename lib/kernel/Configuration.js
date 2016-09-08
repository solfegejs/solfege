"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Application configuration
 */
class Configuration {
    /**
     * Constructor
     */
    constructor() {
        this.directoryPath;

        this.store = {};
    }

    /**
     * Set the directory path of the configuration
     *
     * @param   {string}    path    Directory path
     */
    setDirectoryPath(path) {
        if (!(typeof path === 'string')) {
            throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
        }

        this.directoryPath = path;
    }

    /**
     * Get the directory path of the configuration
     *
     * @return  {string}    Directory path
     */
    getDirectoryPath() {
        return this.directoryPath;
    }

    /**
     * Add properties
     *
     * @param   {object}    properties  Properties
     */
    addProperties(properties) {
        this.store = this.merge(this.store, properties);

        var iterationCount = 0;
        while (true) {
            iterationCount++;
            if (iterationCount > 100) {
                throw new Error("Recursion in configuration detected");
            }

            var dependencyCount = this.resolveProperties(this.store);
            if (dependencyCount === 0) {
                break;
            }
        }
    }

    /**
     * Get a property name from configuration
     *
     * @param   {string}    propertyName    The property name
     * @return  {*}                         The property value
     */
    get(propertyName) {
        if (!(typeof propertyName === 'string')) {
            throw new TypeError("Value of argument \"propertyName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(propertyName));
        }

        // Defined properties
        switch (propertyName) {
            case "configuration_directory_path":
                return this.getDirectoryPath();
        }

        // Find the property value
        var propertyValue = undefined;
        var propertySplittedName = propertyName.split(".");
        var property = this.store;

        if (!(propertySplittedName && (typeof propertySplittedName[Symbol.iterator] === 'function' || Array.isArray(propertySplittedName)))) {
            throw new TypeError("Expected propertySplittedName to be iterable, got " + _inspect(propertySplittedName));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = propertySplittedName[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var name = _step.value;

                if ((typeof property === "undefined" ? "undefined" : _typeof(property)) !== "object" || !property.hasOwnProperty(name)) {
                    console.error("Property not found: " + propertyName);
                    return undefined;
                }
                property = property[name];
                propertyValue = property;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return propertyValue;
        //return this.resolvePropertyValue(propertyValue);
    }

    /**
     * Resolve a property value
     *
     * @param   {*}     value   Property value
     */
    resolvePropertyValue(value) {
        var _this = this;

        if (typeof value !== "string") {
            return value;
        }

        // If the value contains only 1 property, then I replace it with the property value
        // Otherwise, the value stays a string and the properties are replaced
        var resolvedValue = void 0;
        var singlePropertyMatched = value.match(/^%([^%]+)%$/);

        function _ref(match, propertyName) {
            var propertyValue = _this.get(propertyName);
            if (propertyValue === undefined) {
                return "";
            }

            return propertyValue;
        }

        if (Array.isArray(singlePropertyMatched)) {
            var propertyName = singlePropertyMatched[1];
            resolvedValue = this.get(propertyName);
        } else {
            resolvedValue = value.replace(/%([^%]+)%/g, _ref);
        }

        // Check number
        var numberCast = Number(resolvedValue);
        if (numberCast == resolvedValue) {
            return numberCast;
        }

        return resolvedValue;
    }

    /**
     * Resolve properties in a store
     *
     * @private
     * @param   {*}         store   The store (array or object)
     * @return  {uint32}            The dependency count
     */
    resolveProperties(store) {
        if (!Array.isArray(store) && (typeof store === "undefined" ? "undefined" : _typeof(store)) !== "object") {
            return 0;
        }

        var dependencyCount = 0;

        for (var key in store) {
            var item = store[key];

            if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                var subDependencyCount = this.resolveProperties(item);
                dependencyCount += subDependencyCount;
                continue;
            }

            var resolvedValue = this.resolvePropertyValue(item);
            if (this.propertyHasDependency(resolvedValue)) {
                dependencyCount++;
            } else {
                store[key] = resolvedValue;
            }
        }

        return dependencyCount;
    }

    /**
     * Indicates that a property value has dependency with another property
     *
     * @param   {*}         propertyValue   PropertyValue
     * @return  {boolean}                   true if the value has dependency, false otherwise
     */
    propertyHasDependency(propertyValue) {
        if (typeof propertyValue !== "string") {
            return false;
        }

        var dependentPropertyNames = propertyValue.match(/%[^%]+%/g);
        if (!Array.isArray(dependentPropertyNames)) {
            return false;
        }

        return true;
    }

    /**
     * Merge properties
     *
     * @private
     * @param   {object}    source          Source properties
     * @param   {object}    properties      New properties
     */
    merge(source, properties) {
        var result = void 0;

        if (Array.isArray(properties)) {
            result = [];
            source = source || [];

            // Copy source properties
            result = result.concat(source);

            // Merge new properties
            for (var index in properties) {
                var item = properties[index];

                if (typeof result[index] === "undefined") {
                    // The index does not exist
                    result[index] = item;
                } else if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                    // The new property is an object
                    result[index] = this.merge(source[index], item);
                } else if (source.indexOf(item) === -1) {
                    // The new property is not in the list
                    result.push(item);
                }
            }
        } else {
            result = {};

            // Copy source properties
            if ((typeof source === "undefined" ? "undefined" : _typeof(source)) === "object") {
                for (var key in source) {
                    result[key] = source[key];
                }
            }

            // Merge new properties
            for (var _key in properties) {
                var _item = properties[_key];

                if (typeof result[_key] === "undefined") {
                    // The key does not exist
                    result[_key] = _item;
                } else if ((typeof _item === "undefined" ? "undefined" : _typeof(_item)) === "object") {
                    // The new property is an object
                    result[_key] = this.merge(source[_key], _item);
                } else {
                    // Override value
                    result[_key] = _item;
                }
            }
        }

        return result;
    }
}
exports.default = Configuration;

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}

module.exports = exports["default"];