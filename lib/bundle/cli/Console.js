var solfege = require('../../solfege');

/**
 * The command line interface of SolfegeJS
 */
var Console = solfege.util.Class.create(function()
{
    // Initialize the bundle list
    this.bundles = {};

    // Initialize the command list
    this.commands = {};
}, 'solfege.bundle.cli.Console');
var proto = Console.prototype;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The bundle list
 *
 * @type {Object}
 * @api private
 */
proto.bundles;

/**
 * The command list per bundle
 *
 * @type {Object}
 * @api private
 */
proto.commands;

/**
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.application.on(solfege.kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
    this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
};

/**
 * Executed when the bundles of the application are initialized
 */
proto.onBundlesInitialized = function*()
{
    this.bundles = this.application.getBundles();

    // Get the available commands of each bundle
    for (var bundleId in this.bundles) {
        var bundle = this.bundles[bundleId];

        // Get the configuration of the bundle
        if (typeof bundle.getConfiguration !== 'function') {
            continue;
        }
        var bundleConfiguration = bundle.getConfiguration();

        // Get the command list
        if (bundleConfiguration.hasOwnProperty('cli')) {
            this.commands[bundleId] = bundleConfiguration.cli;
        }
    }
};

/**
 * Executed when the application starts
 */
proto.onApplicationStart = function*()
{
    var charm, parameters,
        bundle, bundleId, bundleCommands,
        commandId, commandIdInfo, commandName, command, commandMethod;

    // Initialize the charm module
    charm = require('charm')();
    charm.pipe(process.stdout);

    // Get the parameters
    process.argv.shift();
    process.argv.shift();
    parameters = process.argv;

    // Execute the provided command name
    if (parameters.length > 0) {
        commandId = parameters.shift();
        commandIdInfo = commandId.split(':');

        // Get the bundle id and the command name
        if (commandIdInfo.length !== 2) {
            charm.background('black').foreground('red')
                .write('You must specify the bundle id and the command name\n');
            return;
        }
        bundleId = commandIdInfo[0];
        commandName = commandIdInfo[1];

        // Get the commands of the bundle
        if (!this.commands.hasOwnProperty(bundleId)) {
            charm.background('black').foreground('red')
                .write('The bundle ')
                .foreground('yellow').write(bundleId)
                .foreground('red').write(' is not available\n');
            return;
        }
        bundleCommands = this.commands[bundleId];

        // Get the command
        if (!bundleCommands.hasOwnProperty(commandName)) {
            charm.background('black').foreground('red')
                .write('The bundle ')
                .foreground('yellow').write(bundleId)
                .foreground('red').write(' does not have the command ')
                .foreground('green').write(commandName)
                .write('\n');
            return;
        }
        command = bundleCommands[commandName];

        // Execute the command
        commandMethod = command.method;
        if (!commandMethod) {
            charm.background('black').foreground('red')
                .write('The command does not have a method to execute\n');
            return;
        }
        bundle = this.bundles[bundleId];
        if (typeof bundle[commandMethod] !== 'function') {
            charm.background('black').foreground('red')
                .write('The command ')
                .foreground('green').write(commandName)
                .foreground('red').write(' has an invalid method\n');
            return;
        }
        if ('GeneratorFunction' !== bundle[commandMethod].constructor.name) {
            charm.background('black').foreground('red')
                .write('The command ')
                .foreground('green').write(commandName)
                .foreground('red').write(' must implement a generator method\n');
            return;
        }
        yield bundle[commandMethod].apply(bundle, parameters);

        return;
    }


    // Display the header
    charm.background('black').foreground('cyan')
        .write('SolfegeJS CLI\n')
        .write('-------------\n\n')
        .foreground('white').write('Usage: ')
        .foreground('yellow').write('bundleId')
        .foreground('white').write(':')
        .foreground('green').write('commandName')
        .foreground('white').write(' [argument1] [argument2] ...')
        .write('\n\n');

    // Display each bundle CLI
    for (bundleId in this.commands) {
        bundleCommands = this.commands[bundleId];

        // Display the bundle id
        charm.foreground('yellow').write(bundleId + '\n');
        for (commandName in bundleCommands) {
            command = bundleCommands[commandName];

            // Display the command name
            charm.foreground('white').write('  - ').foreground('green').write(commandName);

            // Display the description
            if (command.description) {
                 charm.foreground('white').write(' : ' + command.description);
            }

            charm.write('\n');
        }

        charm.write('\n');
    }
};

module.exports = Console;
