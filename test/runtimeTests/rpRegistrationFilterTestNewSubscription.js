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
var SuiteBase = require('../framework/suite-base');

// test constants/ pre-initialized variables.
var testPrefix = 'auto-rpregistration-tests-new-sub';
var providerName = 'Microsoft.Devices';
var accountPrefix = 'testiot';
var knownNames = [];
var requiredEnvironment = [{
  name: 'AZURE_TEST_LOCATION',
  defaultValue: 'westus'
}, {
  name: 'AZURE_TEST_RESOURCE_GROUP',
  defaultValue: 'testg1012'
}
];

// the necessary clients
var IotHubManagementClient = require('../../lib/services/iothub/lib/iotHubClient');
var ResourceManagementClient = require('../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var iotHubClient;
var resourceClient;

// test variables.
var suite;
var testLocation;
var azu;
var iotHubName;
var subscriptionId;

describe('Automatic RP Registration', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      testLocation = process.env['AZURE_TEST_LOCATION'];
      testLocation = testLocation.toLowerCase().replace(/ /g, '');
      testResourceGroup = process.env['AZURE_TEST_RESOURCE_GROUP'];
      subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
      iotHubName = suite.generateId(accountPrefix, knownNames);

      let clientOptions = {
        rpRegistrationRetryTimeout: 0
      };
      if (suite.isPlayback) {
        iotHubClient = new IotHubManagementClient(suite.credentials, suite.subscriptionId, null, clientOptions);
      } else {
        iotHubClient = new IotHubManagementClient(suite.credentials, suite.subscriptionId);
      }
      resourceClient = new ResourceManagementClient(suite.credentials, suite.subscriptionId);

      if (!suite.isPlayback) {
        resourceClient.resourceGroups.createOrUpdate(testResourceGroup, { location: testLocation }, (err) => {
          should.not.exist(err);
          done();
        });
      }
      else {
        iotHubClient.longRunningOperationRetryTimeout = 0;
        done();
      }
    });
  });

  after(function (done) {
    if (!suite.isPlayback) {
      resourceClient.resourceGroups.deleteMethod(testResourceGroup, () => {
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

  it('for IotHub RP should not be registered initially', (done) => {
    resourceClient.providers.get(providerName, (err, result, request, response) => {
      should.not.exist(err);
      should.exist(result);
      result.registrationState.should.be.equal('NotRegistered');
      done();
    });
  });

  it('should automatically register IotHub RP while creating the resource', (done) => {
    // define the account to create
    var iotHubParam = {
      name: iotHubName,
      subscriptionid: subscriptionId,
      resourcegroup: testResourceGroup,
      location: testLocation,
      sku: {
        name: 'S1',
        capacity: 2
      }
    }

    iotHubClient.iotHubResource.createOrUpdate(testResourceGroup, iotHubName, iotHubParam, (err, result, request, response) => {
      should.not.exist(err);
      should.exist(result);
      should.exist(response);
      should.equal(response.statusCode, 200);
      result.name.should.be.equal(iotHubName);
      done();
    });
  });

  it('for IotHub RP should now show as registered', (done) => {
    resourceClient.providers.get(providerName, (err, result, request, response) => {
      should.not.exist(err);
      should.exist(result);
      result.registrationState.should.be.equal('Registered');
      done();
    });
  });
});