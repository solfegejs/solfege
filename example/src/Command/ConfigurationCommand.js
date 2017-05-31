import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand";

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
    constructor(foo:string, port:uint32, routing, configuration, toc)
    {
        super();

        this.foo = foo;
        this.port = port;
        this.routing = routing;
        this.configuration = configuration;
        this.toc = toc;
    }

    addSomething(config, foo)
    {
        //console.log(config, foo);
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
        console.log("foo from configuration service:", this.configuration.get("parameters.foo"));
        console.log("toc", this.toc);
        console.log(this.configuration);
    }
}
