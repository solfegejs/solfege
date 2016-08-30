"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Definition = require("./Definition");

var _Definition2 = _interopRequireDefault(_Definition);

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

var _ConfigurationProperty = require("./ConfigurationProperty");

var _ConfigurationProperty2 = _interopRequireDefault(_ConfigurationProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Definition builder
 */
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

        // Class arguments
        if (configuration.arguments) {
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

                    // The argument is a configuration property
                    if (argument[0] === "%") {
                        var configurationArgument = new _ConfigurationProperty2.default(argument.substr(1));
                        definition.addArgument(configurationArgument);
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

        // Tags
        if (Array.isArray(configuration.tags)) {
            _configuration$tags = configuration.tags;

            if (!(_configuration$tags && (typeof _configuration$tags[Symbol.iterator] === 'function' || Array.isArray(_configuration$tags)))) {
                throw new TypeError("Expected _configuration$tags to be iterable, got " + _inspect(_configuration$tags));
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _configuration$tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _configuration$tags;

                    var tag = _step2.value;

                    definition.addTag(tag);
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

        return definition;
    }
}
exports.default = DefinitionBuilder;

function _inspect(input) {
    function _ref2(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref)) {
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

        var entries = keys.map(_ref2).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];