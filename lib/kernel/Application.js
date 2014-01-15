var solfege = require('../solfege');


/**
 * The main class of the SolfegeJS application
 *
 * @param   {String}    root        Root directory of the application
 */
var Application = function *(root)
{
    // Set general properties
    this.bundles        = [];
    this.rootDirectory  = root;

    // Error handler
    process.on('uncaughtException', this.onErrorUnknown.bind(this));

    // Check if the root directory exists
    var fs = solfege.util.Node.fs;
    var rootDirectoryExists = yield fs.exists(this.rootDirectory);
    console.log('a: ' + this.rootDirectory);
    console.log('b: ' + rootDirectoryExists);
    if (!rootDirectoryExists) {
        throw new Error('The root directory of the application does not exist');
    } else {
        console.log('The root directory exists');
    }

    return this;
};
proto = Application.prototype;

/**
 * The root directory of the application
 *
 * @property rootDirectory
 * @type {String}
 * @private
 */
proto.rootDirectory = null;

/**
 * Registred bundles
 *
 * @property bundles
 * @type {Array}
 * @private
 */
proto.bundles = null;
/**
 * Configuration
 *
 * @property configuration
 * @type {Object}
 * @private
 */
proto.configuration = null;

/**
 * Get the representation string
 *
 * @return  {String}    The representation string
 * @public
 */
proto.toString = function()
{
    return '[solfeje.kernel.Application]';
};

/**
 * An unknown error occurred
 *
 * @param   {Object}    error           Error instance
 * @private
 */
proto.onErrorUnknown = function(error)
{
    // @todo Use a log manager
    console.error(error.message);
};


module.exports = Application;
