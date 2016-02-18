"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeGeneratorDetector = require("node-generator-detector");

var _nodeGeneratorDetector2 = _interopRequireDefault(_nodeGeneratorDetector);

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _ObjectProxy = require("./util/ObjectProxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Check the Generator feature

if (!(0, _nodeGeneratorDetector2.default)()) {
    console.error("SolfegeJS requires ES6 Generator");
    process.exit(1);
}

// Create a package

var getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function toString() {
        return 'SolfegeJS ' + _package2.default.version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: _package2.default.version
};
exports.default = (0, _ObjectProxy.createPackage)(__dirname, getters);
module.exports = exports['default'];