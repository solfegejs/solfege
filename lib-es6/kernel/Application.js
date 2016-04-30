import co from "co";
import assert from "assert";
import EventEmitter from "./EventEmitter";
import {isGenerator} from "../utils/GeneratorUtil";

/**
 * An application
 */
export default class Application extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        // Initialize the bundle registry
        this.bundles = new Set();

        // Exit handler
        let bindedExitHandler = this.onExit.bind(this);
        let bindedKillHandler = this.onKill.bind(this);
        process.on('exit', bindedExitHandler);
        process.on('SIGINT', bindedKillHandler);
        process.on('SIGTERM', bindedKillHandler);
        process.on('SIGHUP', bindedKillHandler);

        // Error handler
        process.on('uncaughtException', this.onErrorUnknown.bind(this));
    }

    /**
     * Event name of the end of the bundles initialization
     *
     * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_INITALIZED
     * @default     'bundles_initialized'
     */
    static get EVENT_BUNDLES_INITIALIZED()
    {
        return "bundles_initialized";
    }

    /**
     * Event name of the end of the bundles boot
     *
     * @constant    {String} solfege.kernel.Application.EVENT_BUNDLES_BOOTED
     * @default     'bundles_booted'
     */
    static get EVENT_BUNDLES_BOOTED()
    {
        return "bundles_booted";
    }

    /**
     * Event name of the application start
     *
     * @constant    {String} solfege.kernel.Application.EVENT_START
     * @default     'start'
     */
    static get EVENT_START()
    {
        return "start";
    }

    /**
     * Event name of the application end
     *
     * @constant    {String} solfege.kernel.Application.EVENT_END
     * @default     'end'
     */
    static get EVENT_END()
    {
        return "end";
    }

    /**
     * Add a bundle to the registry
     *
     * @param   {*}     bundle  A bundle
     */
    addBundle(bundle)
    {
        // Check the validity
        assert.ok(typeof bundle.getPath, 'function', `The bundle ${bundle} must implement getPath method`);

        // Add to the registry
        this.bundles.add(bundle);
    }

    /**
     * Get bundles
     *
     * @return  {Set}           The bundles
     */
    getBundles()
    {
        return this.bundles;
    }

    /**
     * Start the application
     */
    start(...parameters)
    {
        let self = this;

        // Start the generator based flow
        co(function *()
        {
            // Initialize registered bundles
            for (let bundle of self.bundles) {
                if (!isGenerator(bundle.initialize)) {
                    continue;
                }

                yield bundle.initialize(self);
            }
            yield self.emit(Application.EVENT_BUNDLES_INITIALIZED, self);

            // Boot registered bundles
            for (let bundle of self.bundles) {
                if (!isGenerator(bundle.boot)) {
                    continue;
                }

                yield bundle.boot();
            }
            yield self.emit(Application.EVENT_BUNDLES_BOOTED, self);

            // Start the application
            yield self.emit(Application.EVENT_START, self, parameters);
        })

        // End
        .then(function*()
        {
            yield self.emit(Application.EVENT_END, self);
        })

        // Handle error
        .catch(error => {
            console.error(error.message);
            console.error(error.stack);
        });
    }

    /**
     * An unknown error occurred
     *
     * @private
     * @param   {Error}     error   Error instance
     */
    onErrorUnknown(error)
    {
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }

    /**
     * The application is stopped
     *
     * @private
     */
    onExit()
    {
        let self = this;

        co(function *()
        {
            yield self.emit(Application.EVENT_END, self);
        });
    }

    /**
     * The application is killed
     *
     * @private
     */
    onKill()
    {
        process.exit();
    }
}
