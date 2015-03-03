/*!
 * load-module-pkg <https://github.com/jonschlinkert/load-module-pkg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var pkg = require('./');
require('should');

it('should load the package.json for the named module:', function () {
  pkg('mocha').should.have.property('name', 'mocha');
});

it('should throw an error on bad args:', function () {
  (function () {
    pkg();
  }).should.throw('load-module-pkg expects a string.');
});

it('should not throw an error when `options.strict` is not defined:', function () {
  (function () {
    pkg('foo');
  }).should.not.throw();
});

it('should throw an error when `options.strict` is defined:', function () {
  (function () {
    pkg('foo', {strict: true});
  }).should.be.an.instanceof.Error;
});
