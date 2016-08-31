"use strict";

var _lib = require("../../lib");

var _lib2 = _interopRequireDefault(_lib);

var _Bundle = require("./Bundle");

var _Bundle2 = _interopRequireDefault(_Bundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create application instance
var application = _lib2.default.factory();
application.addBundle(new _Bundle2.default());

// Load configuration file
application.loadConfiguration(__dirname + "/config/production.yml");

// Start the application
var parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);