var http = require('http');
var Application = require('../../Component/Kernel/Application');

var rootDirectory = process.argv[2];
var application = new Application(rootDirectory);
application.loadConfiguration(rootDirectory + '/config');

var configuration = application.getConfiguration();

var serverPort = configuration.server.port;
var server = http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end("plop");
});
server.listen(serverPort);
