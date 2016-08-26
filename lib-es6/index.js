import description from "../package.json";
import Application from "./kernel/Application";
import DependencyInjectionBundle from "./bundles/DependencyInjection/Bundle";
import ConsoleBundle from "./bundles/Console/Bundle";

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
    factory: (bundles:Array = []) => {
        let application = new Application();
        application.addBundle(new DependencyInjectionBundle());
        application.addBundle(new ConsoleBundle());

        for (let bundle of bundles) {
            application.addBundle(bundle);
        }

        return application;
    }
};

