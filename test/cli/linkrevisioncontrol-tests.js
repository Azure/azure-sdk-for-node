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
var sinon = require('sinon');
var cli = require('./cli');
var capture = require('./util').capture;
var LinkedRevisionControl = require('../../lib/cli/linkedrevisioncontrol');

var sandbox;

suite('cli', function(){
  suite('linkrevisioncontrol', function() {
    setup(function (done) {
      sandbox = sinon.sandbox.create();

      done();
    });

    teardown(function (done) {
      sandbox.restore();

      done();
    });

    test('should get remote azure uri', function(done) {
      // Setup
      var azureUrl = { 
        stdout: 'azure\tgit://github.com/andrerod/mynewsite999.git (fetch)\n' +
                'azure\tgit://github.com/andrerod/mynewsite999.git (push)\n',
        stderr: '' 
      };

      var cli = { output: { }, progress: function() { return { end: function() {}}} };
      var githubClient = LinkedRevisionControl.createClient(cli, 'github');

      var execStub = sandbox.stub(githubClient, '_exec');
      execStub.yields(undefined, azureUrl);

      // Test
      githubClient._getRemoteUri(function (err, url) {
        // Assert
        url.should.equal('git://github.com/andrerod/mynewsite999.git');

        done();
      });
    });

    test('should get remote origin uri', function(done) {
      // Setup
      var originUrl = { 
        stdout: 'origin\tgit://github.com/andrerod/mynewsite999.git (fetch)\n' +
                'origin\tgit://github.com/andrerod/mynewsite999.git (push)\n',
        stderr: '' 
      };

      var cli = { output: { }, progress: function() { return { end: function() {}}} };
      var githubClient = LinkedRevisionControl.createClient(cli, 'github');

      var execStub = sandbox.stub(githubClient, '_exec');
      execStub.yields(undefined, originUrl);

      // Test
      githubClient._getRemoteUri(function (err, url) {
        // Assert
        url.should.equal('git://github.com/andrerod/mynewsite999.git');

        done();
      });
    });

    test('should not get other remote uris', function(done) {
      // Setup
      var originUrl = { 
        stdout: 'myremote\tgit://github.com/andrerod/mynewsite999.git (fetch)\n' +
                'myremote\tgit://github.com/andrerod/mynewsite999.git (push)\n',
        stderr: '' 
      };

      var cli = { output: { }, progress: function() { return { end: function() {}}} };
      var githubClient = LinkedRevisionControl.createClient(cli, 'github');

      var execStub = sandbox.stub(githubClient, '_exec');
      execStub.yields(undefined, originUrl);

      // Test
      githubClient._getRemoteUri(function (err, url) {
        // Assert
        should.strictEqual(undefined, url);

        done();
      });
    });
  });
});