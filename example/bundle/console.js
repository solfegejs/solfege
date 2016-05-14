"use strict";

var _lib = require("../../lib");

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = _lib2.default.factory();
var parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);