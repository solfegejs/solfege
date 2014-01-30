var solfege = require('./lib/solfege');

// Initialize the application
var application = new solfege.kernel.Application(__dirname);

// Add the bundles
application.addBundle('server', new solfege.bundle.server.HttpServer);
application.addBundle('console', new solfege.bundle.cli.Console);

// Override configuration
application.overrideConfiguration({
    server: {
        port: 7777
    }
});

// Start the application
application.start();

