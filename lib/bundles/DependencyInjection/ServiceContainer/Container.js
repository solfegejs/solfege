"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Definition = require("./Definition");

var _Definition2 = _interopRequireDefault(_Definition);

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service container
 */
class Container {
    /**
     * Constructor
     */
    constructor() {
        // Initialize definitions
        this.definitions = new Map();

        // Initialize compilers
        this.compilers = new Set();
    }

    /**
     * Set a service definition
     *
     * @param   {String}        id              Service id
     * @param   {Definition}    definition      Service definition
     */
    setDefinition(id, definition) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        this.definitions.set(id, definition);
    }

    /**
     * Get a service definition
     *
     * @param   {String}        id              Service id
     * @return  {Definition}                    Service definition
     */
    getDefinition(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        return this.definitions.get(id);
    }

    /**
     * Register an instantiated service
     *
     * @param   {String}        id          Service id
     * @param   {*}             service     Service instance
     * @return  {Definition}                Serice definition
     */
    register(id, service) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        var definition = new _Definition2.default(id);
        definition.setInstance(service);

        this.definitions.set(id, definition);

        return definition;
    }

    /**
     * Get service reference
     *
     * @param   {String}    id      Service id
     * @return  {Reference}         Service reference
     */
    getReference(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        var reference = new _Reference2.default(id);

        return reference;
    }

    /**
     * Add a compiler pass
     *
     * @param   {Object}    compiler    Compiler pass
     */
    addCompilerPass(compiler) {
        _assert2.default.strictEqual(_typeof(compiler.process), 'function');
        _assert2.default.strictEqual(compiler.process.constructor.name, 'GeneratorFunction');

        this.compilers.add(compiler);
    }

    /**
     * Find services ids tagged the specified name
     *
     * @param   {String}    tagName     Tag name
     * @return  {Array}                 Service ids
     */
    findTaggedServiceIds(tagName) {
        if (!(typeof tagName === 'string')) {
            throw new TypeError("Value of argument \"tagName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(tagName));
        }

        var ids = [];

        _definitions$entries = this.definitions.entries();

        if (!(_definitions$entries && (typeof _definitions$entries[Symbol.iterator] === 'function' || Array.isArray(_definitions$entries)))) {
            throw new TypeError("Expected _definitions$entries to be iterable, got " + _inspect(_definitions$entries));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _definitions$entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _definitions$entries;

                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var serviceId = _ref2[0];
                var definition = _ref2[1];

                var tags = definition.getTags();
                var tagFound = false;

                if (!(tags && (typeof tags[Symbol.iterator] === 'function' || Array.isArray(tags)))) {
                    throw new TypeError("Expected tags to be iterable, got " + _inspect(tags));
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var tag = _step2.value;

                        if (tag.name && tag.name === tagName) {
                            tagFound = true;
                            break;
                        }
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

                if (tagFound) {
                    ids.push(serviceId);
                }
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

        return ids;
    }

    /**
     * Compile
     */
    *compile() {
        _compilers = this.compilers;

        if (!(_compilers && (typeof _compilers[Symbol.iterator] === 'function' || Array.isArray(_compilers)))) {
            throw new TypeError("Expected _compilers to be iterable, got " + _inspect(_compilers));
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = _compilers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _compilers;

                var compiler = _step3.value;

                yield compiler.process(this);
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

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    get(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        var definition = this.getDefinition(id);
        var instance = definition.getInstance();

        if (instance) {
            return instance;
        }

        throw new Error("Service " + id + " not found");
    }
}
exports.default = Container;

function _inspect(input) {
    function _ref4(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref3(item) {
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

            if (input.every(_ref3)) {
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

        var entries = keys.map(_ref4).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];