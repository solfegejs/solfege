"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
   */
  constructor(foo) {
    super();

    this.foo = foo;
  }

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
    console.log(this.foo);
  }
}
exports.default = ConfigurationCommand;
module.exports = exports['default'];