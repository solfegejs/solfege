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
 * @param   {String}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */

function exists(filePath) {
  // Check parameter
  _assert2["default"].strictEqual(typeof filePath, "string", "The filePath must be a string");

  // Thunk
  return function (done) {
    _fs2["default"].exists(filePath, function (exists) {
      done(null, exists);
    });
  };
}

;

/**
 * Get the stats of a file
 *
 * @param   {String}    filePath    The file path to check
 * @return  {Object}                The stat object
 */
var stat = (0, _Function.createThunk)(_fs2["default"].stat);

function stat(_x) {
  var _again = true;

  _function: while (_again) {
    var filePath = _x;
    _again = false;
    _x = filePath;
    _again = true;
    continue _function;
  }
}

/**
 * Reads the contents of a directory
 *
 * @param   {String}    path        The directory path
 * @return  {String[]}              The files in the directory
 */
var readdir = (0, _Function.createThunk)(_fs2["default"].readdir);

function readdir(_x2) {
  var _again2 = true;

  _function2: while (_again2) {
    var path = _x2;
    _again2 = false;
    _x2 = path;
    _again2 = true;
    continue _function2;
  }
}

/**
 * Read a file
 *
 * @param   {String}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {String}                The file content
 */
var readFile = (0, _Function.createThunk)(_fs2["default"].readFile);

function readFile(_x3, _x4) {
  var _again3 = true;

  _function3: while (_again3) {
    var filePath = _x3,
        options = _x4;
    _again3 = false;
    _x3 = filePath;
    _x4 = options;
    _again3 = true;
    continue _function3;
  }
}

/**
 * Write data to a file
 *
 * @param   {String}        filePath    The file path
 * @param   {String|Buffer} data        The data
 * @param   {Object}        options     The options
 */
module.exports.writeFile = (0, _Function.createThunk)(_fs2["default"].writeFile);

/**
 * Create a directory
 *
 * @param   {String}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
var mkdir = (0, _Function.createThunk)(_fs2["default"].mkdir);

function mkdir(_x5) {
  var _again4 = true;

  _function4: while (_again4) {
    var path = _x5;
    _again4 = false;
    _x5 = path;
    _again4 = true;
    continue _function4;
  }
}

/**
 * Delete a directory
 *
 * @param   {String}    path    The directory path
 */
var rmdir = (0, _Function.createThunk)(_fs2["default"].rmdir);

function rmdir(_x6) {
  var _again5 = true;

  _function5: while (_again5) {
    var path = _x6;
    _again5 = false;
    _x6 = path;
    _again5 = true;
    continue _function5;
  }
}

/**
 * Delete a file
 *
 * @param   {String}    filePath    The file path
 */
var unlink = (0, _Function.createThunk)(_fs2["default"].unlink);

function unlink(_x7) {
  var _again6 = true;

  _function6: while (_again6) {
    var filePath = _x7;
    _again6 = false;
    _x7 = filePath;
    _again6 = true;
    continue _function6;
  }
}