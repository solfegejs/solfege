/**
 * Configuration loader
 *
 * @namespace Component.Configuration
 * @class Loader
 * @constructor
 */
class Loader
{
    /**
     * Variables
     *
     * These variables are replaced by their values when the configuration is loaded.
     *
     * @property variables
     * @type {object}
     * @private
     */
    private variables;

    /**
     * Constructor
     */
    constructor()
    {
        this.variables = {};
    }

    /**
     * Load a configuration file
     *
     * @param   {string}    path        File path
     */
    public load(path:string)
    {
        var cjson = require('cjson'),
            cjsonOptions,
            configuration;

        cjsonOptions = {
            replace: this.variables
        };
        configuration = cjson.load(path, cjsonOptions);

        return configuration;
    }

    /**
     * Add a variable
     *
     * This variable is replaced by the value when the configuration is loaded.
     *
     * @param   {string}    name        The variable name
     * @param   {string}    value       The variable value
     */
    public addVariable(name:string, value:string)
    {
        this.variables[name] = value;
    }
}

export = Loader;