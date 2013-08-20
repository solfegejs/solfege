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
var server = http.createServer(application.handleRequest);
server.listen(serverPort);
