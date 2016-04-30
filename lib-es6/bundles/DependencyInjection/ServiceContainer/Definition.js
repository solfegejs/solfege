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
        this.class;
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
    setClass(path:string)
    {
        this.class = path;
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
