import path from "path";
import fs from "co-fs";
import configYaml from "config-yaml";
import Application from "../../kernel/Application";
import bindGenerator from "bind-generator";
import {fn as isGenerator} from "is-generator";
import Container from "./ServiceContainer/Container";
import DefinitionBuilder from "./ServiceContainer/DefinitionBuilder";

/**
 * Service container bundle
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        // Declare application property
        this.application;

        // Initialize the definition builder
        this.definitionBuilder = new DefinitionBuilder();

        // Initialize the service container
        this.container = new Container();
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application)
    {
        this.application = application;

        // Listen the end of configuration loading
        this.application.on(Application.EVENT_CONFIGURATION_LOADED, bindGenerator(this, this.onConfigurationLoaded));

        // Listen the end of bundles initialization
        this.application.on(Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));

        // The first service is the container itself
        let definition = this.container.register("container", this.container);
        definition.setClassPath(`${__dirname}${path.sep}ServiceContainer${path.sep}Container`);
    }

    /**
     * The configuration is loaded
     *
     * @param   {solfegejs/kernel/Application}      application     Solfege application
     * @param   {solfegejs/kernel/Configuration}    configuration   Solfege configuration
     */
    *onConfigurationLoaded(application, configuration)
    {
        this.container.setConfiguration(configuration);
    }

    /**
     * The bundles are initialized
     */
    *onBundlesInitialized()
    {
        let bundles = this.application.getBundles();

        // Load services from the bundles
        for (let bundle of bundles) {
            // If the bundle implements configureContainer method, then call it
            if (isGenerator(bundle.configureContainer)) {
                yield bundle.configureContainer(this.container);
            }

            // Otherwise, look at the default configuration file
            let bundlePath = this.application.getBundleDirectoryPath(bundle);
            if (!bundlePath) {
                throw new Error("Unable to find bundle directory path");
            }
            let configurationFile = `${bundlePath}${path.sep}services.yml`;
            if (yield fs.exists(configurationFile)) {
                yield this.loadConfigurationFile(configurationFile);
            }
        }
    }

    /**
     * Boot the bundle
     */
    *boot()
    {
        // Compile
        yield this.container.compile();

        // The container is ready
    }

    /**
     * Load a configuration file
     *
     * @param   {String}    filePath    The file path
     */
    *loadConfigurationFile(filePath:string)
    {
        let configuration = configYaml(filePath, {encoding: "utf8"});

        // Parse the services
        if (typeof configuration.services !== 'object') {
            return;
        }
        for (let serviceId in configuration.services) {
            let serviceConfiguration = configuration.services[serviceId];

            // Class path is relative to configuration file if it exists
            if (serviceConfiguration.class) {
                let directoryPath = path.dirname(filePath);
                let classPath =  directoryPath + path.sep + serviceConfiguration.class;

                try {
                    let classConstructor = require(classPath);
                    serviceConfiguration.class = classPath;
                } catch (error) {
                }
            }

            // Build definition and register it
            let definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
            this.container.setDefinition(serviceId, definition);
        }
    }
}
