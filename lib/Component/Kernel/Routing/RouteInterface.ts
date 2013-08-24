/**
 * A route interface
 *
 * @namespace Component.Kernel.Routing
 * @interface RouteInterface
 */
interface RouteInterface
{
    /**
     * Get the pattern of the route
     *
     * @return  {string}    The pattern
     */
    getPattern():string;

    /**
     * Set the pattern of the route
     *
     * @param   {string}    pattern         The pattern
     */
    setPattern(pattern:string);

    /**
     * Get the controller path
     *
     * @return  {string}    The path
     */
    getControllerPath():string;

    /**
     * Set the controller path
     *
     * @param   {string}    path            The path
     */
    setControllerPath(path:string);

    /**
     * Check if a path info matches the pattern of the route
     *
     * @param   {string}    pathInfo        The path info
     * @return  {boolean}                   true if the path matches with the pattern, false otherwise
     */
    match(pathInfo:string):boolean;

    /**
     * Update request
     *
     * @param   {Object}    request         HTTP request
     */
    updateRequest(request);
}

export = RouteInterface;