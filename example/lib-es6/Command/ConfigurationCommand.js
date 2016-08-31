import ContainerAwareCommand from "../../../lib/bundles/Console/Command/ContainerAwareCommand";

/**
 * Configuration command
 */
export default class ConfigurationCommand extends ContainerAwareCommand
{
    /**
     * Constructor
     * 
     * @param   {string}    foo     Foo property
     * @param   {uint32}    port    Port property
     */
    constructor(foo:string, port:uint32)
    {
        super();

        this.foo = foo;
        this.port = port;
    }

    /**
     * Configure command
     */
    *configure()
    {
        this.setName("example:configuration");
        this.setDescription("Display some configuration properties");
    }

    /**
     * Execute the command
     */
    *execute()
    {
        console.log("foo:", this.foo);
        console.log("port:", this.port);
    }
}
