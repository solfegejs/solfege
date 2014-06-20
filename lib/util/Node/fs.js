/**
 * @module solfege.util.Node.fs
 */

var assert = require('assert');
var createThunk = require('../Function').createThunk;
var fs = require('fs');

/**
 * Check if a path exists
 *
 * @param   {String}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
module.exports.exists = function(filePath)
{
    // Check parameter
    assert.strictEqual(typeof filePath, 'string', 'The filePath must be a string');

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
module.exports.stat = function(){};
module.exports.stat = createThunk(fs.stat);

/**
 * Reads the contents of a directory
 *
 * @param   {String}    path        The directory path
 * @return  {String[]}              The files in the directory
 */
module.exports.readdir = createThunk(fs.readdir);

/**
 * Read a file
 *
 * @param   {String}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {String}                The file content
 */
module.exports.readFile = createThunk(fs.readFile);

/**
 * Write data to a file
 *
 * @param   {String}        filePath    The file path
 * @param   {String|Buffer} data        The data
 * @param   {Object}        options     The options
 */
module.exports.writeFile = createThunk(fs.writeFile);

/**
 * Create a directory
 *
 * @param   {String}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
module.exports.mkdir = createThunk(fs.mkdir);

/**
 * Delete a directory
 *
 * @param   {String}    path    The directory path
 */
module.exports.rmdir = createThunk(fs.rmdir);

/**
 * Delete a file
 *
 * @param   {String}    filePath    The file path
 */
module.exports.unlink = createThunk(fs.unlink);

