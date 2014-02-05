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
 */
Node.fs.exists = function(filePath)
{
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
 */
Node.fs.stat = function(filePath)
{
    return function(done)
    {
        fs.stat(filePath, done);
    };
};

module.exports = Node;
