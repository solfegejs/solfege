import solfege from "../../lib/solfege";
let Application = solfege.kernel.Application;

export default class MyBundle {
    constructor() {
        this.woot = "W00t";
    }

    // Implement this method to access the solfege application
    *setApplication(application) {
        if (!(application instanceof Application)) {
            throw new TypeError("Value of argument \"application\" violates contract.\n\nExpected:\nApplication\n\nGot:\n" + _inspect(application));
        }

        let bindGenerator = solfege.util.Function.bindGenerator;
        this.application = application;
        this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
    }

    *onApplicationStart() {
        console.log(this.woot, "SolfegeJS", solfege.version);
        console.log("configuration.foo =", this.application.configuration.parameters.foo);
    }
}

function _inspect(input) {
    function _ref2(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        var entries = keys.map(_ref2).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}