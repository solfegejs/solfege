var createThunk = require('./Function').createThunk;

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
    // Thunk
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
Node.fs.stat = createThunk(fs.stat);

/**
 * Reads the contents of a directory
 *
 * @param   {String}    path        The directory path
 * @return  {String[]}              The files in the directory
 */
Node.fs.readdir = createThunk(fs.readdir);

/**
 * Read a file
 *
 * @param   {String}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {String}                The file content
 */
Node.fs.readFile = createThunk(fs.readFile);

/**
 * Write data to a file
 *
 * @param   {String}        filePath    The file path
 * @param   {String|Buffer} data        The data
 * @param   {Object}        options     The options
 */
Node.fs.writeFile = createThunk(fs.writeFile);

/**
 * Create a directory
 *
 * @param   {String}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
Node.fs.mkdir = createThunk(fs.mkdir);

/**
 * Delete a directory
 *
 * @param   {String}    path    The directory path
 */
Node.fs.rmdir = createThunk(fs.rmdir);

/**
 * Delete a file
 *
 * @param   {String}    filePath    The file path
 */
Node.fs.unlink = createThunk(fs.unlink);


module.exports = Node;
