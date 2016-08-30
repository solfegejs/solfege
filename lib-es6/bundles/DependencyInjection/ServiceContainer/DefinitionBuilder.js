import Definition from "./Definition";
import Reference from "./Reference";
import ConfigurationProperty from "./ConfigurationProperty";

/**
 * Definition builder
 */
export default class DefinitionBuilder
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Build a definition from configuration
     *
     * @param   {String}        serviceId       Service id
     * @param   {Object}        configuration   Configuration
     * @return  {Definition}                    Service definition
     */
    build(serviceId:string, configuration)
    {
        let definition = new Definition(serviceId);

        // Class file path
        if (configuration.class) {
            if (configuration.class[0] === "@") {
                let classReference = new Reference(configuration.class.substr(1));
                definition.setClassReference(classReference);
            } else {
                definition.setClassPath(configuration.class);
            }
        }

        // Class arguments
        if (configuration.arguments) {
            for (let argument of configuration.arguments) {
                // The argument is a service reference
                if (argument[0] === "@") {
                    let referenceArgument = new Reference(argument.substr(1));
                    definition.addArgument(referenceArgument);
                    continue;
                }

                // The argument is a configuration property
                if (argument[0] === "%") {
                    let configurationArgument = new ConfigurationProperty(argument.substr(1));
                    definition.addArgument(configurationArgument);
                    continue;
                }

                // The argument is a string
                definition.addArgument(argument);
            }
        }

        // Tags
        if (Array.isArray(configuration.tags)) {
            for (let tag of configuration.tags) {
                definition.addTag(tag);
            }
        }


        return definition;
    }
}
