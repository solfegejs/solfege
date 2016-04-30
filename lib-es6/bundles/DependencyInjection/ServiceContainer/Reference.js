/**
 * Service reference
 */
export default class Reference
{
    /**
     * Constructor
     *
     * @param   {String}    id  Service id
     */
    constructor(id)
    {
        this.id = id;
    }

    /**
     * Get service id
     *
     * @return  {String}        Service id
     */
    getId()
    {
        return this.id;
    }
}
