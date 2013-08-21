var Loader = (function () {
    function Loader() {
        this.variables = {};
    }
    Loader.prototype.load = function (path) {
        var cjson = require('cjson'), cjsonOptions, configuration, paths;

        paths = this.getFileOrder(path);

        cjsonOptions = {
            replace: this.variables,
            merge: true
        };
        configuration = cjson.load(paths, cjsonOptions);

        return configuration;
    };

    Loader.prototype.addVariable = function (name, value) {
        this.variables[name] = value;
    };

    Loader.prototype.getFileOrder = function (path) {
        var cjson = require('cjson'), cjsonOptions, configuration, importIndex, importPath, subPaths, paths;

        paths = [path];

        cjsonOptions = {
            replace: this.variables
        };
        configuration = cjson.load(path, cjsonOptions);

        if (configuration.imports instanceof Array) {
            for (importIndex in configuration.imports) {
                importPath = configuration.imports[importIndex];

                subPaths = this.getFileOrder(importPath);
                paths = subPaths.concat(paths);
            }
        }

        return paths;
    };
    return Loader;
})();


module.exports = Loader;

