/* @flow */
import fs from "fs"

export default {
    exists: function (path:string):Promise<boolean>
    {
        return new Promise((resolve:Function, reject:Function) => {
            fs.stat(path, function(err:?ErrnoError, res:any):void {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
}
