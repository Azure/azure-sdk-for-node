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

var should = require('should');
var cli = require('../cli');
var capture = require('../util').capture;

var currentSiteName = 0;
var siteNames = [ siteName1, siteName2 ];

suite('cli', function(){
  suite('siteconfig', function() {
    setup(function (done) {

      var removeSites = function (sites, cb) {
        if (sites.length === 0) {
          currentSiteName++;
          cb();
        } else {
          var siteName = sites.pop();
          // Delete created site
          var cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            removeSites(sites, cb);
          });
        }
      };

      // List sites
      var cmd = ('node cli.js site list --json').split(' ');
      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        var siteList = JSON.parse(result.text);
        var filteredSites = siteNames.filter(function (site) {
          return siteList.some(function (s) {
            return site === s.Name;
          });
        });

        removeSites(filteredSites, done);
      });
    });

    test('siteconfig list', function(done) {
      var siteName = siteNames[currentSiteName];

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('East US');

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.text.should.equal('');
        result.exitStatus.should.equal(0);

        // List sites
        cmd = ('node cli.js site config list ' + siteName + ' --json ').split(' ');
        capture(function() {
          cli.parse(cmd);
        }, function (result) {
          // there should be not settings yet as the site was just created
          result.text.should.equal('');
          result.exitStatus.should.equal(0);

          // add a setting
          var cmd = ('node cli.js site config add mysetting=myvalue ' + siteName + ' --json').split(' ');
          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            result.text.should.equal('');
            result.exitStatus.should.equal(0);

            cmd = ('node cli.js site config list ' + siteName + ' --json').split(' ');
            capture(function() {
              cli.parse(cmd);
            }, function (result) {
              var settingsList = JSON.parse(result.text);

              // Listing should return 1 setting now
              settingsList.length.should.equal(1);

              // add another setting
              var cmd = ('node cli.js site config add mysetting2=myvalue ' + siteName + ' --json').split(' ');
              capture(function() {
                cli.parse(cmd);
              }, function (result) {
                result.text.should.equal('');
                result.exitStatus.should.equal(0);

                cmd = ('node cli.js site config list ' + siteName + ' --json').split(' ');
                capture(function() {
                  cli.parse(cmd);
                }, function (result) {
                  var settingsList = JSON.parse(result.text);

                  // Listing should return 2 setting now
                  settingsList.length.should.equal(2);

                  done();
                });
              });
            });
          });
        });
      });
    });

    test('siteconfig add get clear', function(done) {
      var siteName = siteNames[currentSiteName];

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('East US');

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.text.should.equal('');
        result.exitStatus.should.equal(0);

        // List sites
        cmd = ('node cli.js site config list ' + siteName + ' --json ').split(' ');
        capture(function() {
          cli.parse(cmd);
        }, function (result) {
          // there should be not settings yet as the site was just created
          result.text.should.equal('');
          result.exitStatus.should.equal(0);

          // add a setting
          var cmd = ('node cli.js site config add mysetting=myvalue ' + siteName + ' --json').split(' ');
          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            result.text.should.equal('');
            result.exitStatus.should.equal(0);

            cmd = ('node cli.js site config get mysetting ' + siteName + ' --json').split(' ');
            capture(function() {
              cli.parse(cmd);
            }, function (result) {
              result.text.should.equal('"myvalue"\n');
              result.exitStatus.should.equal(0);

              // add another setting
              var cmd = ('node cli.js site config clear mysetting ' + siteName + ' --json').split(' ');
              capture(function() {
                cli.parse(cmd);
              }, function (result) {
                result.text.should.equal('');
                result.exitStatus.should.equal(0);

                cmd = ('node cli.js site config list ' + siteName + ' --json').split(' ');
                capture(function() {
                  cli.parse(cmd);
                }, function (result) {
                  result.text.should.equal('');
                  result.exitStatus.should.equal(0);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});