"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * A chained error
 */
class ErrorChain extends Error {
  /**
   * Constructor
   *
   * @param   {Error}  previousError  The previous error
   * @param   {string} message        The message
   */
  constructor(previousError, message) {
    if (!(previousError instanceof Error)) {
      throw new TypeError("Value of argument \"previousError\" violates contract.\n\nExpected:\nError\n\nGot:\n" + _inspect(previousError));
    }

    if (!(typeof message === 'string')) {
      throw new TypeError("Value of argument \"message\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(message));
    }

    super(message);

    this.name = "ErrorChain";
    this.currentMessage = message;
    this.capturedStack = {};
    Error.captureStackTrace(this.capturedStack, ErrorChain);

    this.previousError = previousError;
    this.previousMessage = previousError.message;
    this.previousStack = previousError.stack;
  }

  /**
   * The chained message
   *
   * @return  {string}    The message
   */
  get message() {
    return this.currentMessage + " > " + this.previousMessage;
  }

  /**
   * The chained stack
   *
   * @return  {string}    The stack
   */
  get stack() {
    var stack = "-".repeat(50) + "\n";
    stack += this.capturedStack.stack + "\n";
    stack += "-".repeat(50) + "\n";
    stack += this.previousStack + "\n";
    return stack;
  }
}
exports.default = ErrorChain;

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