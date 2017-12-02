"use strict";

var _lib = require("../../lib");

var _lib2 = _interopRequireDefault(_lib);

var _Bundle = require("./Bundle");

var _Bundle2 = _interopRequireDefault(_Bundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = _lib2.default.factory();
application.addBundle(new _Bundle2.default());

application.addConfigurationProperties({
    a: 42,
    z: "d",
    parameters: {
        foo: "%z%essert"
    }
});

var parameters = process.argv.slice(2);
application.start(parameters);