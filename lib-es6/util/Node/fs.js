/**
 * @module solfege.util.Node.fs
 */
import assert from "assert";
import {createPromise} from '../Function';
import fs from "fs";

/**
 * Check if a path exists
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Boolean}               true if the file exists, false otherwise
 */
export function exists(filePath:string)
{
    return new Promise(function(resolve, reject) {
        fs.exists(filePath, function(exists) {
            resolve(exists);
        });
    });

}

export let rename = createPromise(fs.rename);

/**
 * Get the stats of a file
 *
 * @param   {string}    filePath    The file path to check
 * @return  {Object}                The stat object
 */
export function stat(filePath:string)
{
    return new Promise(function(resolve, reject) {
        fs.stat(filePath, function(error, stats) {
            if (error) {
                reject(error);
                return;
            }
            resolve(stats);
        });
    });
}


/**
 * Reads the contents of a directory
 *
 * @param   {string}    path        The directory path
 * @return  {string[]}              The files in the directory
 */
export function readdir(path)
{
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(error, files) {
            if (error) {
                reject(error);
                return;
            }
            resolve(files);
        });
    });
}

/**
 * Read a file
 *
 * @param   {string}    filePath    The file path to read
 * @param   {Object}    options     The options
 * @return  {string}                The file content
 */
export function readFile(filePath:string, options)
{
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, options, function(error, data) {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });
}

/**
 * Write data to a file
 *
 * @param   {string}        filePath    The file path
 * @param   {string|Buffer} data        The data
 * @param   {Object}        options     The options
 */
export function writeFile(filePath:string, data, options)
{
    return new Promise(function(resolve, reject) {
        fs.writeFile(filePath, data, options, function(error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}


/**
 * Create a directory
 *
 * @param   {string}    path    The directory path
 * @param   {Number}    mode    The mode (defaults to 0777)
 */
export function mkdir(path:string, mode)
{
    return new Promise(function(resolve, reject) {
        fs.mkdir(path, mode, function(error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Delete a directory
 *
 * @param   {string}    path    The directory path
 */
export function rmdir(path:string)
{
    return new Promise(function(resolve, reject) {
        fs.rmdir(path, mode, function(error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

/**
 * Delete a file
 *
 * @param   {string}    filePath    The file path
 */
export function unlink(filePath:string)
{
    return new Promise(function(resolve, reject) {
        fs.unlink(filePath, function(error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

