"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Service reference
 */
class Reference {
  /**
   * Constructor
   *
   * @param   {String}    id  Service id
   */
  constructor(id) {
    this.id = id;
  }

  /**
   * Get service id
   *
   * @return  {String}        Service id
   */
  getId() {
    return this.id;
  }
}
exports.default = Reference;
module.exports = exports["default"];