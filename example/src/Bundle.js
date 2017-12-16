/* @flow */
import type Application from "solfegejs-application/src/Application"
import type {BundleInterface, InitializableBundleInterface} from "solfegejs-application/src/BundleInterface"

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
    }

    onStart(app:Application, parameters:Array<String> = [])
    {
        console.log("started");
    }
}
