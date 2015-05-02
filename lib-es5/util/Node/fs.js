"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

_Object$defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Check if a path exists
 *
 * @param   {String}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
exports.exists = exists;
exports.stat = stat;
exports.readdir = readdir;
exports.readFile = readFile;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.unlink = unlink;
/**
 * @module solfege.util.Node.fs
 */

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _createThunk = require("../Function");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

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
var stat = _createThunk.createThunk(_fs2["default"].stat);

function stat(_x) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var filePath = _x;
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
var readdir = _createThunk.createThunk(_fs2["default"].readdir);

function readdir(_x2) {
  var _again2 = true;

  _function2: while (_again2) {
    _again2 = false;
    var path = _x2;
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
var readFile = _createThunk.createThunk(_fs2["default"].readFile);

function readFile(_x3, _x4) {
  var _again3 = true;

  _function3: while (_again3) {
    _again3 = false;
    var filePath = _x3,
        options = _x4;
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
module.exports.writeFile = _createThunk.createThunk(_fs2["default"].writeFile);

/**
 * Create a directory
 *
 * @param   {String}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
var mkdir = _createThunk.createThunk(_fs2["default"].mkdir);

function mkdir(_x5) {
  var _again4 = true;

  _function4: while (_again4) {
    _again4 = false;
    var path = _x5;
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
var rmdir = _createThunk.createThunk(_fs2["default"].rmdir);

function rmdir(_x6) {
  var _again5 = true;

  _function5: while (_again5) {
    _again5 = false;
    var path = _x6;
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
var unlink = _createThunk.createThunk(_fs2["default"].unlink);

function unlink(_x7) {
  var _again6 = true;

  _function6: while (_again6) {
    _again6 = false;
    var filePath = _x7;
    _x7 = filePath;
    _again6 = true;
    continue _function6;
  }
}