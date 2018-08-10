const description = require("../package.json")
const Application = require("@solfege/application")
import ConfigurationBundle from "solfegejs-configuration"
import ConfigurationYamlLoaderBundle from "solfegejs-configuration-yaml-loader"
import DependencyInjectionBundle from "solfegejs-dependency-injection"
import DependencyInjectionDebuggerBundle from "solfegejs-dependency-injection-debugger"
import ConsoleBundle from "solfegejs-cli"

module.exports = {
    name: "SolfegeJS",
    version: description.version,

    // Application class
    // Use it to instanciate a new application
    Application: Application,

    // Application factory
    // Use it to instanciate a new application with default bundles
    factory: (configPath = null, bundles = []) => {
        const application = new Application();

        application.addBundle(new ConfigurationBundle());
        if (configPath) {
            application.addBundle(new ConfigurationYamlLoaderBundle(configPath));
        }
        application.addBundle(new DependencyInjectionBundle());
        application.addBundle(new DependencyInjectionDebuggerBundle());
        application.addBundle(new ConsoleBundle());

        for (let bundle of bundles) {
            application.addBundle(bundle);
        }

        return application;
    }
};

