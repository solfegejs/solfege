import ListenerInterface = module("./ListenerInterface");

/**
 * File listener of a logger
 *
 * @namespace Component.Logger
 * @class ListenerFile
 * @constructor
 */
class ListenerFile implements ListenerInterface
{
    /**
     * Path of the log file
     *
     * @property filePath
     * @type {string}
     * @private
     */
    private filePath:string;


    /**
     * Constructor
     *
     * @param   {string}    filePath    Path of the log file
     */
    constructor(filePath:string)
    {
        this.filePath = filePath;
    }

    /**
     * Get the file path
     *
     * @return  {string}    Path of the log file
     */
    public getFilePath()
    {
        return this.filePath;
    }
}

export = ListenerFile;