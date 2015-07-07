/**
 * @namespace solfege
 */

// Check the node version
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Check the Generator feature

var _nodeGeneratorDetector = require("node-generator-detector");

var _nodeGeneratorDetector2 = _interopRequireDefault(_nodeGeneratorDetector);

// Create a package

var _packageJson = require("../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

var _utilObjectProxy = require("./util/ObjectProxy");

var currentVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
if (currentVersion < 0.12) {
    console.error("SolfegeJS requires Node version 0.12+");
    process.exit(1);
}

// Check the Proxy feature
if (typeof Proxy === "undefined") {
    console.error("SolfegeJS requires ES6 Proxy");
    process.exit(1);
}
if (!(0, _nodeGeneratorDetector2["default"])()) {
    console.error("SolfegeJS requires ES6 Generator");
    process.exit(1);
}
var getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function toString() {
        return "SolfegeJS " + _packageJson2["default"].version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: _packageJson2["default"].version
};
exports["default"] = (0, _utilObjectProxy.createPackage)(__dirname, getters);
module.exports = exports["default"];