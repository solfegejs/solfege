"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// Check the global scope
if (global.hasOwnProperty('solfegeServices')) {
    module.exports = global.solfegeServices;
} else {

    var solfege = require("../solfege");
    var assert = require("assert");

    /**
     * The service container
     *
     * @class   solfege.kernel.Services
     */
    class Services {
        /**
         * Constructor
         */
        constructor() {
            // Initialize the list
            this.list = {};
        }

        /**
         * Register a service
         *
         * @public
         * @method  solfege.kernel.Services.prototype.register
         * @param   {String} id - The service id
         * @param   {*} instance - The service instance
         */
        register(id, instance) {
            // Check the id
            assert.strictEqual(typeof id === "undefined" ? "undefined" : _typeof(id), 'string', 'The id must be a string');

            this.list[id] = instance;
        }

        /**
         * Get a service instance
         *
         * @public
         * @method  solfege.kernel.Services.prototype.get
         * @param   {String} id - The service id
         * @return  {*} The service instance
         */
        get(id) {
            // Check the id
            assert.strictEqual(typeof id === "undefined" ? "undefined" : _typeof(id), 'string', 'The id must be a string');

            return this.list[id];
        }

    }

    // Build the singleton and register it in the global scope
    var singleton = new Services();
    global.solfegeServices = singleton;
    module.exports = singleton;
}