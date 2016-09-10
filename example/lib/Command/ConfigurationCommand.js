"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ContainerAwareCommand = require("../../../lib/bundles/Console/Command/ContainerAwareCommand");

var _ContainerAwareCommand2 = _interopRequireDefault(_ContainerAwareCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Configuration command
 */
class ConfigurationCommand extends _ContainerAwareCommand2.default {
    /**
     * Constructor
     * 
     * @param   {string}    foo     Foo property
     * @param   {uint32}    port    Port property
     * @param   {object}    routing Routing property
     */
    constructor(foo, port, routing, configuration, toc) {
        if (!(typeof foo === 'string')) {
            throw new TypeError("Value of argument \"foo\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(foo));
        }

        if (!(typeof port === 'number' && !isNaN(port) && port >= 0 && port <= 4294967295 && port === Math.floor(port))) {
            throw new TypeError("Value of argument \"port\" violates contract.\n\nExpected:\nuint32\n\nGot:\n" + _inspect(port));
        }

        super();

        this.foo = foo;
        this.port = port;
        this.routing = routing;
        this.configuration = configuration;
        this.toc = toc;
    }

    addSomething(config, foo) {}
    //console.log(config, foo);


    /**
     * Configure command
     */
    *configure() {
        this.setName("example:configuration");
        this.setDescription("Display some configuration properties");
    }

    /**
     * Execute the command
     */
    *execute() {
        console.log("foo:", this.foo);
        console.log("port:", this.port);
        console.log("route controller:", this.routing.a.b.c.route_2.controller);
        console.log("foo from configuration service:", this.configuration.get("parameters.foo"));
        console.log("toc", this.toc);
    }
}
exports.default = ConfigurationCommand;

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