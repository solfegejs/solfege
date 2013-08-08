var Input = (function () {
    function Input() {
        this.arguments = [];
    }
    Input.prototype.getArguments = function () {
        return this.arguments;
    };

    Input.prototype.addArgument = function (value) {
        this.arguments.push(value);
    };
    return Input;
})();


module.exports = Input;

