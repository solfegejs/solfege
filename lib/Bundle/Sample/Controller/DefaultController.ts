import ControllerAbstract = module("../../../Component/Kernel/Controller/ControllerAbstract");

/**
 * The default controller of the bundle "SambleBundle"
 *
 * @namespace Bundle.Sample.Controller
 * @class DefaultController
 * @constructor
 */
class DefaultController extends ControllerAbstract
{
    /**
     * foo
     *
     * @property foo
     * @type {string}
     * @private
     */
    private foo:string;

    /**
     * Constructor
     */
    constructor()
    {
        super();

        this.foo = "bar";
    }

    /**
     * Default action
     */
    public indexAction(request, response)
    {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end("Hello world! " + this.foo);
    }
}

export = DefaultController;