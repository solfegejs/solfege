import Definition from "./Definition";

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
            definition.setClassPath(configuration.class);
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
