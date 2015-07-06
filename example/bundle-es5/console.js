"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _solfege = require("../../lib-es5/solfege");

var _solfege2 = _interopRequireDefault(_solfege);

var _MyBundle = require("./MyBundle");

var _MyBundle2 = _interopRequireDefault(_MyBundle);

// Initialize the application
var application = new _solfege2["default"].kernel.Application(__dirname);

// Add the internal bundle
application.addBundle("myBundle", new _MyBundle2["default"]());

// Start the application
application.start();