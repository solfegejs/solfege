var description = require('../package.json');

var solfege = {
    version: description.version,
    require: function (path) {
        path = path.replace(/\./g, '/');

        return require('./' + path);
    }
};


module.exports = solfege;

