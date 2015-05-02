/**
 * @namespace solfege.kernel
 */

import {createPackage} from '../util/ObjectProxy';

let currentPackage = createPackage(__dirname);

module.exports = currentPackage;
