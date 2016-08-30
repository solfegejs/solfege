/**
 * Configuration property
 */
export default class ConfigurationProperty
{
    /**
     * Constructor
     *
     * @param   {string}    name    Property name
     */
    constructor(name)
    {
        this.name = name;
    }

    /**
     * Get property name
     *
     * @return  {string}            Property name
     */
    getName()
    {
        return this.name;
    }
}
