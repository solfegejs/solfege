import description from "../package.json";

let bundles = new Set();

/**
 * Add a bundle to the registry
 *
 * @param   {*}     bundle  - A bundle
 */
export function addBundle(bundle)
{
    // Check the validity

    // Add to the registry
    bundles.add(bundle);
};

/**
 * Start the application
 */
export function start()
{
};
