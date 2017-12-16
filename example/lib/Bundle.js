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
    }

    onStart(app) {
        var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        console.log("started");
    }
};
exports.default = Bundle;