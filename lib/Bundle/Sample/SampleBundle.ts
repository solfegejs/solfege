import Bundle = module('../../Component/Kernel/Bundle/Bundle');
import Command = module('../../Component/Console/Command/Command');

/**
 * A sample bundle
 *
 * @namespace Bundle.Sample
 * @class SampleBundle
 * @constructor
 */
class SampleBundle extends Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        // Add a simple command for the CLI
        var command:Command = new Command('hello', 'Say "hello"', this.sayHello.bind(this));
        this.addConsoleCommand(command);
    }

    /**
     * Say "hello"
     *
     * @param   {string}    name        Your name
     */
    public sayHello(name?:string)
    {
        if (typeof(name) !== 'undefined') {
            console.log("hello " + name + " from " + this['constructor'].name);
            return;
        }

        console.log("hello from " + this['constructor'].name);
    }
}

export = SampleBundle;