"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Command registry
 */
class CommandRegistry {
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
exports.default = CommandRegistry;
module.exports = exports['default'];