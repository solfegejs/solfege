import solfege from "../../lib";
import MyBundle from "./Bundle";

// Create application instance
let application = solfege.factory();
application.addBundle(new MyBundle);

// Load configuration file
application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
