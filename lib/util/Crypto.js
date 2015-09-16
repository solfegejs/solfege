/**
 * @module solfege.util.Crypto
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFileMd5 = getFileMd5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Function = require("./Function");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

/**
 * Get the MD5 of a file
 *
 * @param   {string}    filePath    The file path
 * @return  {string}                MD5
 */

function getFileMd5(filePath) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        var sum = _crypto2["default"].createHash("md5");

        var stream = _fs2["default"].ReadStream(filePath);
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