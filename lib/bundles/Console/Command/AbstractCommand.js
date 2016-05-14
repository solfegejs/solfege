"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * An abstract command
 */
class AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    // Initialize properties
    this.name = null;
    this.description = "";
  }

  /**
   * Get command name
   *
   * @return  {string}    Command name
   */
  getName() {
    return this.name;
  }

  /**
   * Set command name
   *
   * @param   {string}    name    Command name
   */
  setName(name) {
    if (!(typeof name === 'string')) {
      throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
    }

    this.name = name;
  }

  /**
   * Get command description
   *
   * @return  {string}    Command description
   */
  getDescription() {
    return this.description;
  }

  /**
   * Set command description
   *
   * @param   {string}    description     Command description
   */
  setDescription(description) {
    if (!(typeof description === 'string')) {
      throw new TypeError("Value of argument \"description\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(description));
    }

    this.description = description;
  }

  /**
   * Condigure command
   */
  *configure() {}

  /**
   * Execute the command
   */
  *execute() {}
}
exports.default = AbstractCommand;

function _inspect(input) {
  function _ref2(key) {
    return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
  }

  function _ref(item) {
    return _inspect(item) === first;
  }

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === "undefined" ? "undefined" : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var first = _inspect(input[0]);

      if (input.every(_ref)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.map(_inspect).join(', ') + ']';
      }
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

    var entries = keys.map(_ref2).join('\n  ');

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + entries + '\n}';
    } else {
      return '{ ' + entries + '\n}';
    }
  }
}

module.exports = exports['default'];