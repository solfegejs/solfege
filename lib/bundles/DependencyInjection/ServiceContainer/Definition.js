"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service definition
 */
class Definition {
    /**
     * Constructor
     *
     * @param   {String}    id      Service id
     */
    constructor(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        // Initialize properties
        this.id = id;
        this.instance;
        this.classPath;
        this.classReference;
        this.factoryServiceReference;
        this.factoryMethodName;
        this.arguments = new Set();
        this.tags = new Set();
        this.methodCalls = new Set();
    }

    /**
     * Get service id
     *
     * @return  {String}            Service id
     */
    getId() {
        return this.id;
    }

    /**
     * Set the instance
     *
     * @param   {*}     service     Service instance
     */
    setInstance(service) {
        this.instance = service;
    }

    /**
     * Get the instance
     *
     * @return  {*}                 Service instance
     */
    getInstance() {
        return this.instance;
    }

    /**
     * Set class path
     *
     * @param   {String}    path    Class path
     */
    setClassPath(path) {
        if (!(typeof path === 'string')) {
            throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
        }

        this.classPath = path;
    }

    /**
     * Get class path
     *
     * @return  {String}            Class path
     */
    getClassPath() {
        return this.classPath;
    }

    /**
     * Set class reference
     *
     * @param   {Reference}     reference       Class reference
     */
    setClassReference(reference) {
        if (!(reference instanceof _Reference2.default)) {
            throw new TypeError("Value of argument \"reference\" violates contract.\n\nExpected:\nReference\n\nGot:\n" + _inspect(reference));
        }

        this.classReference = reference;
    }

    /**
     * Get class reference
     *
     * @return  {Reference}                     Class reference
     */
    getClassReference() {
        return this.classReference;
    }

    /**
     * Set factory method
     *
     * @param   {Reference}     serviceReference    Service reference
     * @param   {string}        methodName          Method name
     */
    setFactory(serviceReference, methodName) {
        if (!(serviceReference instanceof _Reference2.default)) {
            throw new TypeError("Value of argument \"serviceReference\" violates contract.\n\nExpected:\nReference\n\nGot:\n" + _inspect(serviceReference));
        }

        if (!(typeof methodName === 'string')) {
            throw new TypeError("Value of argument \"methodName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(methodName));
        }

        this.factoryServiceReference = serviceReference;
        this.factoryMethodName = methodName;
    }

    /**
     * Get factory service reference
     *
     * @return  {Reference}     Service reference
     */
    getFactoryServiceReference() {
        return this.factoryServiceReference;
    }

    /**
     * Get factory method name
     *
     * @return  {string}        Method name
     */
    getFactoryMethodName() {
        return this.factoryMethodName;
    }

    /**
     * Add constructor argument
     *
     * @param   {*}     argument    Class constructor argument
     */
    addArgument(argument) {
        this.arguments.add(argument);
    }

    /**
     * Get constructor arguments
     *
     * @return  {Set}               Class constructor arguments
     */
    getArguments() {
        return this.arguments;
    }

    /**
     * Add tag
     *
     * @param   {Object}    tag     Tag
     */
    addTag(tag) {
        this.tags.add(tag);
    }

    /**
     * Get tags
     *
     * @return  {Set}               Tags
     */
    getTags() {
        return this.tags;
    }

    /**
     * Add a method call
     *
     * @param   {String}    name        Method name
     * @param   {Array}     parameters  Method parameters
     */
    addMethodCall(name) {
        var parameters = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        if (!Array.isArray(parameters)) {
            throw new TypeError("Value of argument \"parameters\" violates contract.\n\nExpected:\nArray\n\nGot:\n" + _inspect(parameters));
        }

        this.methodCalls.add({
            name: name,
            parameters: parameters
        });
    }

    /**
     * Get method calls
     *
     * @return  {Set}                   Method calls
     */
    getMethodCalls() {
        return this.methodCalls;
    }
}
exports.default = Definition;

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