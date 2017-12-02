/* @flow */
import type Application from "../../src/Application"
import type {BundleInterface, InitializableBundleInterface} from "../../src/BundleInterface"

/**
 * Example bundle
 */
export default class Bundle implements BundleInterface, InitializableBundleInterface
{
    /**
     * Constructor
     */
    constructor():void
    {
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }

    initialize(app:Application)
    {
        app.on("start", this.onStart);
        console.log("Bundle initialized");
    }

    onStart(app:Application, parameters:Array<String> = [])
    {
        let config = app.getConfiguration();
        console.log("a:", config.get("a"));
        console.log("z:", config.get("z"));
        console.log("parameters.foo:", config.get("parameters.foo"));
    }
}
