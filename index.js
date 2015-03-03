/*!
 * load-module-pkg <https://github.com/jonschlinkert/load-module-pkg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var cwd = require('cwd');

module.exports = function (name, options) {
  if (typeof name !== 'string') {
    throw new Error('load-module-pkg expects a string.');
  }
  try {
    var fp = cwd('node_modules', name, 'package.json');
    // don't use require(), to avoid caching
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch(err) {
    if (options && options.strict) {
      throw new Error(err);
    }
  }
  return {};
};
