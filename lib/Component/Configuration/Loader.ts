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
     * @type {Object}
     * @private
     */
    private variables:Object;

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
     * @todo Load the files only once
     *
     * @param   {string}    path        File path
     */
    public load(path:string)
    {
        var cjson = require('cjson'),
            cjsonOptions,
            configuration, 
            paths;

        // Get the file order
        paths = this.getFileOrder(path);

        // Load and merge all the configuration files
        cjsonOptions = {
            replace: this.variables,
            merge: true
        };
        configuration = cjson.load(paths, cjsonOptions);

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

    /**
     * Get the file order of the importation
     *
     * @param   {string}    path        File path
     * @return  {string[]}              File paths to merge
     */
    private getFileOrder(path:string):string[]
    {
        var cjson = require('cjson'),
            cjsonOptions,
            configuration,
            importIndex:string, importPath:string,
            subPaths:string[], 
            paths:string[];

        // Add the current configuration file
        paths = [path];

        // Load the content of the current configuration file
        cjsonOptions = {
            replace: this.variables
        };
        configuration = cjson.load(path, cjsonOptions);

        // For each import, add the sub paths before the current configuration file
        if (configuration.imports instanceof Array) {
            for (importIndex in configuration.imports) {
                importPath = configuration.imports[importIndex];

                subPaths = this.getFileOrder(importPath);
                paths = subPaths.concat(paths);
            }
        }

        return paths;
    }
}

export = Loader;