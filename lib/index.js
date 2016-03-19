"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBundle = addBundle;
exports.start = start;

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bundles = new Set();

/**
 * Add a bundle to the registry
 *
 * @param   {*}     bundle  - A bundle
 */
function addBundle(bundle) {
  // Check the validity

  // Add to the registry
  bundles.add(bundle);
};

/**
 * Start the application
 */
function start() {};