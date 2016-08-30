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
     */
    constructor(foo)
    {
        super();

        this.foo = foo;
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
        console.log(this.foo);
    }
}
