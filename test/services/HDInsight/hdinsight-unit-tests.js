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

var azure = testutil.libRequire('azure');
var hdInsightUtil;

describe('HDInsight listClusters', function() {

  var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var hdInsight = azure.createHDInsightService(subscriptionId, auth);
  var hdinsightTestUtils = new HDInsightTestUtils();

  beforeEach(function (done) {
    done();
  });

  afterEach(function (done) {
    done();
  });

  after(function (done) {
    done();
  });

  // NOTE: To Do, we should actually create new acounts for our tests
  //       So that we can work on any existing subscription.
  before (function (done) {
    done();
  });

  it('should be able to access the credentail information', function() {
    // hdinsightTestUtils.getTestCredentialData(function (result) {
    //   should.exist(result);
    // });
  });

  // it('should run tests', function (done) {
  //   var result;
  //   // hdInsightUtil.StubProcessRequestWithError(403, 'Unauthorized', 'You are not authorized');
  //   result = {
  //     CloudServices: {
  //       CloudService: [
  //         { Name: 'not-hdinsight' } ,
  //         {
  //           Name: 'hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2',
  //           GeoRegion: 'East US 2',
  //           Resources: {
  //             Resource: [
  //               {
  //                 ResourceProviderNamespace: 'hdinsight',
  //                 Type: 'containers',
  //                 Name: 'tsthdx00hdxcibld02',
  //                 State: 'Started',
  //                 SubState: 'Running'
  //               },
  //               {
  //                 ResourceProviderNamespace: 'not-hdinsight'
  //               }
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   };

  //   hdInsightUtil.StubProcessRequestWithSuccess(result);
  //   hdInsight.listClusters(function (err, response) {
  //     console.log(err);
  //     console.log(response);
  //     should.not.exist(err);
  //     should.exist(response.body.CloudServices.CloudService);
  //     response.body.CloudServices.CloudService.length.should.eql(1);
  //     response.body.CloudServices.CloudService[0].Resources.Resource.length.should.eql(1);
  //     response.body.CloudServices.CloudService[0].Resources.Resource[0].Name.should.eql('tsthdx00hdxcibld02');
  //     done(err);
  //   });
  // });

  // it('should list storage accounts', function (done) {
  //   var result;

  //   hdInsight.listClusters(function (err, response) {
  //     console.log(err);
  //     console.log(response);
  //     should.not.exist(err);
  //     // response.bar.should.eql('foo');
  //     response.should.eql('');
  //     // response.length.should.eql(2);
  //     done(err);
  //   });
  // });

});
