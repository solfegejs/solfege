import Definition from "./Definition";
import Reference from "./Reference";

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

        // Factory method
        if (Array.isArray(configuration.factory) && configuration.factory.length === 2) {
            let factoryServiceClass = configuration.factory[0];
            let factoryMethodName = configuration.factory[1];

            if (factoryServiceClass[0] !== "@") {
                throw new Error(`Factory class must be a service: ${factoryServiceClass}`);
            }

            let factoryServiceReference = new Reference(factoryServiceClass.substr(1));
            definition.setFactory(factoryServiceReference, factoryMethodName);
        }

        // Arguments for class constructor or factory method
        if (configuration.arguments) {
            for (let argument of configuration.arguments) {
                // The argument is a service reference
                if (argument[0] === "@") {
                    let referenceArgument = new Reference(argument.substr(1));
                    definition.addArgument(referenceArgument);
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
