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
     * @param   {object}    routing Routing property
     */
    constructor(foo:string, port:uint32, routing)
    {
        super();

        this.foo = foo;
        this.port = port;
        this.routing = routing;
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
        console.log("route controller:", this.routing.a.b.c.route_2.controller);
    }
}
