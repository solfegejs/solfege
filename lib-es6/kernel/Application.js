import co from "co";

/**
 * An application
 */
export default class Application
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initilize the bundle registry
        this.bundles = new Set();
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {*}     bundle  - A bundle
     */
    addBundle(bundle)
    {
        // Check the validity

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Start the application
     */
    start()
    {
        var self = this;

        // Start the generator based flow
        co(function *()
        {
            // Boot registered bundles

        })

        // Handle error
        .catch(error => {
            console.error(error.message);
            console.error(error.stack);
        });
    }
}
