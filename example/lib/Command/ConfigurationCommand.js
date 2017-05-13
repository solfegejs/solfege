"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _ContainerAwareCommand = require("solfegejs-cli/lib/Command/ContainerAwareCommand");

var _ContainerAwareCommand2 = _interopRequireDefault(_ContainerAwareCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfigurationCommand = class ConfigurationCommand extends _ContainerAwareCommand2.default {
    constructor(foo, port, routing, configuration, toc) {
        super();

        this.foo = foo;
        this.port = port;
        this.routing = routing;
        this.configuration = configuration;
        this.toc = toc;
    }

    addSomething(config, foo) {}

    *configure() {
        this.setName("example:configuration");
        this.setDescription("Display some configuration properties");
    }

    *execute() {
        console.log("foo:", this.foo);
        console.log("port:", this.port);
        console.log("route controller:", this.routing.a.b.c.route_2.controller);
        console.log("foo from configuration service:", this.configuration.get("parameters.foo"));
        console.log("toc", this.toc);
    }
};
exports.default = ConfigurationCommand;
module.exports = exports["default"];