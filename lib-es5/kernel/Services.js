// Check the global scope
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (global.hasOwnProperty("solfegeServices")) {
    module.exports = global.solfegeServices;
} else {
    var solfege;
    var assert;
    var singleton;

    (function () {
        solfege = require("../solfege");
        assert = require("assert");

        /**
         * The service container
         *
         * @class   solfege.kernel.Services
         */

        var Services = (function () {
            /**
             * Constructor
             */

            function Services() {
                _classCallCheck(this, Services);

                // Initialize the list
                this.list = {};
            }

            _createClass(Services, [{
                key: "register",

                /**
                 * Register a service
                 *
                 * @public
                 * @method  solfege.kernel.Services.prototype.register
                 * @param   {String} id - The service id
                 * @param   {*} instance - The service instance
                 */
                value: function register(id, instance) {
                    // Check the id
                    assert.strictEqual(typeof id, "string", "The id must be a string");

                    this.list[id] = instance;
                }
            }, {
                key: "get",

                /**
                 * Get a service instance
                 *
                 * @public
                 * @method  solfege.kernel.Services.prototype.get
                 * @param   {String} id - The service id
                 * @return  {*} The service instance
                 */
                value: function get(id) {
                    // Check the id
                    assert.strictEqual(typeof id, "string", "The id must be a string");

                    return this.list[id];
                }
            }]);

            return Services;
        })();

        // Build the singleton and register it in the global scope
        singleton = new Services();

        global.solfegeServices = singleton;
        module.exports = singleton;
    })();
}