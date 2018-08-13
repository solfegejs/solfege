const description = require("../package.json");
const Application = require("@solfege/application");
const ConfigurationBundle = require("@solfege/configuration");
const ConfigurationYamlLoaderBundle = require("@solfege/configuration-yaml-loader");
const DependencyInjectionBundle = require("@solfege/dependency-injection");
const DependencyInjectionConfigurationAwareBundle = require("@solfege/dependency-injection-configuration-aware");
const ConsoleBundle = require("@solfege/cli");

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
    application.addBundle(new DependencyInjectionConfigurationAwareBundle());
    application.addBundle(new ConsoleBundle());

    for (let bundle of bundles) {
      application.addBundle(bundle);
    }

    return application;
  }
};
