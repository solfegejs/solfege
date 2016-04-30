"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
        this.class;
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
    setClass(path) {
        if (!(typeof path === 'string')) {
            throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
        }

        this.class = path;
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