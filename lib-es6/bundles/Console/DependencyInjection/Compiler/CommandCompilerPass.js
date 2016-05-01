/**
 * Compiler pass for the service container
 * It handles tags to register console commands
 */
export default class CommandCompilerPass
{
    /**
     * Process the tags
     *
     * @param   {Container}     container   Service container
     */
    *process(container)
    {
        let definition = container.getDefinition("solfege_console_commands_registry");

        let serviceIds = container.findTaggedServiceIds("solfege.console.command");
        for (let serviceId of serviceIds) {
            let reference = container.getReference(serviceId);
            definition.addMethodCall("addCommand", [reference]);
        }
    }
}
