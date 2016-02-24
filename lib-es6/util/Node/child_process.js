/**
 * @module solfege.util.Node.child_process
 */
import {createPromise} from '../Function';
import child_process from "child_process";

/**
 * Spawn a command
 *
 * @param   {string}    command     The command
 * @param   {Array}     parameters  The command parameters
 * @return  {string}                The output
 */
export function spawn(command:string, parameters?)
{
    return new Promise((resolve, reject) => {
        let result = child_process.spawn(command, parameters);

        result.stdout.on("data", (data) => {
            resolve(data);
        });

        result.stderr.on("data", (data) => {
            reject(data);
        });

        result.on("close", (code) => {
        });
    });

}


/**
 * Execute a command
 *
 * @param   {string}    command     The command
 * @return  {string}                The output
 */
export function exec(command:string)
{
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(`${stdout}`);
        });
    });
}


