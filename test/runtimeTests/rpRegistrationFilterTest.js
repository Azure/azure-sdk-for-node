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

// all the requires
var should = require('should');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../framework/suite-base');

// test constants/ pre-initialized variables.
var testPrefix = 'auto-rpregistration-tests';
var accountPrefix = 'xplattestadls';
var providerName = 'Microsoft.DatalakeStore';
var knownNames = [];
var requiredEnvironment = [{
  name: 'AZURE_TEST_LOCATION',
  defaultValue: 'East US 2'
}, {
  name: 'AZURE_TEST_RESOURCE_GROUP',
  defaultValue: 'xplattestadlsrg01'
}
];

// the necessary clients
var DataLakeStoreAccountManagementClient = require('../../lib/services/datalake.Store/lib/account/dataLakeStoreAccountManagementClient');
var ResourceManagementClient = require('../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var adlsClient;
var adlsFileSystemClient;
var resourceClient;

// test variables.
var suite;
var testLocation;
var testResourceGroup;
var secondResourceGroup;

var accountName;

describe('Automatic RP Registration', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      testLocation = process.env['AZURE_TEST_LOCATION'];
      testLocation = testLocation.toLowerCase().replace(/ /g, '');
      testResourceGroup = process.env['AZURE_TEST_RESOURCE_GROUP'];
      accountName = suite.generateId(accountPrefix, knownNames);

      let clientOptions = {
        rpRegistrationRetryTimeout: 0
      };
      if (suite.isPlayback) {
        adlsClient = new DataLakeStoreAccountManagementClient(suite.credentials, suite.subscriptionId, null, clientOptions);
      } else {
        adlsClient = new DataLakeStoreAccountManagementClient(suite.credentials, suite.subscriptionId);
      }
      resourceClient = new ResourceManagementClient(suite.credentials, suite.subscriptionId);

      // construct all of the parameter objects
      var adlsAccount = {
        location: testLocation
      };

      if (!suite.isPlayback) {
        resourceClient.resourceGroups.createOrUpdate(testResourceGroup, { location: testLocation }, function (err) {
          should.not.exist(err);
          done();
        });
      }
      else {
        adlsClient.longRunningOperationRetryTimeout = 0;
        done();
      }
    });
  });

  after(function (done) {
    if (!suite.isPlayback) {
      resourceClient.resourceGroups.deleteMethod(testResourceGroup, function () {
        suite.teardownSuite(done);
      });
    }
    else {
      suite.teardownSuite(done);
    }
  });

  beforeEach(function (done) {
    suite.setupTest(done);
  });

  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  it('for DatalakeStore RP should not be registered initially', function (done) {
    resourceClient.providers.get(providerName, (err, result, request, response) => {
      should.not.exist(err);
      should.exist(result);
      result.registrationState.should.be.equal('Unregistered');
      done();
    });
  });

  it('should automatically register RP while creating account', function (done) {
    // define the account to create
    var accountToCreate = {
      tags: {
        testtag1: 'testvalue1',
        testtag2: 'testvalue2'
      },
      location: testLocation
    };

    adlsClient.accounts.create(testResourceGroup, accountName, accountToCreate, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      result.name.should.be.equal(accountName);
      Object.keys(result.tags).length.should.be.equal(2);
      done();
    });
  });

  it('for DatalakeStore RP should now show as registered', function (done) {
    resourceClient.providers.get(providerName, (err, result, request, response) => {
      should.not.exist(err);
      should.exist(result);
      result.registrationState.should.be.equal('Registered');
      done();
    });
  });
});