/* @flow */
import fs from "fs"

export default {
    exists: function (path:string):Function
    {
        return function(done:Function):void {
            fs.stat(path, function(err:?ErrnoError, res:any):void {
                done(null, !err);
            });
        }
    }
}
