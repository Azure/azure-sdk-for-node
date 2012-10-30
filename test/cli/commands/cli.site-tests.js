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
var url = require('url');
var GitHubApi = require('github');
var util = require('util');
var cli = require('../cli');
var capture = require('../util').capture;
var LinkedRevisionControlClient = require('../../../lib/cli/linkedrevisioncontrol').LinkedRevisionControlClient;

var githubUsername = process.env['AZURE_GITHUB_USERNAME'];
var githubPassword = process.env['AZURE_GITHUB_PASSWORD'];
var githubRepositoryFullName = process.env['AZURE_GITHUB_REPOSITORY'];
var githubClient = new GitHubApi({ version: "3.0.0" });

githubClient.authenticate({
  type: "basic",
  username: githubUsername,
  password: githubPassword
});

suite('cli', function(){
  suite('site', function() {
    teardown(function (done) {
      var repositoryName;

      function deleteAllHooks (hooks, callback) {
        if (hooks.length === 0) {
          callback();
        } else {
          var hook = hooks.pop();
          hook.user = githubUsername;
          hook.repo = repositoryName;

          githubClient.repos.deleteHook(hook, function () {
            deleteAllHooks(hooks, callback);
          });
        }
      };

      // Remove any existing repository hooks
      githubClient.repos.getFromUser({ user: githubUsername }, function (err, repositories) {
        repositoryName = LinkedRevisionControlClient._getRepository(repositories, githubRepositoryFullName).name;

        githubClient.repos.getHooks({
          user: githubUsername,
          repo: repositoryName
        }, function (err, hooks) {
          deleteAllHooks(hooks, done);
        });
      });
    });

    test('site create', function(done) {
      var siteName = 'cliuttestsite1';

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('East US');

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.text.should.equal('');
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
            result.text.should.equal('');
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
      var siteName = 'cliuttestsite2';

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --github --json --location').split(' ');
      cmd.push('East US');
      cmd.push('--githubusername');
      cmd.push(githubUsername);
      cmd.push('--githubpassword');
      cmd.push(githubPassword);
      cmd.push('--githubrepository');
      cmd.push(githubRepositoryFullName);

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.text.should.equal('');
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

          // verify that the hook is in github
          githubClient.repos.getFromUser({ user: githubUsername }, function (err, repositories) {
            var repository = LinkedRevisionControlClient._getRepository(repositories, githubRepositoryFullName);

            githubClient.repos.getHooks({
              user: githubUsername,
              repo: repository.name
            }, function (err, hooks) {
              var hookExists = hooks.some(function (hook) {
                var parsedUrl = url.parse(hook.config.url);
                return parsedUrl.hostname === (siteName + '.scm.azurewebsites.net');
              });

              hookExists.should.be.ok;

              // Delete created site
              cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
              capture(function() {
                cli.parse(cmd);
              }, function (result) {
                result.text.should.equal('');
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

    test('site create github rerun scenario', function(done) {
      var siteName = 'cliuttestsite3';

      // Create site
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('East US');

      capture(function() {
        cli.parse(cmd);
      }, function (result) {
        result.text.should.equal('');
        result.exitStatus.should.equal(0);

        cmd.push('--github');
        cmd.push('--githubusername');
        cmd.push(githubUsername);
        cmd.push('--githubpassword');
        cmd.push(githubPassword);
        cmd.push('--githubrepository');
        cmd.push(githubRepositoryFullName);

        // Rerun to make sure update hook works properly
        capture(function() {
          cli.parse(cmd);
        }, function (result) {
          result.text.should.equal('');
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

            // verify that the hook is in github
            githubClient.repos.getFromUser({ user: githubUsername }, function (err, repositories) {
              var repository = LinkedRevisionControlClient._getRepository(repositories, githubRepositoryFullName);

              githubClient.repos.getHooks({
                user: githubUsername,
                repo: repository.name
              }, function (err, hooks) {
                var hookExists = hooks.some(function (hook) {
                  var parsedUrl = url.parse(hook.config.url);
                  return parsedUrl.hostname === (siteName + '.scm.azurewebsites.net');
                });

                hookExists.should.be.ok;

                // Delete created site
                cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
                capture(function() {
                  cli.parse(cmd);
                }, function (result) {
                  result.text.should.equal('');
                  result.exitStatus.should.equal(0);

                  // List sites
                  cmd = 'node cli.js site list --json'.split(' ');
                  capture(function() {
                    cli.parse(cmd);
                  }, function (result) {
                    siteList = JSON.parse(result.text);

                    siteExists = siteList.some(function (site) {
                      return site.Name.toLowerCase() === siteName.toLowerCase();
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
    });
    
    test('site restart running site', function (done) {
      var siteName = 'cliuttestsite4';

      // Create site for testing
      var cmd = util.format('node cli.js site create %s --json --location', siteName).split(' ');
      cmd.push('East US');
      capture(function () {
        cli.parse(cmd);
      }, function (result) {

        // Restart site, it's created running
        cmd = util.format('node cli.js site restart %s', siteName).split(' ');
        capture(function () {
          cli.parse(cmd);
        }, function (result) {
          // Verify site stopped and restarted
          result.text.should.match('Site ' + siteName + ' has been stopped');
          result.text.should.match('Site ' + siteName + ' has been started');

          // Delete test site

          cmd = util.format('node cli.js delete %s', siteName).split(' ');
          capture(function () {
            cli.parse(cmd);
          }, function (result) {
            done();
          });
        });
      });
    });

    test('site restart stopped site', function (done) {
      var siteName = 'cliuttestsite4';

      // Create site for testing
      var cmd = util.format('node cli.js site create %s --json --location', siteName).split(' ');
      cmd.push('East US');
      capture(function () {
        cli.parse(cmd);
      }, function (result) {
        // Stop the site
        cmd = util.format('node cli.js site stop %s', siteName).split(' ');
        capture(function () {
          cli.parse(cmd);
        }, function () {
          // Restart site
          cmd = util.format('node cli.js site restart %s', siteName).split(' ');
          capture(function () {
            cli.parse(cmd);
          }, function (result) {
            // Verify site stopped and restarted
            result.text.should.match('Site ' + siteName + ' has been stopped');
            result.text.should.match('Site ' + siteName + ' has been started');

            // Delete test site

            cmd = util.format('node cli.js delete %s', siteName).split(' ');
            capture(function () {
              cli.parse(cmd);
            }, function (result) {
              done();
            });
          });
        });
      });      
    });
  });
});
