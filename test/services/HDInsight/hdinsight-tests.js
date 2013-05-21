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
var HDInsightTestUtils = require('./hdinsight-test-utils.js')

// Test includes
var testutil = require('../../util/util');

var HDInsightUtil = require('./PerformRequestStubUtil.js');

var azure = testutil.libRequire('azure');
var hdInsightUtil;

describe('HDInsight Test', function() {
  var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var hdInsight;
  var hdinsightTestUtils = new HDInsightTestUtils();
  var creds;

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
    hdinsightTestUtils.getTestCredentialData(function (result) {
      should.exist(result);
      creds = result;
      hdInsight = azure.createHDInsightService(creds["default"].subscriptionId, auth);
      done();
    });
  });

  it('should be able to create a cluster', function (done) {
    var cred = creds["default"];
    var clusterCreationObject = {
      name : 'tistocks-jstest2',
      location : 'East US',
      defaultStorageAccountName : cred.defaultStorageAccount.name,
      defaultStorageAccountKey : cred.defaultStorageAccount.key,
      defaultStorageContainer : cred.defaultStorageAccount.container,
      user : cred.user,
      password : creds.password,
      nodes : 4,
      additionalStorageAccounts : [{
        name : cred.additionalStorageAccounts[0].name,
        key : cred.additionalStorageAccounts[0].key
      }],
      oozieMetastore : {
        server : cred.oozieStores[0].server,
        database : cred.oozieStores[0].database,
        user : cred.oozieStores[0].user,
        password : cred.oozieStores[0].password
      },
      hiveMetastore : {
        server : cred.hiveStores[0].server,
        database : cred.hiveStores[0].database,
        user : cred.hiveStores[0].user,
        password : cred.hiveStores[0].password
      }
    };
    hdInsight.createCluster(clusterCreationObject, function (err, response) {
      done(err);
    });
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
