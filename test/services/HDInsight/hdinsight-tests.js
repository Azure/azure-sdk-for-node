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

var assert = require('assert');
var mocha = require('mocha');
var should = require('should');
var sinon = require('sinon');

// Test includes
var testutil = require('../../util/util');

var HDInsightUtil = require('./PerformRequestStubUtil.js');

var azure = testutil.libRequire('azure');
var hdInsightUtil;

describe('HDInsight Test', function() {
  var storageAccounts;
  var sqlServers;

  var storage1Name = "azurehdxstrtst00";
  var storage2Name = "azurehdxstrtst01";
  var foundStorage1 = false;
  var foundStorage2 = false;

  var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var serviceMan = azure.createServiceManagementService(subscriptionId, auth);
  var sqlMan = azure.createSqlManagementService(subscriptionId, auth);
  var hdInsight = azure.createHDInsightService(subscriptionId, auth);

  var _performRequestSpy;
  var _performRequestOriginal;

  beforeEach(function (done) {
    done();
  });

  afterEach(function (done) {
    done();
  });

  after(function (done) {
    done();
  });

  before (function (done) {
    done();
  });


  it('should be able to list clusters', function (done) {
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.CloudServices);
      should.exist(response.body.CloudServices.CloudService);
      response.body.CloudServices.CloudService.length.should.be.above(0);
      done(err);
    });
  });

});
