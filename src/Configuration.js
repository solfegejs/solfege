/* @flow */

// Private properties and methods
const _resolveProperties:Symbol = Symbol();
const _merge:Symbol = Symbol();
const _store:Symbol = Symbol();

/**
 * Application configuration
 */
export default class Configuration
{
    /**
     * Store
     */
    // $FlowFixMe
    [_store]:Object;

    /**
     * Constructor
     */
    constructor():void
    {
        // $FlowFixMe
        this[_store] = {};

        // $FlowFixMe;
        this[_resolveProperties] = this[_resolveProperties].bind(this);
    }

    /**
     * Add properties
     *
     * @param   {Object}    properties  Properties
     */
    addProperties(properties:Object):void
    {
        if (properties instanceof Object === false) {
            throw new TypeError("Properties should be an object");
        }

        // $FlowFixMe
        this[_store] = this[_merge](this[_store], properties);

        for (let i:number = 0; i < 100; i++) {
            // $FlowFixMe
            let dependencyCount:number = this[_resolveProperties](this[_store]);
            if (dependencyCount === 0) {
                return;
            }
        }

        throw new Error("Recursion in configuration detected");
    }

    /**
     * Set a property
     *
     * @param   {string}    propertyName    Property name
     * @param   {*}         value           Property value
     */
    set(propertyName:string, value:*):void
    {
        const nameType:string = typeof propertyName;
        if (nameType !== "string") {
            throw new TypeError(`Property name should be a string, invalid type: ${nameType}`);
        }

        this.addProperties({[propertyName]: value});
    }

    /**
     * Get a property name from configuration
     *
     * @param   {string}    propertyName    The property name
     * @return  {*}                         The property value
     */
    get(propertyName:string):any
    {
        // Find the property value
        let propertyValue:any = undefined;
        let propertySplittedName:Array<string> = propertyName.split(".");
        // $FlowFixMe
        let property:Object = this[_store];
        for (let name:string of propertySplittedName) {
            if (typeof property !== "object" || !property.hasOwnProperty(name)) {
                return undefined;
            }
            property = property[name];
            propertyValue = property;
        }

        return propertyValue;
    }

    /**
     * Resolve a property value
     *
     * @param   {*}     value   Property value
     * @return  {*}             Resolved property value
     */
    resolvePropertyValue(value:any):any
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
            resolvedValue = value.replace(/%([^%]+)%/g, (match, propertyName):any => {
                let propertyValue = this.get(propertyName);
                if (propertyValue === undefined) {
                    return "";
                }

                return propertyValue;
            });
        }

        // Check number
        let numberCast:number = Number(resolvedValue);
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
     * @return  {number}            The dependency count
     */
    // $FlowFixMe
    [_resolveProperties](store:any):number
    {
        let dependencyCount:number = 0;

        for (let key:string in store) {
            let item = store[key];

            if (typeof item === "object") {
                let subDependencyCount:number =  this[_resolveProperties](item);
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
    propertyHasDependency(propertyValue:any):boolean
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
     * @return  {object}                    Merged properties
     */
    // $FlowFixMe
    [_merge](source:any, properties:any):any
    {
        let result;

        if (Array.isArray(properties)) {
            result = [];
            source = source || [];

            // Copy source properties
            result = result.concat(source);

            // Merge new properties
            for (let key:string in properties) {
                let index:number = parseInt(key);
                let item = properties[index];

                if (typeof result[index] === "undefined") {
                    // The index does not exist
                    result[index] = item;
                } else if (typeof item === "object") {
                    // The new property is an object
                    result[index] = this[_merge](source[index], item);
                } else if (source.indexOf(item) === -1) {
                    // The new property is not in the list
                    result.push(item);
                }
            }
        } else {
            result = {};

            // Copy source properties
            if (typeof source === "object") {
                for (let key:string in source) {
                    result[key] = source[key];
                }
            }

            // Merge new properties
            for (let key:string in properties) {
                let item = properties[key];

                if (typeof result[key] === "undefined") {
                    // The key does not exist
                    result[key] = item;
                } else if (typeof item === "object") {
                    // The new property is an object
                    result[key] = this[_merge](source[key], item);
                } else {
                    // Override value
                    result[key] = item;
                }
            }
        }

        return result;
    }

    /**
     * Get string format of the instance
     *
     * @return  {string}    String format
     */
    inspect():string
    {
        // $FlowFixMe
        let properties = this[_store];
        let output = "SolfegeJS/Configuration ";
        output += JSON.stringify(properties, null, "  ");

        return output;
    }
}
