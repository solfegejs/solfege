"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Commands registry
 */
class CommandsRegistry {
  /**
   * Constructor
   */
  constructor() {
    // Initialize commands
    this.commands = new Set();
  }

  /**
   * Add command
   *
   * @param   {Object}    command     Command
   */
  addCommand(command) {
    this.commands.add(command);
  }

  /**
   * Get commands
   *
   * @return  {Set}                   Commands
   */
  getCommands() {
    return this.commands;
  }
}
exports.default = CommandsRegistry;
module.exports = exports['default'];