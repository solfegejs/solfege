import solfege from "../../lib/solfege";
import MyBundle from "./MyBundle";

// Initialize the application
let application = new solfege.kernel.Application(__dirname);

// Add the internal bundle
application.addBundle('myBundle', new MyBundle());

// Override the configuration
var configuration = require(__dirname + '/../config/production.json');
application.overrideConfiguration(configuration);

// Start the application
application.start();