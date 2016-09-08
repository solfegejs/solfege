import Reference from "./Reference";

/**
 * Service definition
 */
export default class Definition
{
    /**
     * Constructor
     *
     * @param   {String}    id      Service id
     */
    constructor(id:string)
    {
        // Initialize properties
        this.id = id;
        this.instance;
        this.classPath;
        this.classReference;
        this.factoryServiceReference;
        this.factoryMethodName;
        this.arguments = new Set();
        this.tags = new Set();
        this.methodCalls = new Set();
    }

    /**
     * Get service id
     *
     * @return  {String}            Service id
     */
    getId()
    {
        return this.id;
    }

    /**
     * Set the instance
     *
     * @param   {*}     service     Service instance
     */
    setInstance(service)
    {
        this.instance = service;
    }

    /**
     * Get the instance
     *
     * @return  {*}                 Service instance
     */
    getInstance()
    {
        return this.instance;
    }

    /**
     * Set class path
     *
     * @param   {String}    path    Class path
     */
    setClassPath(path:string)
    {
        this.classPath = path;
    }

    /**
     * Get class path
     *
     * @return  {String}            Class path
     */
    getClassPath()
    {
        return this.classPath;
    }

    /**
     * Set class reference
     *
     * @param   {Reference}     reference       Class reference
     */
    setClassReference(reference:Reference)
    {
        this.classReference = reference;
    }

    /**
     * Get class reference
     *
     * @return  {Reference}                     Class reference
     */
    getClassReference()
    {
        return this.classReference;
    }

    /**
     * Set factory method
     *
     * @param   {Reference}     serviceReference    Service reference
     * @param   {string}        methodName          Method name
     */
    setFactory(serviceReference:Reference, methodName:string)
    {
        this.factoryServiceReference = serviceReference;
        this.factoryMethodName = methodName;
    }

    /**
     * Get factory service reference
     *
     * @return  {Reference}     Service reference
     */
    getFactoryServiceReference()
    {
        return this.factoryServiceReference;
    }

    /**
     * Get factory method name
     *
     * @return  {string}        Method name
     */
    getFactoryMethodName()
    {
        return this.factoryMethodName;
    }

    /**
     * Add constructor argument
     *
     * @param   {*}     argument    Class constructor argument
     */
    addArgument(argument)
    {
        this.arguments.add(argument);
    }

    /**
     * Get constructor arguments
     *
     * @return  {Set}               Class constructor arguments
     */
    getArguments()
    {
        return this.arguments;
    }

    /**
     * Add tag
     *
     * @param   {Object}    tag     Tag
     */
    addTag(tag)
    {
        this.tags.add(tag);
    }

    /**
     * Get tags
     *
     * @return  {Set}               Tags
     */
    getTags()
    {
        return this.tags;
    }

    /**
     * Add a method call
     *
     * @param   {String}    name        Method name
     * @param   {Array}     parameters  Method parameters
     */
    addMethodCall(name, parameters:Array = [])
    {
        this.methodCalls.add({
            name: name,
            parameters: parameters
        });
    }

    /**
     * Get method calls
     *
     * @return  {Set}                   Method calls
     */
    getMethodCalls()
    {
        return this.methodCalls;
    }
}
