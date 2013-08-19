var Loader = (function () {
    function Loader() {
        this.variables = {};
    }
    Loader.prototype.load = function (path) {
        var cjson = require('cjson'), cjsonOptions, configuration;

        cjsonOptions = {
            replace: this.variables
        };
        configuration = cjson.load(path, cjsonOptions);

        return configuration;
    };

    Loader.prototype.addVariable = function (name, value) {
        this.variables[name] = value;
    };
    return Loader;
})();


module.exports = Loader;

