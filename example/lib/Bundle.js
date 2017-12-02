"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Bundle = class Bundle {
    constructor() {}

    getPath() {
        return __dirname;
    }

    initialize(app) {
        app.on("start", this.onStart);
        console.log("Bundle initialized");
    }

    onStart(app, parameters) {
        var config = app.getConfiguration();
        console.log("a:", config.get("a"));
        console.log("z:", config.get("z"));
        console.log("parameters.foo:", config.get("parameters.foo"));
    }
};
exports.default = Bundle;