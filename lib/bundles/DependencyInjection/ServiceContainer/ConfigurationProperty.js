"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Configuration property
 */
class ConfigurationProperty {
  /**
   * Constructor
   *
   * @param   {string}    name    Property name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Get property name
   *
   * @return  {string}            Property name
   */
  getName() {
    return this.name;
  }
}
exports.default = ConfigurationProperty;
module.exports = exports['default'];