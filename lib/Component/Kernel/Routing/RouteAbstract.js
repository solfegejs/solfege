var RouteAbstract = (function () {
    function RouteAbstract() {
    }
    RouteAbstract.prototype.getPattern = function () {
        return this.pattern;
    };

    RouteAbstract.prototype.setPattern = function (pattern) {
        this.pattern = pattern;
    };

    RouteAbstract.prototype.getControllerPath = function () {
        return this.controllerPath;
    };

    RouteAbstract.prototype.setControllerPath = function (path) {
        this.controllerPath = path;
    };
    return RouteAbstract;
})();


module.exports = RouteAbstract;

