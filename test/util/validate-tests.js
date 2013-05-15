/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var should = require('should');

var testutil = require('./util');
var azure = testutil.libRequire('azure');
var Validate = azure.Validate;

suite('servicesettings-tests', function () {
  describe('isValidUri', function () {
    it('should work', function () {
      Validate.isValidUri('http://www.microsoft.com').should.be.ok;
      Validate.isValidUri('http://www.microsoft.com').should.equal(true);

      (function() {
        Validate.isValidUri('something');
      }).should.throw('The provided URI "something" is invalid.');
    });
  });

  describe('isBase64Encoded', function () {
    it('should work', function () {
      Validate.isBase64Encoded('AhlzsbLRkjfwObuqff3xrhB2yWJNh1EMptmcmxFJ6fvPTVX3PZXwrG2YtYWf5DPMVgNsteKStM5iBLlknYFVoA==').should.be.ok;

      var key = '__A&*INVALID-@Key';
      (function() {
        Validate.isBase64Encoded(key);
      }).should.throw('The provided account key ' + key + ' is not a valid base64 string.');
    });
  });

  describe('Namespace validation', function () {
    it('should pass on valid name', function() {
      (function() { Validate.namespaceNameIsValid('aValidNamespace'); })
        .should.not.throw();
    });

    it('should fail if name is too short', function () {
      (function() { Validate.namespaceNameIsValid("a"); })  
        .should.throw(/6 to 50/);
    });

    it('should fail if name is too long', function () {
      (function () { Validate.namespaceNameIsValid('sbm12345678901234567890123456789012345678901234567890'); })
        .should.throw(/6 to 50/);
    });

    it("should fail if name doesn't start with a letter", function () {
      (function () { Validate.namespaceNameIsValid('!notALetter'); })
        .should.throw(/start with a letter/);
    });

    it('should fail if ends with illegal ending', function () {
      (function () { Validate.namespaceNameIsValid('namespace-'); } )
        .should.throw(/may not end with/);

      (function () { Validate.namespaceNameIsValid('namespace-sb'); })
        .should.throw(/may not end with/);

      (function () { Validate.namespaceNameIsValid('namespace-mgmt'); })
        .should.throw(/may not end with/);

      (function () { Validate.namespaceNameIsValid('namespace-cache'); })
        .should.throw(/may not end with/);

      (function () { Validate.namespaceNameIsValid('namespace-appfabric'); })
        .should.throw(/may not end with/);
    });
  });
});