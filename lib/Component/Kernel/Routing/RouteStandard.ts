import RouteInterface = module("./RouteInterface");
import RouteAbstract = module("./RouteAbstract");

/**
 * A standard route
 *
 * @namespace Component.Kernel.Routing
 * @class RouteStandard
 * @constructor
 */
class RouteStandard extends RouteAbstract implements RouteInterface
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
    }

    /**
     * Check if a path info matches the pattern of the route
     *
     * @param   {string}    pathInfo        The path info
     * @return  {boolean}                   true if the path matches with the pattern, false otherwise
     */
    public match(pathInfo:string):boolean
    {
        return true;
    }
}

export = RouteStandard;