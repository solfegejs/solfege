var path    = require('path'),
    solfege = require('./lib/solfege');

var co = require('co');

co(function *() {
// Initialize the application
var rootDirectory = process.cwd();
var application = yield new solfege.kernel.Application(rootDirectory);
console.log('c: ' + application);
console.log('d: ' + application.rootDirectory);

})();
//application.loadConfiguration('./config');

/*
// Initialize the command line interface
var cli = new Cli('Solfege', sf.version);

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
