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

var _ = require('underscore');

var should = require('should');
var assert = require('assert');
var url = require('url');

// Test includes
var testutil = require('../../util/util');
var blobtestutil = require('../../framework/blob-test-utils');

var azure = testutil.libRequire('azure');
var ProxyFilter = azure.ProxyFilter;

var containerNames = [];
var containerNamesPrefix = 'conta';

var testPrefix = 'proxyfilter-tests';

describe('Proxy filter', function () {
  var service;
  var suiteUtil;

  before(function (done) {
    service = azure.createBlobService();

    suiteUtil = blobtestutil.createBlobTestUtils(service, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.teardownTest(done);
  });

  describe('when used in a service', function () {
    it('should work for https over http', function (done) {
      var parsedProxy = url.parse('http://localhost:8888');
      var httpsOverHttpService = azure.createBlobService();
      httpsOverHttpService.setProxy(parsedProxy);

      suiteUtil.setupService(httpsOverHttpService);

      var containerName = testutil.generateId(containerNamesPrefix, containerNames, suiteUtil.isMocked);

      httpsOverHttpService.createContainer(containerName, function (err) {
        assert.equal(err, null);

        done();
      });
    });
  });

  describe('setting the agent', function() {
    it('should work for http over http', function (done) {
      var proxyFilter = ProxyFilter.create(url.parse('http://localhost:8888'));
      proxyFilter({ url: 'http://service.com' },
        function (resource, callback) {
          resource.agent.should.not.equal(null);
          resource.agent.proxyOptions.hostname.should.equal('localhost');
          resource.agent.proxyOptions.port.should.equal('8888');

          resource.strictSSL.should.equal(false);

          callback();
        },
        function () {
          done();
        });
    });

    it('should work for http over https', function (done) {
      var proxyFilter = ProxyFilter.create(url.parse('https://localhost:8888'));
      proxyFilter({ url: 'http://service.com' },
        function (resource, callback) {
          resource.agent.should.not.equal(null);
          resource.agent.proxyOptions.hostname.should.equal('localhost');
          resource.agent.proxyOptions.port.should.equal('8888');

          resource.strictSSL.should.equal(false);

          callback();
        },
        function () {
          done();
        });
    });
  });
});