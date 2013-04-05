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

var should = require('should');
var mocha = require('mocha');
var uuid = require('node-uuid');

var testutil = require('../../util/util');
var MockedTestUtils = require('../../framework/mocked-test-utils');

var azure = testutil.libRequire('azure');

var AFFINITYGROUP_NAME_PREFIX = 'xplatcli-';
var AFFINITYGROUP_LOCATION = 'West US';

var testPrefix = 'affinityGroup-tests';

var affinityGroupNamePrefix = 'afgrp';
var affinityGroups = [];

describe('Affinity Group Management', function () {
  var service;
  var suiteUtil;
  var affinityGroupName;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
    service = azure.createServiceManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});

    suiteUtil = new MockedTestUtils(service, testPrefix);
    affinityGroupName = testutil.generateId(affinityGroupNamePrefix, affinityGroups, suiteUtil.isMocked);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    // Cleanup any affinity groups with the specified prefix
    service.listAffinityGroups(function (err, response) {
      if (err) { return done(err); }

      var affinityGroupsToClean = [];
      response.body.forEach(function (item) {
        if(item.Name.indexOf(AFFINITYGROUP_NAME_PREFIX) === 0) {
          affinityGroupsToClean.push(item.Name);
        }
      });

      deleteAffinityGroups(affinityGroupsToClean, function () {
        suiteUtil.baseTeardownTest(done);
      });
    });
  });

  describe('create affinity group', function () {
    it('should succeed', function (done) {
      service.createAffinityGroup(affinityGroupName, { Description: 'AG-DESC', Location: AFFINITYGROUP_LOCATION }, function (err, response) {
        should.not.exist(err);
        done(err);
      });
    });
  });

  describe('get affinity group', function () {
    it('should fail if name is invalid', function (done) {
      service.getAffinityGroup('!NotValid$', function (err, response) {
        should.exist(err);
        err.message.should.not.be.null;
        done();
      });
    });

    it('should succeed', function (done) {
      service.getAffinityGroup(affinityGroupName, function (err, response) {
        if (err) { return done(err); }
        response.body.Name.should.equal(affinityGroupName);
        response.body.Description.should.equal('AG-DESC');
        response.body.Location.should.equal(AFFINITYGROUP_LOCATION);
        response.body.Label.should.equal(new Buffer(affinityGroupName).toString('base64'));
        done();
      });
    });
  });

  describe('list affinity group', function () {
    it('should succeed', function (done) {
      service.listAffinityGroups(function (err, response) {
        if (err) { return done(err); }
        var found = false;
        response.body.forEach(function (item) {
          if(item.Name === affinityGroupName) {
            found = true;
            item.Description.should.equal('AG-DESC');
            item.Location.should.equal(AFFINITYGROUP_LOCATION);
            item.Label.should.equal(new Buffer(affinityGroupName).toString('base64'));
          }
        });
        found.should.equal(true);
        done();
      });
    });
  });

  describe('delete affinity group', function () {
    it('should fail if name is invalid', function (done) {
      service.deleteAffinityGroup('!NotValid$', function (err, response) {
        should.exist(err);
        err.message.should.not.be.null;
        done();
      });
    });

    it('should succeed', function (done) {
      service.deleteAffinityGroup(affinityGroupName, function (err, response) {
        if (err) { return done(err); }
        done();
      });
    });
  });

  function deleteAffinityGroups(affinityGroups, callback) {
    if (affinityGroups.length === 0) { return callback(); }
    var numDeleted = 0;
    affinityGroups.forEach(function (name) {
      service.deleteAffinityGroup(name, function (err, response) {
        ++numDeleted;
        if (numDeleted === affinityGroups.length) {
          callback();
        }
      });
    });
  }
  
});