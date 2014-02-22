/**
 * Utils for Node library
 */
var Node = {};

/**
 * Generator version of the module 'fs'
 */
var fs = require('fs');
Node.fs = {};

/**
 * Check if a path exists
 *
 * @param   {string}    filePath    The file path to check
 * @return  {boolean}               true if the file exists, false otherwise
 */
Node.fs.exists = function(filePath)
{
    // Generator function
    return function(done)
    {
        fs.stat(filePath, function(error, result)
        {
            done(null, !error);
        });
    };
};

/**
 * Get the stats of a file
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Object}                The stat object
 */
Node.fs.stat = function(filePath)
{
    // Generator function
    return function(done)
    {
        fs.stat(filePath, done);
    };
};

module.exports = Node;
