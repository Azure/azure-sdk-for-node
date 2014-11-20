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

var mocha = require('mocha');
var sinon = require('sinon');
var should = require('should');
var _ = require('underscore');
var HDInsightTestUtils = require('../../framework/hdinsight-test-utils');
var azureUtil = require('azure-common').util;
var uuid = require('node-uuid');
var Validate = require('azure-common').validate;

// Test includes
var testutil = require('../../util/util');

var PerformRequestStubUtil = require('./PerformRequestStubUtil');
var HDInsightTestUtils = require('../../framework/hdinsight-test-utils');

var azure = testutil.libRequire('azure');
var performRequestStubUtil;

describe('HDInsight createCluster (under unit test)', function() {
  var HDInsight = require('azure-mgmt-hdinsight').HDInsightService;
  var hdInsight;
  var hdInsightTestUtils;

  beforeEach(function (done) {
    performRequestStubUtil.NoStubProcessRequest();
    done();
  });

  afterEach(function (done) {
    performRequestStubUtil.NoStubProcessRequest();
    done();
  });

  after(function (done) {
    performRequestStubUtil.Revert();
    done();
  });

  // NOTE: To Do, we should actually create new acounts for our tests
  //       So that we can work on any existing subscription.
  before (function (done) {
    performRequestStubUtil = new PerformRequestStubUtil(HDInsight);
    hdInsightTestUtils = new HDInsightTestUtils(function () {
      hdInsight = hdInsightTestUtils.getHDInsight();
      done();
    });
  });

  it('should pass the error to the callback function', function(done) {
    performRequestStubUtil.StubAuthenticationFailed('http://test.com');
    var clusterCreationObject = hdInsightTestUtils.getDefaultWithAsvAndMetastores();
    hdInsight.createCluster(clusterCreationObject, function (err, response) {
      should.exist(err);
      response.statusCode.should.be.eql(403);
      done();
    });
  });

  it('should provide the right headers for the request', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', {});
    var clusterCreationObject = hdInsightTestUtils.getDefaultWithAsvAndMetastores();
    hdInsight.createCluster(clusterCreationObject, function (err) {
      var webResource = performRequestStubUtil.GetLastWebResource();
      should.exist(webResource);
      var regionCloudServiceName = azureUtil.getNameSpace(hdInsightTestUtils.getSubscriptionId(), 'hdinsight' , 'East US');
      webResource.path.should.be.eql('/' + hdInsightTestUtils.getSubscriptionId() + '/cloudservices/' + regionCloudServiceName + '/resources/hdinsight/containers/' + clusterCreationObject.name);
      webResource.method.should.be.eql('PUT');
      _.size(webResource.headers).should.be.eql(2);
      webResource.headers['x-ms-version'].should.be.eql('2011-08-18');
      webResource.headers['accept'].should.be.eql('application/xml');
      done(err);
    });
  });

  it('should pass the correct locate to getNameSpace', function(done) {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'Botamazu',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
    };
    should.exist(azureUtil);
    should.exist(azureUtil.getNameSpace);
    should.exist(azureUtil);
    var actualLocation = 'unspecified';
    var spy = sinon.spy(azureUtil, 'getNameSpace');
    hdInsight.createCluster(clusterCreationObject, function(err, response) {
      spy.restore();
      spy.lastCall.args[2].should.be.eql(clusterCreationObject.location);
      done(null);
    });
  });

  it('should validate the name field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {};
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [name] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the name field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [name] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the location field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [location] field is required when creating a cluster and must be a string');
    }
  })

  it('should validate the location field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [location] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageAccountName field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageAccountName] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageAccountName field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageAccountName] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageAccountKey field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageAccountKey] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageAccountKey field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageAccountKey] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageContainer field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageContainer] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageContainer field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageContainer] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the defaultStorageContainer field is not invalid', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'INVLAID'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [defaultStorageContainer] field is required when creating a cluster and must be a valid storage container name');
    }
  });

  it('should validate the user field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [user] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the user field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [user] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the password field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [password] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the password field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 4
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [password] field is required when creating a cluster and must be a string');
    }
  });

  it('should validate the nodes field of the clusterCreationObject is not undefined', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [nodes] field is required when creating a cluster and must be an integer');
    }
  });

  it('should validate the nodes field of the clusterCreationObject is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 'not a number'
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [nodes] field is required when creating a cluster and must be an integer');
    }
  });

  it('should validate the additionalStorageAccounts field of the clusterCreationObject is an array', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [additionalStorageAccounts] field is optional when creating a cluster but must be an array when specified');
    }
  });

  it('should validate the additionalStorageAccounts elements contain a name field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{ }]
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [additionalStorageAccounts] field is optional but if supplied each element must have a [name] field and it must be a string. Element 0 does not have a [name] field or it is not a string');
    }
  });

  it('should validate the additionalStorageAccounts elements contain a name field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 4
      }]
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [additionalStorageAccounts] field is optional but if supplied each element must have a [name] field and it must be a string. Element 0 does not have a [name] field or it is not a string');
    }
  });

  it('should validate the additionalStorageAccounts elements contain a key field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name'
      }]
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [additionalStorageAccounts] field is optional but if supplied each element must have a [key] field and it must be a string. Element 0 does not have a [key] field or it is not a string');
    }
  });

  it('should validate the additionalStorageAccounts elements contain a key field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 4
      }]
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('The [additionalStorageAccounts] field is optional but if supplied each element must have a [key] field and it must be a string. Element 0 does not have a [key] field or it is not a string');
    }
  });

  it('should validate that if an oozie metastore is provided then a hive metastore is also provided', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied, than the [hiveMetastore] field must also be supplied');
    }
  });

  it('should validate that if a hive metastore is provided then an oozie metastore is also provided', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied, than the [oozieMetastore] field must also be supplied');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a server field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {},
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [server] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a server field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 4
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [server] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a database field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server'
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [database] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a database field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 4
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [database] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a user field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database'
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [user] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a user field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 4
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [user] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a password field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user'
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  });

  it('should validate that if an oozie metastore is provided then it contains a password field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 4
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [oozieMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  });


  it('should validate that if a hive metastore is provided then it contains a server field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {}
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [server] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a server field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 4
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [server] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a database field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server'
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [database] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a database field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server',
        database : 4
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [database] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a user field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server',
        database : 'database'
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [user] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a user field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server',
        database : 'database',
        user : 4
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [user] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a password field', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server',
        database : 'database',
        user : 'user'
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  });

  it('should validate that if a hive metastore is provided then it contains a password field and it is a string', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'test',
      defaultStorageAccountKey : 'KEY',
      defaultStorageContainer : 'deploy1',
      user : 'user',
      password : 'password',
      nodes : 4,
      additionalStorageAccounts : [{
        name : 'name',
        key : 'KEY'
      }],
      oozieMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 'password'
      },
      hiveMetastore : {
        server : 'server',
        database : 'database',
        user : 'user',
        password : 4
      }
    };
    try
    {
      hdInsight.createCluster(clusterCreationObject, function(err, response) {});
      throw new Error('this line should never be reached');
    }
    catch (error)
    {
      error.message.should.be.eql('If the [hiveMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  });

  it('should convert the the clusterCreationObject with no additionalStorageAccounts and no metastores to the proper payload object', function() {
    performRequestStubUtil.StubAuthenticationFailed('http://test');
    var clusterCreationObject = {
      name : 'test',
      location : 'East US',
      defaultStorageAccountName : 'defaultAccount',
      defaultStorageAccountKey : 'defaultKEY',
      defaultStorageContainer : 'defaultContainer',
      user : 'user',
      password : 'password',
      nodes : 4
    };
    var payload = hdInsight.convertCreationObject(clusterCreationObject);
    should.exist(payload.Resource);
    should.exist(payload.Resource.$);
    should.exist(payload.Resource.$.xmlns);
    payload.Resource.$.xmlns.should.be.eql('http://schemas.microsoft.com/windowsazure');
    should.exist(payload.Resource.IntrinsicSettings);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.$);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.$.xmlns);
    payload.Resource.IntrinsicSettings.ClusterContainer.$.xmlns.should.be.eql('http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess.Context');
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount.should.be.an.instanceOf(Array);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount.length.should.be.eql(1);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount[0]);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount[0].AccountName.should.be.eql('defaultAccount');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount[0].BlobContainerName.should.be.eql('defaultContainer');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount[0].SecretKey.should.be.eql('defaultKEY');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ClusterPassword.should.be.eql('password');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ClusterUsername.should.be.eql('user');
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes);
    should.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize.should.be.an.instanceOf(Array);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize.length.should.be.eql(2);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[0].Count.should.be.eql(1);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[0].RoleType.should.be.eql('HeadNode');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[0].VMSize.should.be.eql('ExtraLarge');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[1].Count.should.be.eql(4);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[1].RoleType.should.be.eql('DataNode');
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.NodeSizes.ClusterNodeSize[1].VMSize.should.be.eql('Large');
    should.not.exist(payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.SqlMetaStores.SqlAzureMetaStore);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.Version.should.be.eql('default');
    payload.Resource.IntrinsicSettings.ClusterContainer.DeploymentAction.should.be.eql('Create');
    payload.Resource.IntrinsicSettings.ClusterContainer.DnsName.should.be.eql('test');
    Validate.isValidUuid(payload.Resource.IntrinsicSettings.ClusterContainer.IncarnationID);
    payload.Resource.IntrinsicSettings.ClusterContainer.SubscriptionId.should.be.eql(hdInsightTestUtils.getSubscriptionId());
  });
});
