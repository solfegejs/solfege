var Application = (function () {
    function Application(environment, debug) {
        if (typeof debug === "undefined") { debug = false; }
    }
    return Application;
})();


module.exports = Application;

