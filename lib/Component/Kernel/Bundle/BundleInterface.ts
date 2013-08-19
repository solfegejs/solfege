import CommandInterface = module('../../Console/Command/CommandInterface');

/**
 * Interface of a bundle
 *
 * @namespace Component.Kernel.Bundle
 * @interface BundleInterface
 */
interface BundleInterface
{
    /**
     * Get the commands for the CLI
     *
     * @return  {Array}     The command list
     */
    getConsoleCommands():CommandInterface[];
}

export = BundleInterface;