"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Service definition
 */
class Definition {
  /**
   * Constructor
   *
   * @param   {String}    id      Service id
   */
  constructor(id) {
    if (!(typeof id === 'string')) {
      throw new TypeError("Value of argument \"id\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(id));
    }

    // Initialize properties
    this.id = id;
    this.instance;
  }

  /**
   * Get service id
   *
   * @return  {String}            Service id
   */
  getId() {
    return this.id;
  }

  /**
   * Set the instance
   *
   * @param   {*}     service     Service instance
   */
  setInstance(service) {
    this.instance = service;
  }

  /**
   * Get the instance
   *
   * @return  {*}                 Service instance
   */
  getInstance() {
    return this.instance;
  }
}
exports.default = Definition;

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