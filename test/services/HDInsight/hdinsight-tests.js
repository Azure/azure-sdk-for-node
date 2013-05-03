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

// Test includes
var testutil = require('../../util/util');

var hdinsightutil = require('./hdinsight-util.js');

var azure = testutil.libRequire('azure');


describe('HDInsight Test', function() {
  var storageAccounts;
  var sqlServers;

  var storage1Name = "azurehdxstrtst00";
  var storage2Name = "azurehdxstrtst01";

  var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var serviceMan = azure.createServiceManagementService(subscriptionId, auth);
  var sqlMan = azure.createSqlManagementService(subscriptionId, auth);
  var hdInsight = azure.createHDInsightService(subscriptionId, auth);

  // NOTE: To Do, we should actually create new acounts for our tests
  //       So that we can work on any existing subscription.
  before (function (done) {
    serviceMan.listStorageAccounts(function (err, response) {
      should.not.exist(err);
      should.exist(response.body);
      response.body.length.should.eql(2);
      ''.should.eql(response.body);
      for(var i in response.body)
      {
       // if (response.body[i].)  
      }
      storageAccounts = response.body;

      sqlMan.listServers(function (err, response) {
        should.not.exist(err);
        should.exists(response);
        response.length.should.eql(2);
        sqlServers = response;
        done(err);
      });
    });
  });


  it('should run tests', function (done) {
    var result;
    storageAccounts.length.should.eql(2);
    done();
  });

  it('should list storage accounts', function (done) {
    var result;

    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);

      response.length.should.eql(2);
      done(err);
    });
  });

});
