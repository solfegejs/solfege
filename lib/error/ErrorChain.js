/**
 * A chained error
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var ErrorChain = (function (_Error) {
  /**
   * Constructor
   *
   * @param   {Error}  previousError  The previous error
   * @param   {string} message        The message
   */

  function ErrorChain(previousError, message) {
    _classCallCheck(this, ErrorChain);

    if (!(previousError instanceof Error)) throw new TypeError("Value of argument 'previousError' violates contract.");
    if (typeof message !== "string") throw new TypeError("Value of argument 'message' violates contract.");

    _get(Object.getPrototypeOf(ErrorChain.prototype), "constructor", this).call(this, message);

    this.name = "ErrorChain";
    this.currentMessage = message;
    this.capturedStack = {};
    Error.captureStackTrace(this.capturedStack, ErrorChain);

    this.previousError = previousError;
    this.previousMessage = previousError.message;
    this.previousStack = previousError.stack;
  }

  _inherits(ErrorChain, _Error);

  _createClass(ErrorChain, [{
    key: "message",

    /**
     * The chained message
     *
     * @return  {string}    The message
     */
    get: function get() {
      return this.currentMessage + " > " + this.previousMessage;
    }
  }, {
    key: "stack",

    /**
     * The chained stack
     *
     * @return  {string}    The stack
     */
    get: function get() {
      var stack = "-".repeat(50) + "\n";
      stack += this.capturedStack.stack + "\n";
      stack += "-".repeat(50) + "\n";
      stack += this.previousStack + "\n";
      return stack;
    }
  }]);

  return ErrorChain;
})(Error);

exports["default"] = ErrorChain;
module.exports = exports["default"];