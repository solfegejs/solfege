import solfege from "../../lib-es5/solfege";
import MyBundle from "./MyBundle";

// Initialize the application
let application = new solfege.kernel.Application(__dirname);

// Add the internal bundle
application.addBundle('myBundle', new MyBundle);

// Start the application
application.start();

