import Application from "../../kernel/Application";
import {bindGenerator, isGenerator} from "../../utils/GeneratorUtil";
import Container from "./Container";

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
    }

    /**
     * Boot the bundle
     */
    *boot()
    {

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
                continue;
            }

            // Otherwise, look at the default configuration file

        }
    }
}
