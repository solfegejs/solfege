var solfege = require('./lib/solfege');
var application = new solfege.kernel.Application(__dirname);

application.addBundle('server', new solfege.bundle.server.HttpServer);
application.addBundle('console', new solfege.bundle.console.Console);

application.start();


/*

// Add the commands from the bundles
var bundles = application.getBundles();
for (var bundleIndex in bundles) {
    var bundle = bundles[bundleIndex];
    var bundleCommands = bundle.getConsoleCommands();
    cli.addCommands(bundle.getName(), bundleCommands);
}

// Run the command line inteface
var input = new ArgvInput();
cli.run(input);
*/
