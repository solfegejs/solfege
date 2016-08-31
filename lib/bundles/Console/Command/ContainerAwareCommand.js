"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractCommand = require("./AbstractCommand");

var _AbstractCommand2 = _interopRequireDefault(_AbstractCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A container aware command
 */
class ContainerAwareCommand extends _AbstractCommand2.default {
  /**
   * Set the service container
   *
   * @param   {Container}     container   Service container
   */
  setContainer(container) {
    this.container = container;
  }

  /**
   * Get the service container
   *
   * @return  {Container}                 Service container
   */
  getContainer() {
    return this.container;
  }
}
exports.default = ContainerAwareCommand;
module.exports = exports["default"];