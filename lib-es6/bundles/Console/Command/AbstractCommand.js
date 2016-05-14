/**
 * An abstract command
 */
export default class AbstractCommand
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.name = null;
        this.description = "";
    }

    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName()
    {
        return this.name;
    }

    /**
     * Set command name
     *
     * @param   {string}    name    Command name
     */
    setName(name:string)
    {
        this.name = name;
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription()
    {
        return this.description;
    }

    /**
     * Set command description
     *
     * @param   {string}    description     Command description
     */
    setDescription(description:string)
    {
        this.description = description;
    }

    /**
     * Condigure command
     */
    *configure()
    {
    }

    /**
     * Execute the command
     */
    *execute()
    {
    }
}
