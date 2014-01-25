var solfege = require('../../solfege');
var http = require('http');

/**
 * A simple HTTP server
 */
var HttpServer = solfege.util.Class.create(function()
{
    // Set the default configuration
    this.configuration = require('./configuration');

    // By default, the server is not started
    this.isStarted = false;

}, 'solfege.bundle.server.HttpServer');
var proto = HttpServer.prototype;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * Indicates that the server is started
 *
 * @type {Boolean}
 * @api private
 */
proto.isStarted;

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
    this.application.on(solfege.kernel.Application.EVENT_END, bindGenerator(this, this.onApplicationEnd));
};

/**
 * Get the configuration
 *
 * @return  {Object}    The configuration
 */
proto.getConfiguration = function()
{
    return this.configuration;
};

/**
 * Start the server
 *
 * @api public
 */
proto.start = function*()
{
    var port = this.configuration.port;

    // Create the server
    var server = http.createServer(function(request, response)
    {
        console.log('request');
    });

    this.isStarted = true;
    console.log('SolfegeJS HTTP server started on port ' + port);
    server.listen.apply(server, [port]);
};

/**
 * Executed when the application ends
 */
proto.onApplicationEnd = function*()
{
    if (this.isStarted) {
        console.log('SolfegeJS HTTP server stopped');
    }
};

module.exports = HttpServer;
