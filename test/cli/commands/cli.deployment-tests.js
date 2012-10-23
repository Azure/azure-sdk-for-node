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

var cli = require('../cli');
var capture = require('../util').capture;
var LinkedRevisionControlClient = require('../../../lib/cli/linkedrevisioncontrol').LinkedRevisionControlClient;

var githubUsername = process.env['AZURE_GITHUB_USERNAME'];
var githubPassword = process.env['AZURE_GITHUB_PASSWORD'];
var githubRepositoryUri = process.env['AZURE_GITHUB_REPOSITORY'];
var githubClient = new GitHubApi({ version: "3.0.0" });

githubClient.authenticate({
  type: "basic",
  username: githubUsername,
  password: githubPassword
});

suite('cli', function(){
  suite('deployment', function() {
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
        repositoryName = LinkedRevisionControlClient.getRepository(repositories, githubRepositoryUri).name;

        githubClient.repos.getHooks({
          user: githubUsername,
          repo: repositoryName
        }, function (err, hooks) {
          deleteAllHooks(hooks, done);
        });
      });
    });

    test('site deployment github', function(done) {
      var siteName = 'cliuttestdeploy1';

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

          // Create the hook using deployment github cmdlet
          cmd = ('node cli.js site deployment github ' + siteName + ' --json').split(' ');
          cmd.push('--username');
          cmd.push(githubUsername);
          cmd.push('--pass');
          cmd.push(githubPassword);
          cmd.push('--repository');
          cmd.push(githubRepositoryUri);

          capture(function() {
            cli.parse(cmd);
          }, function (result) {
            result.text.should.equal('');
            result.exitStatus.should.equal(0);

            // verify that the hook is in github
            githubClient.repos.getFromUser({ user: githubUsername }, function (err, repositories) {
              var repository = LinkedRevisionControlClient.getRepository(repositories, githubRepositoryUri);

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
    });
  });
});