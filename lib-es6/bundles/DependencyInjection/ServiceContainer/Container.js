import assert from "assert";
import Reflect from "harmony-reflect";
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
        this.compiled = false;
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
        let definition = this.definitions.get(id);
        assert.ok(definition instanceof Definition, `Service definition not found: ${id}`);

        return definition;
    }

    /**
     * Get service definitions
     *
     * @return  {Map}       Definitions
     */
    getDefinitions()
    {
        return this.definitions;
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
        // The container is compiled only once
        if (this.compiled) {
            return;
        }

        // Process each compiler pass
        for (let compiler of this.compilers) {
            yield compiler.process(this);
        }

        // The container is compiled
        this.compiled = true;
    }

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    *get(id:string)
    {
        // The container must be compiled
        assert.ok(this.compiled, `Unable to get service "${id}", the container is not compiled`);

        // Get the definition
        let definition = this.getDefinition(id);

        // Get the instance if it exists
        let instance = definition.getInstance();
        if (instance) {
            return instance;
        }

        // Build the instance
        instance = yield this.buildInstance(definition);
        return instance;
    }


    /**
     * Get service class path
     *
     * @param   {String}        id          Service id
     * @return  {String}                    Service class path
     */
    *getServiceClassPath(id:string)
    {
        // The container must be compiled
        assert.ok(this.compiled, `Unable to get service "${id}", the container is not compiled`);

        // Get the definition
        let definition = this.getDefinition(id);

        return yield this.getDefinitionClassPath(definition);
    }

    /**
     * Get definition class path
     *
     * @param   {Definition}    definition  Service definition
     * @return  {String}                    Service class path
     */
    *getDefinitionClassPath(definition:Definition)
    {
        let classPath = definition.getClassPath();

        if (classPath) {
            return classPath;
        }

        let classReference = definition.getClassReference();
        if (classReference instanceof Reference) {
            let classServiceId = classReference.getId();
            let classDefinition = this.getDefinition(classServiceId);
            classPath = yield this.getDefinitionClassPath(classDefinition);
        }

        return classPath;
    }

    /**
     * Build definition instance
     *
     * @param   {Definition}    definition      Service definition
     * @return  {*}                             Service instance
     */
    *buildInstance(definition:Definition)
    {
        let classPath = yield this.getDefinitionClassPath(definition);
        let classArguments = definition.getArguments();

        // Resolve arguments
        let classArgumentsResolved = [];
        for (let classArgument of classArguments) {
            let classArgumentResolved = yield this.resolveParameter(classArgument);
            classArgumentsResolved.push(classArgumentResolved);
        }

        // Instantiate
        let instance;
        try {
            let classObject = require(classPath);
            instance = Reflect.construct(classObject, classArgumentsResolved);
        } catch (error) {
            throw new Error(`Unable to instantiate service "${classPath}": ${error.message}`);
        }

        // Call methods
        let methodCalls = definition.getMethodCalls();
        for (let methodCall of methodCalls) {
            let {name, parameters} = methodCall;
            let method = instance[name];

            assert.strictEqual(typeof method, "function", `Method "${name}" not found in ${classPath}`);

            // Resolve parameters
            let parametersResolved = []
            for (let parameter of parameters) {
                let parameterResolved = yield this.resolveParameter(parameter);
                parametersResolved.push(parameterResolved);
            }

            // Call the method
            method.apply(instance, parametersResolved);
        }

        return instance;
    }

    /**
     * Resolve a parameter
     *
     * @param   {*}     parameter   The parameter
     * @return  {*}                 The resolved parameter
     */
    *resolveParameter(parameter)
    {
        if (parameter instanceof Reference) {
            let serviceId = parameter.getId();
            let service = yield this.get(serviceId);
            return service;
        }

        return parameter;
    }
}
