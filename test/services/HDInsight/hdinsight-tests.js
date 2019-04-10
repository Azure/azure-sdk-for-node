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

var assert = require('assert');
var mocha = require('mocha');
var should = require('should');
var _ = require('underscore');
var HDInsightTestUtils = require('../../framework/hdinsight-test-utils.js');
var azureUtil = require('../../../lib/util/util.js');

// Test includes
var testutil = require('../../util/util');


function doPollRequest(operation, validation, callback) {
  var _callback = function(err, response) {
    if (!validation(err, response)) {
      setTimeout(function () {
        doPollRequest(operation, validation, callback);
      }, exports.POLL_REQUEST_INTERVAL);
    }
    else {
      callback(err, response);
    }
  };
  operation(_callback);
}

describe('HDInsight Test', function() {
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var hdInsight;
  var hdInsightTestUtils;

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
    hdInsightTestUtils = new HDInsightTestUtils(function () {
      hdInsight = hdInsightTestUtils.getHDInsight();
      done();
    });
  });

  it('should be able to create and delete a cluster', function (done) {
    var i = 0;
    var clusterCreationObject = hdInsightTestUtils.getDefaultWithAsvAndMetastores();
    hdInsight.createCluster(clusterCreationObject, function (err, response) {
      // poll for the cluster until it's creation is accnowledged.      
      doPollRequest(function(callback) {
        // list the clusters
        hdInsight.listClusters(callback);
      }, function (err, response) {
        // enumerate through the clusters...
        should.exist(response.body.CloudServices.CloudService);
        response.body.CloudServices.CloudService.should.be.an.instanceOf(Array);
        for (var i = 0; i < response.body.CloudServices.CloudService.length; i++) {
          var service = response.body.CloudServices.CloudService[i];
          should.exist(service);
          if (!_.isUndefined(service.Resources.Resource)) {
            service.Resources.Resource.should.be.an.instanceOf(Array);
            for (var j = 0; j < service.Resources.Resource.length; j++) {
              var resource = service.Resources.Resource[j];
              should.exist(resource);
              should.exist(resource.Name);
              // if this one is present then we are done.
              if (resource.Name == clusterCreationObject.name) {
                return true;
              }
            }
          }
        }
        return false;
      }, function (err, response) {
        // Then delete the cluster
        hdInsight.deleteCluster(clusterCreationObject.name, clusterCreationObject.location, function (err, response) {
          done(err);
        });
      });
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
