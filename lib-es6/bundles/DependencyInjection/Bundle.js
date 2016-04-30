import path from "path";
import fs from "co-fs";
import yaml from "yaml";
import Application from "../../kernel/Application";
import {bindGenerator, isGenerator} from "../../utils/GeneratorUtil";
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

        // Listen the end of bundles initialization
        this.application.on(Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
        this.application.on(Application.EVENT_START, bindGenerator(this, this.onStart));

        // The first service is the container itself
        this.container.register("container", this.container);
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
            let bundlePath = bundle.getPath();
            let configurationFile = `${bundlePath}${path.sep}services.yml`;
            if (yield fs.exists(configurationFile)) {
                yield this.loadConfigurationFile(configurationFile);
            }
        }
    }

    /**
     * Start the application
     */
    *onStart()
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
    *loadConfigurationFile(filePath)
    {
        let content = yield fs.readFile(filePath, 'utf8');
        let configuration = yaml.eval(content);

        // Parse the services
        if (typeof configuration.services !== 'object') {
            return;
        }
        for (let serviceId in configuration.services) {
            let serviceConfiguration = configuration.services[serviceId];

            // Class path is relative to configuration file
            if (serviceConfiguration.class) {
                let directoryPath = path.dirname(filePath);
                serviceConfiguration.class = directoryPath + path.sep + serviceConfiguration.class;
            }

            // Build definition and register it
            let definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
            this.container.setDefinition(serviceId, definition);
        }
    }
}
