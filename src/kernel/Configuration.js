import nodePath from "path";

/**
 * Application configuration
 */
export default class Configuration
{
    /**
     * Constructor
     */
    constructor()
    {
        this.directoryPath;

        this.store = {};
    }

    /**
     * Set the directory path of the configuration
     *
     * @param   {string}    path    Directory path
     */
    setDirectoryPath(path:string)
    {
        this.directoryPath = path;
    }

    /**
     * Get the directory path of the configuration
     *
     * @return  {string}    Directory path
     */
    getDirectoryPath()
    {
        return this.directoryPath;
    }

    /**
     * Add properties
     *
     * @param   {object}    properties  Properties
     */
    addProperties(properties)
    {
        this.store = this.merge(this.store, properties);

        let iterationCount = 0;
        while (true) {
            iterationCount++;
            if (iterationCount > 100) {
                throw new Error("Recursion in configuration detected");
            }

            let dependencyCount = this.resolveProperties(this.store);
            if (dependencyCount === 0) {
                break;
            }
        }
    }

    /**
     * Get a property name from configuration
     *
     * @param   {string}    propertyName    The property name
     * @return  {*}                         The property value
     */
    get(propertyName:string)
    {
        // Defined properties
        switch (propertyName) {
            // Directory path of the configuration file
            case "configuration_directory_path":
                return this.getDirectoryPath();

            // Directory path of the main file
            case "main_directory_path":
                return nodePath.dirname(require.main.filename);
        }

        // Find the property value
        let propertyValue = undefined;
        let propertySplittedName = propertyName.split(".");
        let property = this.store;
        for (let name of propertySplittedName) {
            if (typeof property !== "object" || !property.hasOwnProperty(name)) {
                console.error(`Property not found: ${propertyName}`);
                return undefined;
            }
            property = property[name];
            propertyValue = property;
        }

        return propertyValue;
        //return this.resolvePropertyValue(propertyValue);
    }

    /**
     * Resolve a property value
     *
     * @param   {*}     value   Property value
     */
    resolvePropertyValue(value)
    {
        if (typeof value !== "string") {
            return value;
        }

        // If the value contains only 1 property, then I replace it with the property value
        // Otherwise, the value stays a string and the properties are replaced
        let resolvedValue;
        let singlePropertyMatched = value.match(/^%([^%]+)%$/);
        if (Array.isArray(singlePropertyMatched)) {
            let propertyName = singlePropertyMatched[1];
            resolvedValue = this.get(propertyName);
        } else {
            resolvedValue = value.replace(/%([^%]+)%/g, (match, propertyName) => {
                let propertyValue = this.get(propertyName);
                if (propertyValue === undefined) {
                    return "";
                }

                return propertyValue;
            });
        }

        // Check number
        let numberCast = Number(resolvedValue);
        if (numberCast == resolvedValue) {
            return numberCast;
        }

        return resolvedValue;
    }

    /**
     * Resolve properties in a store
     *
     * @private
     * @param   {*}         store   The store (array or object)
     * @return  {uint32}            The dependency count
     */
    resolveProperties(store)
    {
        if (!Array.isArray(store) && typeof store !== "object") {
            return 0;
        }

        let dependencyCount = 0;

        for (let key in store) {
            let item = store[key];

            if (typeof item === "object") {
                let subDependencyCount =  this.resolveProperties(item);
                dependencyCount += subDependencyCount;
                continue;
            }

            let resolvedValue = this.resolvePropertyValue(item);
            if (this.propertyHasDependency(resolvedValue)) {
                dependencyCount++;
            } else {
                store[key] = resolvedValue;
            }
        }

        return dependencyCount;
    }

    /**
     * Indicates that a property value has dependency with another property
     *
     * @param   {*}         propertyValue   PropertyValue
     * @return  {boolean}                   true if the value has dependency, false otherwise
     */
    propertyHasDependency(propertyValue)
    {
        if (typeof propertyValue !== "string") {
            return false;
        }

        let dependentPropertyNames = propertyValue.match(/%[^%]+%/g);
        if (!Array.isArray(dependentPropertyNames)) {
            return false;
        }

        return true;
    }

    /**
     * Merge properties
     *
     * @private
     * @param   {object}    source          Source properties
     * @param   {object}    properties      New properties
     */
    merge(source, properties)
    {
        let result;

        if (Array.isArray(properties)) {
            result = [];
            source = source || [];

            // Copy source properties
            result = result.concat(source);

            // Merge new properties
            for (let index in properties) {
                let item = properties[index];

                if (typeof result[index] === "undefined") {
                    // The index does not exist
                    result[index] = item;
                } else if (typeof item === "object") {
                    // The new property is an object
                    result[index] = this.merge(source[index], item);
                } else if (source.indexOf(item) === -1) {
                    // The new property is not in the list
                    result.push(item);
                }
            }
        } else {
            result = {};

            // Copy source properties
            if (typeof source === "object") {
                for (let key in source) {
                    result[key] = source[key];
                }
            }

            // Merge new properties
            for (let key in properties) {
                let item = properties[key];

                if (typeof result[key] === "undefined") {
                    // The key does not exist
                    result[key] = item;
                } else if (typeof item === "object") {
                    // The new property is an object
                    result[key] = this.merge(source[key], item);
                } else {
                    // Override value
                    result[key] = item;
                }
            }
        }

        return result;
    }
}
