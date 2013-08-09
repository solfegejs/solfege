///<reference path='../declarations/node.d.ts'/>

var description = require('../package.json');

var solfege = {
    /**
     * Solfege version
     */
    version: description.version,
    
    /**
     * Require a class of Solfege
     *
     * @param   {string}    path    Class path
     * @return  {function}          Class
     */
    require: function(path)
    {
        path = path.replace(/\./g, '/');

        return require('./' + path);
    }
};

export = solfege;
