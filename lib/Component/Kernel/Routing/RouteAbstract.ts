/**
 * An abstract route
 *
 * @namespace Component.Kernel.Routing
 * @class RouteAbstract
 * @constructor
 */
class RouteAbstract
{
    /**
     * The pattern of the route
     *
     * @property pattern
     * @type {string}
     * @private
     */
    private pattern:string;

    /**
     * The controller path
     *
     * @property controllerPath
     * @type {string}
     * @private
     */
    private controllerPath:string;

    /**
     * Constructor
     */
    constructor()
    {
        
    }

    /**
     * Get the pattern of the route
     *
     * @return  {string}    The pattern
     */
    public getPattern():string
    {
        return this.pattern;
    }

    /**
     * Set the pattern of the route
     *
     * @param   {string}    pattern         The pattern
     */
    public setPattern(pattern:string)
    {
        this.pattern = pattern;
    }

    /**
     * Get the controller path
     *
     * @return  {string}    The path
     */
    public getControllerPath():string
    {
        return this.controllerPath;
    }

    /**
     * Set the controller path
     *
     * @param   {string}    path            The path
     */
    public setControllerPath(path:string)
    {
        this.controllerPath = path;
    }

    /**
     * Update request
     *
     * @param   {Object}    request         HTTP request
     */
    public updateRequest(request)
    {
        
    }
}

export = RouteAbstract;