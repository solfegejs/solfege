/**
 * Utils for Node library
 */
var Node = {};

/**
 * Generator version of the module 'fs'
 */
var fs = require('fs');
Node.fs = {
    exists: function(filePath)
    {
        return function(done)
        {
            fs.stat(filePath, function(error, result)
            {
                done(null, !error);
            });
        };
    }
};

module.exports = Node;
