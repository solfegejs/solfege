/**
 * @namespace solfege.util
 */

import {createPackage} from './ObjectProxy';

var currentPackage = createPackage(__dirname);

module.exports = currentPackage;
