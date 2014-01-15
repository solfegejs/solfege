var description = require('../package.json');
var ObjectProxy = require('./util/ObjectProxy');

var getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function () {
        return 'Solfege ' + description.version;
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
