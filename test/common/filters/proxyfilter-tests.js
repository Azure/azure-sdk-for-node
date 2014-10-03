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
var url = require('url');

// Test includes
var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');
var ProxyFilter = azure.ProxyFilter;

describe('Proxy filter', function () {

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