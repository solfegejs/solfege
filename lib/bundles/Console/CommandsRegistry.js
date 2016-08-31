"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ContainerAwareCommand = require("./Command/ContainerAwareCommand");

var _ContainerAwareCommand2 = _interopRequireDefault(_ContainerAwareCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Commands registry
 */
class CommandsRegistry {
    /**
     * Constructor
     *
     * @param   {Container}     container   The service container
     */
    constructor(container) {
        this.container = container;

        // Initialize commands
        this.commands = new Set();
    }

    /**
     * Add command
     *
     * @param   {Object}    command     Command
     */
    addCommand(command) {
        if (command instanceof _ContainerAwareCommand2.default) {
            command.setContainer(this.container);
        }

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
module.exports = exports["default"];