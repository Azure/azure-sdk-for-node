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

var should = require('should');
var assert = require('assert');
var util = require('util');
var SuiteBase = require('../framework/suite-base');
var testPrefix = 'suite-base-tests';
var location, iosApps, androidApps;

describe('Test Suite', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix);
    suite.setupSuite(function () {
      if (suite.isRecording) {
        suite.saveMockVariable('location', 'West US');
        suite.saveMockVariable('iosApps', ['appone', 'apptwo']);
        suite.saveMockVariable('androidApps', { 1 : 'appOne', 22: 'appTwentyTwo' });
      } else if (suite.isPlayback) {
        location = suite.getMockVariable('location');
        iosApps = suite.getMockVariable('iosApps');
        androidApps = suite.getMockVariable('androidApps');
      }
      done();
    });
  });
  
  after(function (done) {
    suite.teardownSuite(done);
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });
  
  describe('Base', function () {
    it('should properly record and retrieve mock variables', function (done) {
      var expectedLocation = 'West US';
      var expectediosApps = ['appone', 'apptwo'];
      var expectedandroidApps = { 1 : 'appOne', 22: 'appTwentyTwo' };
      if (suite.isRecording) {
        var recorded = require(suite.getSuiteRecordingsFile());
        var mockedVariables = recorded.mockVariables();
        assert.deepEqual(mockedVariables.location, expectedLocation);
        assert.deepEqual(mockedVariables.iosApps, expectediosApps);
        assert.deepEqual(mockedVariables.androidApps, expectedandroidApps);
      }
      
      if (suite.isPlayback) {
        location.should.equal(expectedLocation);
        assert.deepEqual(iosApps, expectediosApps);
        assert.deepEqual(androidApps, expectedandroidApps);
      }
      done();
    });
  });
});