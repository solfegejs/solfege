"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _Application = require("./kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _Bundle = require("./bundles/DependencyInjection/Bundle");

var _Bundle2 = _interopRequireDefault(_Bundle);

var _solfegejsCli = require("solfegejs-cli");

var _solfegejsCli2 = _interopRequireDefault(_solfegejsCli);

var _Bundle3 = require("./bundles/Configuration/Bundle");

var _Bundle4 = _interopRequireDefault(_Bundle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    // Solfege name
    name: "SolfegeJS",

    // Solfege version
    version: _package2.default.version,

    // Application class
    // Use it to instanciate a new application
    Application: _Application2.default,

    // Application factory
    // Use it to instanciate a new application with default bundles
    factory: function factory() {
        var bundles = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        if (!Array.isArray(bundles)) {
            throw new TypeError("Value of argument \"bundles\" violates contract.\n\nExpected:\nArray\n\nGot:\n" + _inspect(bundles));
        }

        var application = new _Application2.default();
        application.addBundle(new _Bundle2.default());
        application.addBundle(new _solfegejsCli2.default());
        application.addBundle(new _Bundle4.default());

        if (!(bundles && (typeof bundles[Symbol.iterator] === 'function' || Array.isArray(bundles)))) {
            throw new TypeError("Expected bundles to be iterable, got " + _inspect(bundles));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var bundle = _step.value;

                application.addBundle(bundle);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return application;
    }
};

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}

module.exports = exports["default"];