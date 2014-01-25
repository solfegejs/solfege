var solfege = require('./lib/solfege');
var application = new solfege.kernel.Application(__dirname);

application.addBundle('server', new solfege.bundle.server.HttpServer);

application.start();

