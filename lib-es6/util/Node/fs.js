/**
 * @module solfege.util.Node.fs
 */
import assert from "assert";
import {createThunk} from '../Function';
import fs from "fs";

/**
 * Check if a path exists
 *
 * @param   {String}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
export function exists(filePath)
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
let stat = createThunk(fs.stat);
export function stat(filePath)
{
    return stat(filePath);
}

/**
 * Reads the contents of a directory
 *
 * @param   {String}    path        The directory path
 * @return  {String[]}              The files in the directory
 */
let readdir = createThunk(fs.readdir);
export function readdir(path)
{
    return readdir(path);
}

/**
 * Read a file
 *
 * @param   {String}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {String}                The file content
 */
let readFile = createThunk(fs.readFile);
export function readFile(filePath, options)
{
    return readFile(filePath, options);
}

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
let mkdir = createThunk(fs.mkdir);
export function mkdir(path)
{
   return mkdir(path);
}

/**
 * Delete a directory
 *
 * @param   {String}    path    The directory path
 */
let rmdir = createThunk(fs.rmdir);
export function rmdir(path)
{
   return rmdir(path);
}

/**
 * Delete a file
 *
 * @param   {String}    filePath    The file path
 */
let unlink = createThunk(fs.unlink);
export function unlink(filePath)
{
   return unlink(filePath);
}

