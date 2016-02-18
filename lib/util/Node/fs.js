"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rename = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * @module solfege.util.Node.fs
                                                                                                                                                                                                                                                   */


exports.exists = exists;
exports.stat = stat;
exports.readdir = readdir;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.unlink = unlink;
exports.open = open;
exports.read = read;
exports.write = write;
exports.close = close;

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Function = require("../Function");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if a path exists
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
function exists(filePath) {
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.exists(filePath, function (exists) {
            resolve(exists);
        });
    });
}

var rename = exports.rename = (0, _Function.createPromise)(_fs2.default.rename);

/**
 * Get the stats of a file
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Object}                The stat object
 */
function stat(filePath) {
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.stat(filePath, function (error, stats) {
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
        _fs2.default.readdir(path, function (error, files) {
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
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(filePath, options, function (error, data) {
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
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(filePath, data, options, function (error) {
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
    if (!(typeof path === 'string')) {
        throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.mkdir(path, mode, function (error) {
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
    if (!(typeof path === 'string')) {
        throw new TypeError("Value of argument \"path\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(path));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.rmdir(path, mode, function (error) {
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
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.unlink(filePath, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Open a file
 *
 * @param   {string}    filePath    The file path
 * @param   {string}    flag        The flag
 * @param   {integer}   mode        The mode
 * @return  {integer}               The file descriptor
 */
function open(filePath, flag, mode) {
    if (!(typeof filePath === 'string')) {
        throw new TypeError("Value of argument \"filePath\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(filePath));
    }

    if (!(typeof flag === 'string')) {
        throw new TypeError("Value of argument \"flag\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(flag));
    }

    return new Promise(function (resolve, reject) {
        _fs2.default.open(filePath, flag, mode, function (error, fileDescriptor) {
            if (error) {
                reject(error);
                return;
            }
            resolve(fileDescriptor);
        });
    });
}

/**
 * Read data from an opened file
 *
 * @param   {integer}   fileDescriptor  The file descriptor
 * @param   {Buffer}    buffer          The buffer that the data will be written to
 * @param   {integer}   offset          The offset in the buffer to start writing at
 * @param   {integer}   length          The number of bytes to read
 * @param   {integer}   position        Where to begin reading from in the file
 * @param   {integer}                   The number of bytes read
 */
function read(fileDescriptor, buffer, offset, length, position) {
    return new Promise(function (resolve, reject) {
        _fs2.default.read(fileDescriptor, buffer, offset, length, position, function (error, bytesRead, buffer) {
            if (error) {
                reject(error);
                return;
            }
            resolve(bytesRead);
        });
    });
}

/**
 * Write buffer to an opened file
 *
 * @param   {integer}   fileDescriptor  The file descriptor
 * @param   {Buffer}    buffer          The buffer
 * @param   {integer}   offset          The offset in the buffer
 * @param   {integer}   length          The number of bytes to write
 * @param   {integer}   position        Where to begin writting in the file
 * @param   {integer}                   The number of bytes written
 */
function write(fileDescriptor, buffer, offset, length, position) {
    return new Promise(function (resolve, reject) {
        _fs2.default.write(fileDescriptor, buffer, offset, length, position, function (error, written, buffer) {
            if (error) {
                reject(error);
                return;
            }
            resolve(written);
        });
    });
}

/**
 * Close an opened file
 *
 * @param   {integer}   fileDescriptor  The file descriptor
 */
function close(fileDescriptor) {
    return new Promise(function (resolve, reject) {
        _fs2.default.close(fileDescriptor, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
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