var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var RouteAbstract = require("./RouteAbstract");

var RouteStandard = (function (_super) {
    __extends(RouteStandard, _super);
    function RouteStandard() {
        _super.call(this);
    }
    RouteStandard.prototype.match = function (pathInfo) {
        return true;
    };
    return RouteStandard;
})(RouteAbstract);


module.exports = RouteStandard;

