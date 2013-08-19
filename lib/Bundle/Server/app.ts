var http = require('http');
var Application = require('../../Component/Kernel/Application');


// Initialize the application
var rootDirectory = process.argv[2];
var application = new Application(rootDirectory);
application.loadConfiguration(rootDirectory + '/config');

// Get the configuration
var configuration = application.getConfiguration();

// Start the web server
var serverPort = configuration.server.port;
var server = http.createServer(function(request, response)
{
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("plop");
});
server.listen(serverPort);
