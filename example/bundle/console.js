"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libSolfege = require("../../lib/solfege");

var _libSolfege2 = _interopRequireDefault(_libSolfege);

var _MyBundle = require("./MyBundle");

var _MyBundle2 = _interopRequireDefault(_MyBundle);

// Initialize the application
var application = new _libSolfege2["default"].kernel.Application(__dirname);

// Add the internal bundle
application.addBundle("myBundle", new _MyBundle2["default"]());

// Override the configuration
var configuration = require(__dirname + "/../config/production.json");
application.overrideConfiguration(configuration);

// Start the application
application.start();