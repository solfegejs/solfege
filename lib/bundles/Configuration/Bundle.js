"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Configuration bundle
 */
class Bundle {
    /**
     * Constructor
     */
    constructor() {
        // Declare application property
        this.application;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath() {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application) {
        this.application = application;

        // Listen the end of configuration loading
        this.application.on(_Application2.default.EVENT_CONFIGURATION_LOAD, (0, _bindGenerator2.default)(this, this.onConfigurationLoad));
    }

    /**
     * The configuration is loading
     *
     * @param   {solfegejs/kernel/Application}      application     Solfege application
     * @param   {solfegejs/kernel/Configuration}    configuration   Solfege configuration
     * @param   {string}                            filePath        Configuration file path
     */
    *onConfigurationLoad(application, configuration, filePath) {
        var properties = {};

        // Parse YAML file
        try {
            properties = (0, _configYaml2.default)(filePath, { encoding: "utf8" });
        } catch (error) {
            // Unable to parse YAML file
            return;
        }

        // Add properties to configuration
        configuration.addProperties(properties);
    }
}
exports.default = Bundle;
module.exports = exports["default"];