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
 * @param   {String}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
Node.fs.exists = function(filePath)
{
    // Generator function
    return function(done)
    {
        fs.exists(filePath, function(exists)
        {
            done(null, exists);
        });
    };
};

/**
 * Get the stats of a file
 *
 * @param   {String}    filePath    The file path to check
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

/**
 * Read a file
 *
 * @param   {String}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {String}                The file content
 */
Node.fs.readFile = function(filePath, options)
{
    // Generator function
    return function(done)
    {
        fs.readFile(filePath, options, done);
    };
};

/**
 * Write data to a file
 *
 * @param   {String}        filePath    The file path
 * @param   {String|Buffer} data        The data
 * @param   {Object}        options     The options
 */
Node.fs.writeFile = function(filePath, data, options)
{
    return function(done)
    {
        fs.writeFile(filePath, data, options, done);
    };
};

/**
 * Create a directory
 *
 * @param   {String}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
Node.fs.mkdir = function(path, mode)
{
    return function(done)
    {
        fs.mkdir(path, mode, done);
    };
};

/**
 * Delete a directory
 *
 * @param   {String}    path    The directory path
 */
Node.fs.rmdir = function(path)
{
    return function(done)
    {
        fs.rmdir(path, done);
    };
};

/**
 * Delete a file
 *
 * @param   {String}    filePath    The file path
 */
Node.fs.unlink = function(filePath)
{
    return function(done)
    {
        fs.unlink(path, done);
    };
};

module.exports = Node;
