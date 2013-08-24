var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var RouteAbstract = require("./RouteAbstract");
var Logger = require("../../Logger/Logger");

var RouteStandard = (function (_super) {
    __extends(RouteStandard, _super);
    function RouteStandard() {
        _super.call(this);

        this.variableNames = [];
    }
    RouteStandard.prototype.setPattern = function (pattern) {
        _super.prototype.setPattern.call(this, pattern);

        var variableRegexp, match, variableName;

        this.variableNames = [];
        variableRegexp = new RegExp(":([a-zA-Z]+)", "g");
        while ((match = variableRegexp.exec(pattern)) !== null) {
            variableName = match[1];
            this.variableNames.push(variableName);
        }
    };

    RouteStandard.prototype.match = function (pathInfo) {
        var pattern, patternSplitted, pathInfoPattern, pathInfoRegexp;

        pattern = this.getPattern();
        patternSplitted = pattern.split(/:[a-zA-Z]+/g);
        pathInfoPattern = "^" + patternSplitted.join("([^/]+)") + "$";

        pathInfoRegexp = new RegExp(pathInfoPattern);
        if (pathInfoRegexp.test(pathInfo)) {
            return true;
        }

        return false;
    };

    RouteStandard.prototype.updateRequest = function (request) {
        var pathInfo, pattern, patternSplitted, pathInfoPattern, pathInfoRegexp, variableValues, variableValue, variableName, variableIndex, variableCount;

        pathInfo = request.url;

        pattern = this.getPattern();
        patternSplitted = pattern.split(/:[a-zA-Z]+/g);
        pathInfoPattern = "^" + patternSplitted.join("([^/]+)") + "$";

        pathInfoRegexp = new RegExp(pathInfoPattern);
        variableValues = pathInfoRegexp.exec(pathInfo);
        variableValues.shift();

        if (!request.parameters) {
            request.parameters = {};
        }
        variableCount = this.variableNames.length;
        for (variableIndex = 0; variableIndex < variableCount; variableIndex++) {
            if (typeof (variableValues[variableIndex]) !== "undefined") {
                variableName = this.variableNames[variableIndex];
                variableValue = variableValues[variableIndex];
                request.parameters[variableName] = variableValue;
            }
        }
    };
    return RouteStandard;
})(RouteAbstract);


module.exports = RouteStandard;

