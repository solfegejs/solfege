"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Application = require("../../kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _GeneratorUtil = require("../../utils/GeneratorUtil");

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Console bundle
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

    // Listen the application start
    this.application.on(_Application2.default.EVENT_START, (0, _GeneratorUtil.bindGenerator)(this, this.onStart));
  }

  /**
   * The application is started
   *
   * @param   {solfege/kernel/Application}    application     The application
   * @param   {Array}                         parameters      The parameters
   */
  *onStart(application, parameters) {
    yield this.displayGlobalHelp();
  }

  /**
   * Display global help
   */
  *displayGlobalHelp() {
    // Display the header
    var title = "SolfegeJS CLI";

    console.info(title.bgBlack.cyan);
    console.info("-".repeat(title.length).bgBlack.cyan + "\n");
  }
}
exports.default = Bundle;
module.exports = exports['default'];