"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An application
 */

function _ref() {
    console.log('ok');
}

function _ref2(error) {
    console.error(error.message);
    console.error(error.stack);
}

class Application {
    /**
     * Constructor
     */
    constructor() {
        // Initilize the bundle registry
        this.bundles = new Set();
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {*}     bundle  - A bundle
     */
    addBundle(bundle) {
        // Check the validity

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Start the application
     */
    start() {
        var self = this;

        // Start the generator based flow
        (0, _co2.default)(_ref)

        // Handle error
        .catch(_ref2);
    }
}
exports.default = Application;
module.exports = exports['default'];