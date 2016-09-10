"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Definition = require("./Definition");

var _Definition2 = _interopRequireDefault(_Definition);

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Definition builder
 */
function _ref(argument) {
    if (typeof argument === "string" && argument[0] === "@") {
        var referenceArgument = new _Reference2.default(argument.substr(1));
        return referenceArgument;
    }
    return argument;
}

class DefinitionBuilder {
    /**
     * Constructor
     */
    constructor() {}

    /**
     * Build a definition from configuration
     *
     * @param   {String}        serviceId       Service id
     * @param   {Object}        configuration   Configuration
     * @return  {Definition}                    Service definition
     */
    build(serviceId, configuration) {
        if (!(typeof serviceId === 'string')) {
            throw new TypeError("Value of argument \"serviceId\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(serviceId));
        }

        var definition = new _Definition2.default(serviceId);

        // Class file path
        if (configuration.class) {
            if (configuration.class[0] === "@") {
                var classReference = new _Reference2.default(configuration.class.substr(1));
                definition.setClassReference(classReference);
            } else {
                definition.setClassPath(configuration.class);
            }
        }

        // Factory method
        if (Array.isArray(configuration.factory) && configuration.factory.length === 2) {
            var factoryServiceClass = configuration.factory[0];
            var factoryMethodName = configuration.factory[1];

            if (factoryServiceClass[0] !== "@") {
                throw new Error("Factory class must be a service: " + factoryServiceClass);
            }

            var factoryServiceReference = new _Reference2.default(factoryServiceClass.substr(1));
            definition.setFactory(factoryServiceReference, factoryMethodName);
        }

        // Arguments for class constructor or factory method
        if (Array.isArray(configuration.arguments)) {
            _configuration$argume = configuration.arguments;

            if (!(_configuration$argume && (typeof _configuration$argume[Symbol.iterator] === 'function' || Array.isArray(_configuration$argume)))) {
                throw new TypeError("Expected _configuration$argume to be iterable, got " + _inspect(_configuration$argume));
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _configuration$argume[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _configuration$argume;

                    var argument = _step.value;

                    // The argument is a service reference
                    if (argument[0] === "@") {
                        var referenceArgument = new _Reference2.default(argument.substr(1));
                        definition.addArgument(referenceArgument);
                        continue;
                    }

                    // The argument is a string
                    definition.addArgument(argument);
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
        }

        // Method calls
        if (Array.isArray(configuration.calls)) {
            _configuration$calls = configuration.calls;

            if (!(_configuration$calls && (typeof _configuration$calls[Symbol.iterator] === 'function' || Array.isArray(_configuration$calls)))) {
                throw new TypeError("Expected _configuration$calls to be iterable, got " + _inspect(_configuration$calls));
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _configuration$calls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _configuration$calls;

                    var call = _step2.value;

                    var methodName = call[0];
                    var methodArguments = call[1] || [];

                    // Convert service reference
                    methodArguments = methodArguments.map(_ref);

                    // Add method call to definition
                    definition.addMethodCall(methodName, methodArguments);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        // Tags
        if (Array.isArray(configuration.tags)) {
            _configuration$tags = configuration.tags;

            if (!(_configuration$tags && (typeof _configuration$tags[Symbol.iterator] === 'function' || Array.isArray(_configuration$tags)))) {
                throw new TypeError("Expected _configuration$tags to be iterable, got " + _inspect(_configuration$tags));
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = _configuration$tags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _configuration$tags;

                    var tag = _step3.value;

                    definition.addTag(tag);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        return definition;
    }
}
exports.default = DefinitionBuilder;

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