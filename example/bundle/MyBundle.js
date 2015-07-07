"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _libSolfege = require("../../lib/solfege");

var _libSolfege2 = _interopRequireDefault(_libSolfege);

var MyBundle = (function () {
    function MyBundle() {
        _classCallCheck(this, MyBundle);

        this.woot = "W00t";
    }

    _createClass(MyBundle, [{
        key: "setApplication",
        value: function* setApplication(application) {
            var bindGenerator = _libSolfege2["default"].util.Function.bindGenerator;
            this.application = application;
            this.application.on(_libSolfege2["default"].kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
        }
    }, {
        key: "onApplicationStart",
        value: function* onApplicationStart() {
            console.log(this.woot, "SolfegeJS", _libSolfege2["default"].version);
            console.log("configuration.foo =", this.application.configuration.parameters.foo);
        }
    }]);

    return MyBundle;
})();

exports["default"] = MyBundle;
module.exports = exports["default"];