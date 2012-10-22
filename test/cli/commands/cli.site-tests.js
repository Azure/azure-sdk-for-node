/**
* Copyright 2012 Microsoft Corporation
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

require('should');
var cli = require('../cli');
var capture = require('../util').capture;

suite('cli', function(){
  suite('site', function() {
    test('site create', function(done) {
      var siteName = 'cliuttestsite';

      // Setup
      var originUrl = { 
        stdout: 'myremote\tgit://github.com/andrerod/mynewsite999.git (fetch)\n' +
                'myremote\tgit://github.com/andrerod/mynewsite999.git (push)\n',
        stderr: '' 
      };

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('East US');

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.exitStatus.should.equal(0);

        // List sites
        cmd = 'node cli.js site list --json'.split(' ');
        capture(function() {
          cli.parse(cmd);
        }, function (result) {
          var siteList = JSON.parse(result.text);

          var siteExists = siteList.some(function (site) {
            return site.Name.toLowerCase() === siteName.toLowerCase()
          });

          siteExists.should.be.ok;

          // Delete created site
          cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            result.exitStatus.should.equal(0);

            // List sites
            cmd = 'node cli.js site list --json'.split(' ');
            capture(function() {
              cli.parse(cmd);
            }, function (result) {
              siteList = JSON.parse(result.text);

              siteExists = siteList.some(function (site) {
                return site.Name.toLowerCase() === siteName.toLowerCase()
              });

              siteExists.should.not.be.ok;

              done();
            });
          });
        });
      });
    });

    test('site create github', function(done) {
      var siteName = 'cliuttestsite';

      // Setup
      var originUrl = { 
        stdout: 'myremote\tgit://github.com/andrerod/mynewsite999.git (fetch)\n' +
                'myremote\tgit://github.com/andrerod/mynewsite999.git (push)\n',
        stderr: '' 
      };

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --github --json --location').split(' ');
      cmd.push('East US');
      cmd.push('--username');
      cmd.push(process.env['AZURE_GITHUB_USERNAME']);
      cmd.push('--pass');
      cmd.push(process.env['AZURE_GITHUB_PASSWORD']);

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.exitStatus.should.equal(0);

        // List sites
        cmd = 'node cli.js site list --json'.split(' ');
        capture(function() {
          cli.parse(cmd);
        }, function (result) {
          var siteList = JSON.parse(result.text);

          var siteExists = siteList.some(function (site) {
            return site.Name.toLowerCase() === siteName.toLowerCase()
          });

          siteExists.should.be.ok;

          // Delete created site
          cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            result.exitStatus.should.equal(0);

            // List sites
            cmd = 'node cli.js site list --json'.split(' ');
            capture(function() {
              cli.parse(cmd);
            }, function (result) {
              siteList = JSON.parse(result.text);

              siteExists = siteList.some(function (site) {
                return site.Name.toLowerCase() === siteName.toLowerCase()
              });

              siteExists.should.not.be.ok;

              done();
            });
          });
        });
      });
    });
  });
});