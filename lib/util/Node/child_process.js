"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * @module solfege.util.Node.child_process
                                                                                                                                                                                                                                                   */


exports.spawn = spawn;
exports.exec = exec;

var _Function = require("../Function");

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Spawn a command
 *
 * @param   {string}    command     The command
 * @param   {Array}     parameters  The command parameters
 * @return  {string}                The output
 */

function _ref(code) {}

function spawn(command, parameters) {
    if (!(typeof command === 'string')) {
        throw new TypeError("Value of argument \"command\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(command));
    }

    return new Promise(function (resolve, reject) {
        var result = _child_process2.default.spawn(command, parameters);

        result.stdout.on("data", function (data) {
            resolve(data);
        });

        result.stderr.on("data", function (data) {
            reject(data);
        });

        result.on("close", _ref);
    });
}

/**
 * Execute a command
 *
 * @param   {string}    command     The command
 * @return  {string}                The output
 */
function exec(command) {
    if (!(typeof command === 'string')) {
        throw new TypeError("Value of argument \"command\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(command));
    }

    return new Promise(function (resolve, reject) {
        _child_process2.default.exec(command, function (error, stdout, stderr) {
            if (error) {
                reject(error);
                return;
            }

            resolve("" + stdout);
        });
    });
}

function _inspect(input) {
    function _ref3(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref2(item) {
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

            if (input.every(_ref2)) {
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

        var entries = keys.map(_ref3).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}