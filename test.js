/*!
 * load-module-pkg <https://github.com/jonschlinkert/load-module-pkg>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var writeJson = require('write-json');
var typeOf = require('kind-of');
var assert = require('assert');
var load = require('./');

describe('load-module-pkg', function() {
  describe('async', function() {
    it('should throw when callback is missing', function() {
      assert.throws(function() {
        load();
      }, /expect/);
    });

    it('should return errors in the callback', function(cb) {
      load('fofofofoofofofofof', function(err, pkg) {
        assert(err);
        cb();
      });
    });

    it('should load the package.json from the working directory', function(cb) {
      load('.', function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'load-module-pkg');
        cb();
      });
    });

    it('should load the package.json for the named module:', function(cb) {
      load('mocha', function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'mocha');
        cb();
      });
    });

    it('should expand data by default', function(cb) {
      load('mocha', function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }
        writeJson.sync('fixtures/expanded.json', pkg);
        assert.equal(pkg.href, 'https://github.com/mochajs/mocha');
        cb();
      });
    });

    it('should not expand data when disabled', function(cb) {
      load('mocha', {expand: false}, function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }
        writeJson.sync('fixtures/unexpanded.json', pkg);
        assert.equal(typeof pkg.href, 'undefined');
        cb();
      });
    });

    it('should load a package.json from options.basedir', function(cb) {
      load('.', {basedir: 'fixtures/one'}, function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'one');
        cb();
      });
    });

    it('should load a package.json from options.cwd', function(cb) {
      load('.', {cwd: 'fixtures/one'}, function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'one');
        cb();
      });
    });

    it('should load a package.json from a file path', function(cb) {
      load('./fixtures/one', function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'one');
        cb();
      });
    });

    it('should load a package.json from the given cwd', function(cb) {
      load('.', {cwd: 'fixtures/one'}, function(err, pkg) {
        if (err) {
          cb(err);
          return;
        }

        assert.equal(typeOf(pkg), 'object');
        assert.equal(pkg.name, 'one');
        cb();
      });
    });
  });

  describe('sync', function() {
    it('should load the package.json for the named module:', function() {
      assert.equal(load.sync('mocha').name, 'mocha');
    });

    it('should load the package.json from the current cwd:', function() {
      assert.equal(load.sync('.').name, 'load-module-pkg');
    });

    it('should load the package.json from the given cwd:', function() {
      assert.equal(load.sync('.', {cwd: 'fixtures'}).name, 'foo');
      assert.equal(load.sync('./fixtures').name, 'foo');
      assert.equal(load.sync('./fixtures/one').name, 'one');
      assert.equal(load.sync('./one', {cwd: 'fixtures'}).name, 'one');
    });

    it('should expand package data by default', function() {
      var pkg = load.sync('./one', {cwd: 'fixtures'});
      assert.equal(pkg.href, 'https://github.com/jonschlinkert/one');
    });

    it('should not expand package data when disabled', function() {
      var pkg = load.sync('./one', {cwd: 'fixtures', expand: false});
      assert.equal(typeof pkg.href, 'undefined');
    });

    it('should throw an error on bad args:', function() {
      assert.throws(function() {
        load.sync();
      }, /expect/);
    });
  });
});
