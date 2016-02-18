"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * @module solfege.util.Crypto
                                                                                                                                                                                                                                                   */


exports.getFileMd5 = getFileMd5;

var _Function = require("./Function");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the MD5 of a file
 *
 * @param   {string}    filePath    The file path
 * @return  {string}                MD5
 */
function getFileMd5(filePath) {
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        var sum = _crypto2.default.createHash("md5");

        var stream = _fs2.default.ReadStream(filePath);
        stream.on("data", function (data) {
            sum.update(data);
        });
        stream.on("error", function (error) {
            reject(error);
        });
        stream.on("end", function () {
            var hash = sum.digest("hex");
            resolve(hash);
        });
    });
}

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