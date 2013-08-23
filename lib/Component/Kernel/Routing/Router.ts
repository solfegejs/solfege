import RouteInterface = module("./RouteInterface");
import RouteStandard = module("./RouteStandard");
import ControllerInterface = module("../Controller/ControllerInterface");

/**
 * The router of the HTTP Request
 *
 * @namespace Component.Kernel.Routing
 * @class Router
 * @constructor
 */
class Router
{
    /**
     * Application instance
     *
     * @property application
     * @type {Component.Kernel.Application}
     * @private
     */
    private application;

    /**
     * Routes
     *
     * @property routes
     * @type {RouteInterface[]}
     * @private
     */
    private routes:RouteInterface[];


    /**
     * Constructor
     */
    constructor()
    {
        this.routes = [];
    }

    /**
     * Initialize the router
     *
     * @param   {any}       configuration       Configuration object
     */
    public initialize(configuration:any)
    {
        var routeName:string,
            routeConfiguration:any,
            routePattern:string,
            routeController:string,
            route:RouteInterface;

        // Create the route instances
        for (routeName in configuration) {
            routeConfiguration = configuration[routeName];
            routePattern = routeConfiguration.pattern;
            routeController = routeConfiguration.controller;

            // Initialize the instance
            route = new RouteStandard();
            route.setPattern(routePattern);
            route.setControllerPath(routeController);

            // Add the instance to the list
            this.routes.push(route);
        }
    }

    /**
     * Get the application instance
     *
     * @return  {Component.Kernel.Application}      Application instance
     */
    public getApplication()
    {
        return this.application;
    }

    /**
     * Set the application instance
     *
     * @param   {Component.Kernel.Application}      application         Application instance
     */
    public setApplication(application)
    {
        this.application = application;
    }

    /**
     * Get the route instance from the HTTP request
     *
     * @param   {Object}                request         The request
     * @return  {RouteInterface|null}                   Route instance
     */
    public getRoute(request):RouteInterface
    {
        var pathInfo:string,
            routeIndex:number, routeLength:number, route:RouteInterface,
            controllerPath:string, controller:ControllerInterface;

        // Get the path info
        pathInfo = request.url;
        
        // Find the route
        routeLength = this.routes.length;
        for (routeIndex = 0; routeIndex < routeLength; routeIndex++) {
            route = this.routes[routeIndex];

            if (route.match(pathInfo)) {
                return route;
            }
        }

        return null;
    }

    /**
     * Get the controller instance from a path
     *
     * @param   {string}                                            controllerPath          The controller path
     * @return  {Component.Kernel.Controller.ControllerInterface}                           Description
     */
    private getController(controllerPath:string):ControllerInterface
    {
        return this.application.getController(controllerPath);
    }
}

export = Router;