//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

var should = require('should');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var TokenCloudCredentials = azure.TokenCloudCredentials;

var dummySubscription = '97e5d94b-1609-4049-89c8-5f5a5e1cd2ea';
var dummyToken = 'A-dummy-access-token';
var fakeScheme = 'fake-auth-scheme';

describe('Token credentials', function () {
  describe('usage', function () {
    it('should set auth header with bearer scheme in request', function (done) {
      var creds = new TokenCloudCredentials({token: dummyToken, subscriptionId: dummySubscription});
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^Bearer\\s+' + dummyToken + '$'));
        done();
      });
    });

    it('should set auth header with custom scheme in request', function (done) {
      var creds = new TokenCloudCredentials({token: dummyToken, subscriptionId: dummySubscription, authorizationScheme: fakeScheme});
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^' + fakeScheme + '\\s+' + dummyToken + '$'));
        done();
      });

    });
  });

  describe('construction', function () {

    it('should succeed with token and subscription', function () {
      (function () {
        new TokenCloudCredentials({token: dummyToken, subscriptionId: dummySubscription});
      }).should.not.throw();
    });

    it('should fail without credential', function () {
      (function () {
        new TokenCloudCredentials();
      }).should.throw();
    });

    it('should fail without token', function () {
      (function () {
        new TokenCloudCredentials({subscriptionId: dummySubscription});
      }).should.throw();
    });

    it('should fail without subscription id', function () {
      (function () {
        new TokenCloudCredentials({token: dummyToken});
      }).should.throw();
    });
  });
});
