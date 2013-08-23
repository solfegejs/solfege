
var RouteStandard = require("./RouteStandard");


var Router = (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.initialize = function (configuration) {
        var routeName, routeConfiguration, routePattern, routeController, route;

        for (routeName in configuration) {
            routeConfiguration = configuration[routeName];
            routePattern = routeConfiguration.pattern;
            routeController = routeConfiguration.controller;

            route = new RouteStandard();
            route.setPattern(routePattern);
            route.setControllerPath(routeController);

            this.routes.push(route);
        }
    };

    Router.prototype.getApplication = function () {
        return this.application;
    };

    Router.prototype.setApplication = function (application) {
        this.application = application;
    };

    Router.prototype.getRoute = function (request) {
        var pathInfo, routeIndex, routeLength, route, controllerPath, controller;

        pathInfo = request.url;

        routeLength = this.routes.length;
        for (routeIndex = 0; routeIndex < routeLength; routeIndex++) {
            route = this.routes[routeIndex];

            if (route.match(pathInfo)) {
                return route;
            }
        }

        return null;
    };

    Router.prototype.getController = function (controllerPath) {
        return this.application.getController(controllerPath);
    };
    return Router;
})();


module.exports = Router;

