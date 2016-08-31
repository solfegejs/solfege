import solfege from "../../lib";
import MyBundle from "./Bundle";

// Create application instance
let application = solfege.factory();
application.addBundle(new MyBundle);

// Load configuration file
application.loadConfiguration(`${__dirname}/config/production.yml`);

// Start the application
let parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);
