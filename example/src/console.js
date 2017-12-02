import solfege from "../../lib";
import MyBundle from "./Bundle";

// Create application instance
let application = solfege.factory();
application.addBundle(new MyBundle);

// Set the configuration file to load
application.addConfigurationProperties({
    a: 42,
    z: "d",
    parameters: {
        foo: "%z%essert"
    }
});

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
