var solfege = require('./lib/solfege');
var application = new solfege.kernel.Application(__dirname);

application.addBundle(new solfege.bundle.server.HttpServer);

application.start();

