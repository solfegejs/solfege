"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _harmonyReflect = require("harmony-reflect");

var _harmonyReflect2 = _interopRequireDefault(_harmonyReflect);

var _isGenerator = require("is-generator");

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

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
        // Solfege configuration
        this.configuration;

        // Initialize definitions
        this.definitions = new Map();

        // Initialize compilers
        this.compilers = new Set();
        this.compiled = false;
    }

    /**
     * Set the configuration
     *
     * @param   {Configuration}     configuration       Solfege configuration
     */
    setConfiguration(configuration) {
        this.configuration = configuration;
    }

    /**
     * Get the configuration
     *
     * @return  {Configuration}     Solfege configuration
     */
    getConfiguration() {
        return this.configuration;
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

        var definition = this.definitions.get(id);
        _assert2.default.ok(definition instanceof _Definition2.default, "Service definition not found: " + id);

        return definition;
    }

    /**
     * Get service definitions
     *
     * @return  {Map}       Definitions
     */
    getDefinitions() {
        return this.definitions;
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
        // The container is compiled only once
        if (this.compiled) {
            return;
        }

        // Process each compiler pass
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

            // The container is compiled
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

        this.compiled = true;
    }

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    *get(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        // The container must be compiled
        _assert2.default.ok(this.compiled, "Unable to get service \"" + id + "\", the container is not compiled");

        // Get the definition
        var definition = this.getDefinition(id);

        // Get the instance if it exists
        var instance = definition.getInstance();
        if (instance) {
            return instance;
        }

        // Build the instance
        instance = yield this.buildInstance(definition);
        return instance;
    }

    /**
     * Get service class path
     *
     * @param   {String}        id          Service id
     * @return  {String}                    Service class path
     */
    *getServiceClassPath(id) {
        if (!(typeof id === 'string')) {
            throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
        }

        // The container must be compiled
        _assert2.default.ok(this.compiled, "Unable to get service \"" + id + "\", the container is not compiled");

        // Get the definition
        var definition = this.getDefinition(id);

        return yield this.getDefinitionClassPath(definition);
    }

    /**
     * Get definition class path
     *
     * @param   {Definition}    definition  Service definition
     * @return  {String}                    Service class path
     */
    *getDefinitionClassPath(definition) {
        if (!(definition instanceof _Definition2.default)) {
            throw new TypeError("Value of argument \"definition\" violates contract.\n\nExpected:\nDefinition\n\nGot:\n" + _inspect(definition));
        }

        var classPath = definition.getClassPath();

        if (classPath) {
            return classPath;
        }

        var classReference = definition.getClassReference();
        if (classReference instanceof _Reference2.default) {
            var classServiceId = classReference.getId();
            var classDefinition = this.getDefinition(classServiceId);
            classPath = yield this.getDefinitionClassPath(classDefinition);
        }

        return classPath;
    }

    /**
     * Build definition instance
     *
     * @param   {Definition}    definition      Service definition
     * @return  {*}                             Service instance
     */
    *buildInstance(definition) {
        if (!(definition instanceof _Definition2.default)) {
            throw new TypeError("Value of argument \"definition\" violates contract.\n\nExpected:\nDefinition\n\nGot:\n" + _inspect(definition));
        }

        var instance = void 0;
        var instanceArguments = definition.getArguments();

        // Resolve arguments
        var instanceArgumentsResolved = [];

        if (!(instanceArguments && (typeof instanceArguments[Symbol.iterator] === 'function' || Array.isArray(instanceArguments)))) {
            throw new TypeError("Expected instanceArguments to be iterable, got " + _inspect(instanceArguments));
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = instanceArguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var instanceArgument = _step4.value;

                var instanceArgumentResolved = yield this.resolveParameter(instanceArgument);
                instanceArgumentsResolved.push(instanceArgumentResolved);
            }

            // Instantiate with a class
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        var classPath = yield this.getDefinitionClassPath(definition);
        if (typeof classPath === "string") {
            try {
                var classObject = require(classPath);
                instance = _harmonyReflect2.default.construct(classObject, instanceArgumentsResolved);
            } catch (error) {
                throw new Error("Unable to instantiate service \"" + classPath + "\": " + error.message);
            }
        }

        // Instantiate with a factory
        var factoryServiceReference = definition.getFactoryServiceReference();
        if (!instance && factoryServiceReference instanceof _Reference2.default) {
            var factoryServiceId = factoryServiceReference.getId();
            var factoryService = yield this.get(factoryServiceId);
            var factoryMethodName = definition.getFactoryMethodName();
            var factoryMethod = factoryService[factoryMethodName];

            if ((0, _isGenerator.fn)(factoryMethod)) {
                instance = yield factoryMethod.apply(factoryService, instanceArgumentsResolved);
            } else if (typeof factoryMethod === "function") {
                instance = factoryMethod.apply(factoryService, instanceArgumentsResolved);
            } else {
                throw new Error("Factory method must be a function: service " + definition.getId());
            }
        }

        // The instance must be created
        if (!instance) {
            throw new Error("Unable to instantiate service: " + definition.getId());
        }

        // Call methods
        var methodCalls = definition.getMethodCalls();

        if (!(methodCalls && (typeof methodCalls[Symbol.iterator] === 'function' || Array.isArray(methodCalls)))) {
            throw new TypeError("Expected methodCalls to be iterable, got " + _inspect(methodCalls));
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = methodCalls[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var methodCall = _step5.value;
                var name = methodCall.name;
                var parameters = methodCall.parameters;

                var method = instance[name];

                _assert2.default.strictEqual(typeof method === "undefined" ? "undefined" : _typeof(method), "function", "Method \"" + name + "\" not found in " + classPath);

                // Resolve parameters
                var parametersResolved = [];

                if (!(parameters && (typeof parameters[Symbol.iterator] === 'function' || Array.isArray(parameters)))) {
                    throw new TypeError("Expected parameters to be iterable, got " + _inspect(parameters));
                }

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = parameters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var parameter = _step6.value;

                        var parameterResolved = yield this.resolveParameter(parameter);
                        parametersResolved.push(parameterResolved);
                    }

                    // Call the method
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                if ((0, _isGenerator.fn)(method)) {
                    yield method.apply(instance, parametersResolved);
                } else {
                    method.apply(instance, parametersResolved);
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return instance;
    }

    /**
     * Resolve a parameter
     *
     * @param   {*}     parameter   The parameter
     * @return  {*}                 The resolved parameter
     */
    *resolveParameter(parameter) {
        // If the parameter is a service reference, then return the service instance
        if (parameter instanceof _Reference2.default) {
            var serviceId = parameter.getId();
            var service = yield this.get(serviceId);
            return service;
        }

        // The parameter should be a string now
        if (typeof parameter !== "string") {
            return parameter;
        }

        // If the parameter is a service reference in string format, then return the serviec instance
        if (parameter[0] === "@") {
            var _serviceId = parameter.substr(1);
            var _service = yield this.get(_serviceId);
            return _service;
        }

        // Replace configuration properties
        var resolvedParameter = this.configuration.resolvePropertyValue(parameter);

        return resolvedParameter;
    }
}
exports.default = Container;

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