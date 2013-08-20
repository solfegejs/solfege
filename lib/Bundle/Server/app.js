var http = require('http');
var Application = require('../../Component/Kernel/Application');

var rootDirectory = process.argv[2];
var application = new Application(rootDirectory);
application.loadConfiguration(rootDirectory + '/config');

var configuration = application.getConfiguration();

var serverPort = configuration.server.port;
var server = http.createServer(application.handleRequest);
server.listen(serverPort);
