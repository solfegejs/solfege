// Check the global scope
if (global.hasOwnProperty('solfegeServices')) {
    module.exports = global.solfegeServices;
} else {


var solfege = require('../solfege');

/**
 * The service container
 *
 * @class   solfege.kernel.Services
 * @api     public
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
 * @type {Object}
 * @api private
 */
proto.list;

/**
 * Register a service
 *
 * @param   {String}    id          The service id
 * @param   {any}       instance    The service instance
 */
proto.register = function(id, instance)
{
    this.list[id] = instance;
};

/**
 * Get a service instance
 *
 * @return  {any}                   The service instance
 */
proto.get = function(id)
{
    return this.list[id];
};



// Build the singleton and register it in the global scope
var singleton = new Services();
global.solfegeServices = singleton;
module.exports = singleton;
}
