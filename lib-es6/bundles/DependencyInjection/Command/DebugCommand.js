import colors from "colors";
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand";

/**
 * Debug command
 */
export default class DebugCommand extends ContainerAwareCommand
{
    /**
     * Configure command
     */
    *configure()
    {
        this.setName("dependency-injection:debug");
        this.setDescription("Debug dependency injection");
    }

    /**
     * Execute the command
     */
    *execute()
    {
        let container = this.getContainer();
        let definitions = container.getDefinitions();

        console.info("Services".yellow);
        console.info("========".yellow);
        console.info("");
        for (let [id, definition] of definitions) {
            console.info("ID   : ".green + `${definition.getId()}`.bgBlack.cyan);
            console.info("Class: ".green + definition.getClassPath());
            console.info("");
        }
    }
}
