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
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');
var DevTestLabsClient = require('../../../lib/services/devTestLabs/lib/devTestLabsClient');
var testPrefix = 'devTestLabs-tests';

describe('DevTestLabs', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix);
    suite.setupSuite(function () {
      client = new DevTestLabsClient(suite.credentials, suite.subscriptionId);
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      done();
    });
  });
  
  after(function (done) {
    suite.teardownSuite(done);
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });
  
  describe('Get Lab', function () {
    it('should get integration lab successfully', function (done) {
        client.labs.get('KeepIntegrationTestResources', 'LabForIntegration', null, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.location.should.equal('Southeast Asia');
        result.id.should.match(/\/subscriptions\/.*\/resourceGroups\/.*\/providers\/Microsoft.DevTestLab\/labs\/.*/ig);
        response.statusCode.should.equal(200);
        done();
      });
    });    
  });  
});