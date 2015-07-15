/**
 * @module solfege.util.Node.fs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exists;
exports.stat = stat;
exports.readdir = readdir;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.unlink = unlink;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Function = require("../Function");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

/**
 * Check if a path exists
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */

function exists(filePath) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].exists(filePath, function (exists) {
            resolve(exists);
        });
    });
}

/**
 * Get the stats of a file
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Object}                The stat object
 */

function stat(filePath) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].stat(filePath, function (error, stats) {
            if (error) {
                reject(error);
                return;
            }
            resolve(stats);
        });
    });
}

/**
 * Reads the contents of a directory
 *
 * @param   {string}    path        The directory path
 * @return  {string[]}              The files in the directory
 */

function readdir(path) {
    return new Promise(function (resolve, reject) {
        _fs2["default"].readdir(path, function (error, files) {
            if (error) {
                reject(error);
                return;
            }
            resolve(files);
        });
    });
}

/**
 * Read a file
 *
 * @param   {string}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {string}                The file content
 */

function readFile(filePath, options) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].readFile(filePath, options, function (error, data) {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });
}

/**
 * Write data to a file
 *
 * @param   {string}        filePath    The file path
 * @param   {string|Buffer} data        The data
 * @param   {Object}        options     The options
 */

function writeFile(filePath, data, options) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].writeFile(filePath, data, options, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Create a directory
 *
 * @param   {string}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */

function mkdir(path, mode) {
    if (typeof path !== "string") throw new TypeError("Value of argument 'path' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].mkdir(path, mode, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Delete a directory
 *
 * @param   {string}    path    The directory path
 */

function rmdir(path) {
    if (typeof path !== "string") throw new TypeError("Value of argument 'path' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].rmdir(path, mode, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Delete a file
 *
 * @param   {string}    filePath    The file path
 */

function unlink(filePath) {
    if (typeof filePath !== "string") throw new TypeError("Value of argument 'filePath' violates contract.");

    return new Promise(function (resolve, reject) {
        _fs2["default"].unlink(filePath, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}