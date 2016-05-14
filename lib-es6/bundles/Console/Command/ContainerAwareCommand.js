import AbstractCommand from "./AbstractCommand";

/**
 * A container aware command
 */
export default class ContainerAwareCommand extends AbstractCommand
{
    /**
     * Set the service container
     *
     * @param   {Container}     container   Service container
     */
    setContainer(container)
    {
        this.container = container;
    }

    /**
     * Get the service container
     *
     * @return  {Container}                 Service container
     */
    getContainer()
    {
        return this.container;
    }
}
