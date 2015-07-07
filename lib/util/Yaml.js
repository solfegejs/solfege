/**
 * Utils for YAML files
 *
 * @module solfege.util.Yaml
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = load;
exports.loadSync = loadSync;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _NodeFs = require("./Node/fs");

var _NodeFs2 = _interopRequireDefault(_NodeFs);

var _jsYaml = require("js-yaml");

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _yamlInclude = require("yaml-include");

var _yamlInclude2 = _interopRequireDefault(_yamlInclude);

/**
 * Load a YAML file
 *
 * @param   {String}    path     The file path
 * @return  {Object}             The decoded content
 */

function* load(path) {
    // Check parameters
    _assert2["default"].strictEqual(typeof path, "string", "The path must be a string");

    // Get the file content and decode
    var content = yield _NodeFs2["default"].readFile(path, { encoding: "utf8" });
    var decoded = _jsYaml2["default"].safeLoad(content, {
        schema: _yamlInclude2["default"].YAML_INCLUDE_SCHEMA
    });

    return decoded;
}

/**
 * Load a YAML file synchronously
 *
 * @param   {String}    path     The file path
 * @return  {Object}             The decoded content
 */

function loadSync(path) {
    // Check parameters
    _assert2["default"].strictEqual(typeof path, "string", "The path must be a string");

    // Get the file content and decode
    var content = _fs2["default"].readFileSync(path, { encoding: "utf8" });
    var decoded = _jsYaml2["default"].safeLoad(content, {
        schema: _yamlInclude2["default"].YAML_INCLUDE_SCHEMA
    });

    return decoded;
}