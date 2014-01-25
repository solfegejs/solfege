var solfege = require('../../solfege');
var http = require('http');

/**
 * A simple HTTP server
 */
var HttpServer = solfege.util.Class.create(function()
{
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
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    this.application.on(solfege.kernel.Application.EVENT_START, this.onApplicationStart);
};

/**
 * Listener of the application start event
 */
proto.onApplicationStart = function*()
{
    // Create the server
    var server = http.createServer(function(request, response)
    {
        console.log('request');
    });

    //console.log('SolfegeJS HTTP server started');
    //server.listen.apply(server, [1337]);
};

module.exports = HttpServer;
