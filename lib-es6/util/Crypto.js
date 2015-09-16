/**
 * @module solfege.util.Crypto
 */
import {createPromise} from './Function';
import fs from "fs";
import crypto from "crypto";

/**
 * Get the MD5 of a file
 *
 * @param   {string}    filePath    The file path
 * @return  {string}                MD5
 */
export function getFileMd5(filePath:string)
{
    return new Promise(function(resolve, reject) {
        let sum = crypto.createHash("md5");

        let stream = fs.ReadStream(filePath);
        stream.on("data", (data) => {
            sum.update(data);
        });
        stream.on("error", (error) => {
            reject(error);
        });
        stream.on("end", () => {
            let hash = sum.digest("hex");
            resolve(hash);
        });
    });
}



