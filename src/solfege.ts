///<reference path='../declarations/node.d.ts'/>

var solfege = {
    /**
     * Require a class of Solfege
     *
     * @param   {string}    path    Class path
     * @return  {function}          Class
     */
    require: function(path)
    {
        return require('./' + path);
    }
};

export = solfege;
