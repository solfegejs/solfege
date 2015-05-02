

// Create a package
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _description = require('../package.json');

var _description2 = _interopRequireDefault(_description);

var _createPackage = require('./util/ObjectProxy');

/**
 * @namespace solfege
 */

// Check the node version
var currentVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
if (currentVersion < 0.11) {
    console.error('SolfegeJS requires Node version 0.11+');
    process.exit(1);
}

// Check Harmony
if (typeof Proxy === 'undefined') {
    console.error('SolfegeJS requires ES6 Proxy');
    process.exit(1);
}
var getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function toString() {
        return 'SolfegeJS ' + _description2['default'].version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: _description2['default'].version
};
var solfege = _createPackage.createPackage(__dirname, getters);

module.exports = solfege;