// Check the global scope
if (global.hasOwnProperty('solfegeServices')) {
    module.exports = global.solfegeServices;
} else {


var solfege = require('../solfege');
var assert = require('assert');

/**
 * The service container
 *
 * @class   solfege.kernel.Services
 */
var Services = solfege.util.Class.create(function()
{
    // Initialize the list
    this.list = {};

}, 'solfege.kernel.Services');
var proto = Services.prototype;


/**
 * The service list
 *
 * @private
 * @member  {Object} solfege.kernel.Services.prototype.list
 */
proto.list;

/**
 * Register a service
 *
 * @public
 * @method  solfege.kernel.Services.prototype.register
 * @param   {String} id - The service id
 * @param   {*} instance - The service instance
 */
proto.register = function(id, instance)
{
    // Check the id
    assert.strictEqual(typeof id, 'string', 'The id must be a string');

    this.list[id] = instance;
};

/**
 * Get a service instance
 *
 * @public
 * @method  solfege.kernel.Services.prototype.get
 * @param   {String} id - The service id
 * @return  {*} The service instance
 */
proto.get = function(id)
{
    // Check the id
    assert.strictEqual(typeof id, 'string', 'The id must be a string');

    return this.list[id];
};



// Build the singleton and register it in the global scope
var singleton = new Services();
global.solfegeServices = singleton;
module.exports = singleton;


}
