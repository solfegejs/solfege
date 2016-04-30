import assert from "assert";
import Definition from "./Definition";
import Reference from "./Reference";

/**
 * Service container
 */
export default class Container
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize definitions
        this.definitions = new Map();

        // Initialize compilers
        this.compilers = new Set();
    }

    /**
     * Set a service definition
     *
     * @param   {String}        id              Service id
     * @param   {Definition}    definition      Service definition
     */
    setDefinition(id:string, definition)
    {
        this.definitions.set(id, definition);
    }

    /**
     * Get a service definition
     *
     * @param   {String}        id              Service id
     * @return  {Definition}                    Service definition
     */
    getDefinition(id:string)
    {
        return this.definitions.get(id);
    }

    /**
     * Register an instantiated service
     *
     * @param   {String}        id          Service id
     * @param   {*}             service     Service instance
     * @return  {Definition}                Serice definition
     */
    register(id:string, service)
    {
        let definition = new Definition(id);
        definition.setInstance(service);

        this.definitions.set(id, definition);

        return definition;
    }

    /**
     * Get service reference
     *
     * @param   {String}    id      Service id
     * @return  {Reference}         Service reference
     */
    getReference(id:string)
    {
        let reference = new Reference(id);

        return reference;
    }

    /**
     * Add a compiler pass
     *
     * @param   {Object}    compiler    Compiler pass
     */
    addCompilerPass(compiler)
    {
        assert.strictEqual(typeof compiler.process, 'function');
        assert.strictEqual(compiler.process.constructor.name, 'GeneratorFunction');

        this.compilers.add(compiler);
    }

    /**
     * Find services ids tagged the specified name
     *
     * @param   {String}    tagName     Tag name
     * @return  {Array}                 Service ids
     */
    findTaggedServiceIds(tagName:string)
    {
        let ids = [];

        for (let [serviceId, definition] of this.definitions.entries()) {
            let tags = definition.getTags();
            let tagFound = false;
            for (let tag of tags) {
                if (tag.name && tag.name === tagName) {
                    tagFound = true;
                    break;
                }
            }

            if (tagFound) {
                ids.push(serviceId);
            }
        }

        return ids;
    }

    /**
     * Compile
     */
    *compile()
    {
        for (let compiler of this.compilers) {
            yield compiler.process(this);
        }
    }

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    get(id:string)
    {
        let definition = this.getDefinition(id);
        let instance = definition.getInstance();

        if (instance) {
            return instance;
        }

        throw new Error(`Service ${id} not found`);

    }
}
