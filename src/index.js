/* @flow */
import description from "../package.json"
import Application from "solfegejs-application"
import type {BundleInterface} from "solfegejs-application/src/BundleInterface"
import ConfigurationBundle from "solfegejs-configuration"
import ConfigurationYamlLoaderBundle from "solfegejs-configuration-yaml-loader"
import DependencyInjectionBundle from "solfegejs-dependency-injection"
import DependencyInjectionDebuggerBundle from "solfegejs-dependency-injection-debugger"
import ConsoleBundle from "solfegejs-cli"

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
    factory: (filePath?:string, bundles:Array<BundleInterface> = []) => {
        let application:Application = new Application();

        application.addBundle(new ConfigurationBundle());
        if (filePath) {
            application.addBundle(new ConfigurationYamlLoaderBundle(filePath));
        }
        application.addBundle(new DependencyInjectionBundle());
        application.addBundle(new DependencyInjectionDebuggerBundle());
        application.addBundle(new ConsoleBundle());

        for (let bundle:BundleInterface of bundles) {
            application.addBundle(bundle);
        }

        return application;
    }
};

