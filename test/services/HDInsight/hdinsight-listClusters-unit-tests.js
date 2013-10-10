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

var mocha = require('mocha');
var should = require('should');
var _ = require('underscore');

// Test includes
var testutil = require('../../util/util');

var PerformRequestStubUtil = require('./PerformRequestStubUtil.js');
var HDInsightTestUtils = require('../../framework/hdinsight-test-utils.js');

var azure = testutil.libRequire('azure');
var performRequestStubUtil;

describe('HDInsight listClusters (under unit test)', function() {
  var subscriptionId;
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var HDInsight = require('../../../lib/services/serviceManagement/hdinsightservice.js');
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

  var goodResult = {
    CloudServices: {
      CloudService: [
        { Name: 'not-hdinsight' } ,
        {
          Name: 'hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2',
          GeoRegion: 'East US 2',
          Resources: {
            Resource: [
              {
                ResourceProviderNamespace: 'hdinsight',
                Type: 'containers',
                Name: 'tsthdx00hdxcibld02',
                State: 'Started',
                SubState: 'Running'
              },
              {
                ResourceProviderNamespace: 'not-hdinsight'
              }
            ]
          }
        }
      ]
    }
  };

  var singleResult = {
    CloudServices: {
      CloudService: {
        Name: 'hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2',
        GeoRegion: 'East US 2',
        Resources: {
          Resource: {
            ResourceProviderNamespace: 'hdinsight',
            Type: 'containers',
            Name: 'tsthdx00hdxcibld02',
            State: 'Started',
            SubState: 'Running',
            OutputItems: {
                OutputItem: [
                {
                    Key: "Version",
                    Value: "HDInsight 1.4.0.0002"
                },
                {
                    Key: "CreatedDate",
                    Value: "12/12/2004"
                },
                {
                    Key: "NodesCount",
                    Value: 3
                },
                {
                    Key: "ConnectionURL",
                    Value: "https://tsthdx00hdxcibld02.cloudapp.net"
                },
                {
                    Key: "ClusterUsername",
                    Value: "Admin"
                }
                ]
            }
          }
        }
      }
    }
  };

  it('should pass the error to the callback function', function(done) {
    performRequestStubUtil.StubAuthenticationFailed('http://test.com');
    hdInsight.listClusters(function (err, response) {
      should.exist(err);
      response.statusCode.should.be.eql(403);
      done();
    });
  });

  it('should turn single cloudservice items and resource items into arrays', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.clusters);
      _.isArray(response.body.clusters).should.be.eql(true);
      response.body.clusters.length.should.be.eql(1);
      should.exist(response.body.clusters[0]);
      should.exist(response.body.clusters[0].Version);
      response.body.clusters[0].Name.should.be.eql('tsthdx00hdxcibld02');
      done(err);
    });
  });

  it('should get version value out of outputItems of cloud service', function (done) {
      performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
      hdInsight.listClusters(function (err, response) {
          should.not.exist(err);
          should.exist(response.body.clusters);
          _.isArray(response.body.clusters).should.be.eql(true);
          response.body.clusters.length.should.be.eql(1);
          should.exist(response.body.clusters[0]);
          should.exist(response.body.clusters[0].Version);
          response.body.clusters[0].Version.should.be.eql('HDInsight 1.4.0.0002');
          done(err);
      });
  });

  it('should get ClusterUsername value out of outputItems of cloud service', function (done) {
      performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
      hdInsight.listClusters(function (err, response) {
          should.not.exist(err);
          should.exist(response.body.clusters);
          _.isArray(response.body.clusters).should.be.eql(true);
          response.body.clusters.length.should.be.eql(1);
          should.exist(response.body.clusters[0]);
          should.exist(response.body.clusters[0].Username);
          response.body.clusters[0].Username.should.be.eql('Admin');
          done(err);
      });
  });

  it('should get CreatedDate value out of outputItems of cloud service', function (done) {
      performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
      hdInsight.listClusters(function (err, response) {
          should.not.exist(err);
          should.exist(response.body.clusters);
          _.isArray(response.body.clusters).should.be.eql(true);
          response.body.clusters.length.should.be.eql(1);
          should.exist(response.body.clusters[0]);
          should.exist(response.body.clusters[0].CreatedDate);
          response.body.clusters[0].CreatedDate.should.be.eql('12/12/2004');
          done(err);
      });
  });

  it('should get NodesCount value out of outputItems of cloud service', function (done) {
      performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
      hdInsight.listClusters(function (err, response) {
          should.not.exist(err);
          should.exist(response.body.clusters);
          _.isArray(response.body.clusters).should.be.eql(true);
          response.body.clusters.length.should.be.eql(1);
          should.exist(response.body.clusters[0]);
          should.exist(response.body.clusters[0].Nodes);
          response.body.clusters[0].Nodes.should.be.eql(3);
          done(err);
      });
  });

  it('should get ConnectionUrl value out of outputItems of cloud service', function (done) {
      performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
      hdInsight.listClusters(function (err, response) {
          should.not.exist(err);
          should.exist(response.body.clusters);
          _.isArray(response.body.clusters).should.be.eql(true);
          response.body.clusters.length.should.be.eql(1);
          should.exist(response.body.clusters[0]);
          should.exist(response.body.clusters[0].ConnectionURL);
          response.body.clusters[0].ConnectionURL.should.be.eql('https://tsthdx00hdxcibld02.cloudapp.net');
          done(err);
      });
  });

  it('should provide the right headers for the request', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', goodResult);
    hdInsight.listClusters(function (err) {
      var webResource = performRequestStubUtil.GetLastWebResource();
      should.exist(webResource);
      webResource.path.should.be.eql('/' + subscriptionId + '/cloudservices');
      webResource.httpVerb.should.be.eql('GET');
      _.size(webResource.headers).should.be.eql(2);
      webResource.headers['x-ms-version'].should.be.eql('2011-08-18');
      webResource.headers['accept'].should.be.eql('application/xml');
      done(err);
    });
  });

  it('should remove CloudServices and resources not related to HDInsight', function (done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', goodResult);
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.clusters);
      _.isArray(response.body.clusters).should.be.true;
      response.body.clusters.length.should.be.equal(1);
      should.exist(response.body.clusters[0]);
      response.body.clusters[0].Name.should.be.eql('tsthdx00hdxcibld02');
      done(err);
    });
  });
});
