// Check the node version
var currentVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
if (currentVersion < 0.11) {
    console.error('SolfegeJS requires Node version 0.11+');
    process.exit(1);
}

// Check Harmony
if (typeof Proxy === 'undefined') {
    console.error('SolfegeJS requires Node Harmony');
    process.exit(1);
}


// Create a package
var description = require('../package.json');
var ObjectProxy = require('./util/ObjectProxy');
var getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function () {
        return 'SolfegeJS ' + description.version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: description.version
};
var solfege = ObjectProxy.createPackage(__dirname, getters);

module.exports = solfege;
