"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// Check the Generator feature

var _generatorDetector = require("node-generator-detector");

var _generatorDetector2 = _interopRequireDefault(_generatorDetector);

// Create a package

var _description = require("../package.json");

var _description2 = _interopRequireDefault(_description);

var _createPackage = require("./util/ObjectProxy");

/**
 * @namespace solfege
 */

// Check the node version
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
if (!_generatorDetector2["default"]()) {
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
        return "SolfegeJS " + _description2["default"].version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: _description2["default"].version
};
exports["default"] = _createPackage.createPackage(__dirname, getters);
module.exports = exports["default"];