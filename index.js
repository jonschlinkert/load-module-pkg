/*!
 * load-module-pkg <https://github.com/jonschlinkert/load-module-pkg>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var path = require('path');
var Config = require('expand-pkg');
var extend = require('extend-shallow');
var resolve = require('resolve');

module.exports = function(name, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  if (typeof cb !== 'function') {
    throw new Error('expected callback to be a function');
  }
  if (typeof name !== 'string') {
    cb(new Error('load-module-pkg expects a string.'));
    return;
  }

  var opts = extend({}, options);

  if (opts.cwd && !opts.basedir) {
    opts.basedir = path.resolve(opts.cwd);
  }

  if (name.charAt(0) !== '.' && !opts.basedir) {
    opts.basedir = process.cwd();
  }

  resolve(name, opts, function(err, modulePath, pkg) {
    if (err) {
      cb(err);
      return;
    }

    pkg.modulePath = modulePath;
    if (opts.expand !== false) {
      var config = new Config(opts);
      pkg = config.expand(pkg);
    }

    cb(null, pkg);
  });
};

module.exports.sync = function(name, options) {
  if (typeof name !== 'string') {
    throw new Error('load-module-pkg expects a string.');
  }

  var opts = extend({}, options);
  var pkg = {};

  if (!opts.basedir && opts.cwd) {
    opts.basedir = path.resolve(opts.cwd);
  }

  if (name.charAt(0) !== '.' && !opts.basedir) {
    opts.basedir = process.cwd();
  }

  opts.packageFilter = function(data, modulePath) {
    pkg = data;
    pkg.modulePath = modulePath;
    return pkg;
  };

  resolve.sync(name, opts);

  if (opts.expand !== false) {
    var config = new Config(opts);
    pkg = config.expand(pkg);
  }
  return pkg;
};
