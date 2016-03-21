"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _Application = require("./kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _ServiceContainer = require("./bundles/ServiceContainer");

var _ServiceContainer2 = _interopRequireDefault(_ServiceContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = new _Application2.default();
application.addBundle(new _ServiceContainer2.default());

exports.default = application;
module.exports = exports['default'];