/* @flow */
import description from "../package.json"
import Application from "./Application"
import type {BundleInterface} from "./BundleInterface"

export default {
    // Solfege name
    name: "SolfegeJS",

    // Solfege version
    version: description.version,

    // Application class
    // Use it to instanciate a new application
    Application: Application,

    // Application factory
    // Use it to instanciate a new application with default bundles
    factory: (bundles:Array<BundleInterface> = []) => {
        let application:Application = new Application();

        for (let bundle:BundleInterface of bundles) {
            application.addBundle(bundle);
        }

        return application;
    }
};

