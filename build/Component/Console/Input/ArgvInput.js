var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Input = require('./Input');

var ArgvInput = (function (_super) {
    __extends(ArgvInput, _super);
    function ArgvInput() {
        _super.call(this);

        process.argv.forEach(this.argvFilter.bind(this));
    }
    ArgvInput.prototype.argvFilter = function (value, index, array) {
        if (index < 2) {
            return;
        }

        this.addArgument(value);
    };
    return ArgvInput;
})(Input);


module.exports = ArgvInput;

