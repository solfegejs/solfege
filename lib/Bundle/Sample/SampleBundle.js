var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bundle = require('../../Component/Kernel/Bundle/Bundle');
var Command = require('../../Component/Console/Command/Command');

var SampleBundle = (function (_super) {
    __extends(SampleBundle, _super);
    function SampleBundle() {
        _super.call(this);

        var command = new Command('hello', 'Say "hello"', this.sayHello.bind(this));
        this.addConsoleCommand(command);
    }
    SampleBundle.prototype.sayHello = function (name) {
        if (typeof (name) !== 'undefined') {
            console.log("hello " + name + " from " + this['constructor'].name);
            return;
        }

        console.log("hello from " + this['constructor'].name);
    };
    return SampleBundle;
})(Bundle);


module.exports = SampleBundle;

