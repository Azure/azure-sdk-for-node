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
var should = require('should');
var _ = require('underscore');
var azureUtil = require('../../../lib/common/lib/util/util.js');


// Test includes
var testutil = require('../../util/util');

var PerformRequestStubUtil = require('./PerformRequestStubUtil.js');
var HDInsightTestUtils = require('../../framework/hdinsight-test-utils.js');

var azure = testutil.libRequire('azure');
var performRequestStubUtil;

describe('HDInsight deleteClusters (under unit test)', function() {
  var subscriptionId;
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var HDInsight = require('azure-asm-hdinsight').HDInsightService;
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
      subscriptionId = hdInsightTestUtils.getSubscriptionId();
      done();
    });
  });

  it('should pass the error to the callback function', function(done) {
    performRequestStubUtil.StubAuthenticationFailed('http://test.com');
    hdInsight.deleteCluster('clustername', 'East US', function (err, response) {
      should.exist(err);
      response.statusCode.should.be.eql(403);
      done();
    });
  });

  it('should provide the right headers for the request', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', {});
    hdInsight.deleteCluster('clustername', 'East US', function (err) {
      var webResource = performRequestStubUtil.GetLastWebResource();
      should.exist(webResource);
      var regionCloudServiceName = azureUtil.getNameSpace(subscriptionId, 'hdinsight' , 'East US');
      webResource.path.should.be.eql('/' + subscriptionId + '/cloudservices/' + regionCloudServiceName + '/resources/hdinsight/containers/' + 'clustername');
      webResource.method.should.be.eql('DELETE');
      _.size(webResource.headers).should.be.eql(2);
      webResource.headers['x-ms-version'].should.be.eql('2011-08-18');
      webResource.headers['accept'].should.be.eql('application/xml');
      done(err);
    });
  });
});