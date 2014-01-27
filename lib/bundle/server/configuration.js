module.exports = {
    // Default port
    port: 1337,

    // Command line interface
    // Used by the bundle solfege.bundle.cli
    cli: {
        // The command to start the server
        start: {
            description: 'Start the HTTP server',
            method: 'start'
        }
    }
};
