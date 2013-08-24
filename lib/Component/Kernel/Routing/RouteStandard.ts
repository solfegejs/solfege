import RouteInterface = module("./RouteInterface");
import RouteAbstract = module("./RouteAbstract");
import Logger = module("../../Logger/Logger");

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
     * The variable names
     *
     * @property variableNames
     * @type {string[]}
     * @private
     */
    private variableNames:string[];

    /**
     * Constructor
     */
    constructor()
    {
        super();

        this.variableNames = [];
    }

    /**
     * Set the pattern of the route
     *
     * @param   {string}    pattern         The pattern
     */
    public setPattern(pattern:string)
    {
        super.setPattern(pattern);

        var variableRegexp:RegExp,
            match:string[],
            variableName:string;

        // Get variable names
        this.variableNames = [];
        variableRegexp = new RegExp(":([a-zA-Z]+)", "g");
        while ((match = variableRegexp.exec(pattern)) !== null) {
            variableName = match[1];
            this.variableNames.push(variableName);
        }

    }

    /**
     * Check if a path info matches the pattern of the route
     *
     * @param   {string}    pathInfo        The path info
     * @return  {boolean}                   true if the path matches with the pattern, false otherwise
     */
    public match(pathInfo:string):boolean
    {
        var pattern:string,
            patternSplitted:string[],
            pathInfoPattern:string,
            pathInfoRegexp:RegExp;

        // Build the pattern to check the path info
        pattern         = this.getPattern();
        patternSplitted = pattern.split(/:[a-zA-Z]+/g);
        pathInfoPattern = "^" + patternSplitted.join("([^/]+)") + "$";
        
        // Check the path info
        pathInfoRegexp = new RegExp(pathInfoPattern);
        if (pathInfoRegexp.test(pathInfo)) {
            return true;
        }

        return false;
    }

    /**
     * Update request
     *
     * @param   {Object}    request         HTTP request
     */
    public updateRequest(request)
    {
        var pathInfo:string,
            pattern:string,
            patternSplitted:string[],
            pathInfoPattern:string,
            pathInfoRegexp:RegExp,
            variableValues:string[],
            variableValue:string,
            variableName:string,
            variableIndex:number,
            variableCount:number;

        // Get the path info
        pathInfo = request.url;

        // Build the pattern to get variable values
        pattern         = this.getPattern();
        patternSplitted = pattern.split(/:[a-zA-Z]+/g);
        pathInfoPattern = "^" + patternSplitted.join("([^/]+)") + "$";
        
        // Get the variable values
        pathInfoRegexp = new RegExp(pathInfoPattern);
        variableValues = pathInfoRegexp.exec(pathInfo);
        variableValues.shift();

        // Update the request
        if (!request.parameters) {
            request.parameters = {};
        }
        variableCount = this.variableNames.length;
        for (variableIndex = 0; variableIndex < variableCount; variableIndex++) {
            if (typeof(variableValues[variableIndex]) !== "undefined") {
                variableName = this.variableNames[variableIndex];
                variableValue = variableValues[variableIndex];
                request.parameters[variableName] = variableValue;
            }
        }
    }
}

export = RouteStandard;