var solfege = require('../../solfege');

/**
 * The command line interface of SolfegeJS
 */
var Console = solfege.util.Class.create(function()
{
}, 'solfege.bundle.console.Console');
var proto = Console.prototype;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.application.on(solfege.kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
    this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
};

/**
 * Executed when the bundles of the application are initialized
 */
proto.onBundlesInitialized = function*()
{
    var bundles = this.application.getBundles();
};

/**
 * Executed when the application starts
 */
proto.onApplicationStart = function*()
{
    // Initialize the charm module
    var charm = require('charm')();
    charm.pipe(process.stdout);

    // Get the parameters
    process.argv.shift();
    process.argv.shift();
    var parameters = process.argv;

    // Display the header
    charm.background('black').foreground('yellow')
        .write('SolfegeJS CLI\n')
        .write('-------------\n');
};

module.exports = Console;
