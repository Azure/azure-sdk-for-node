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

var path = require('path');
var url = require('url');
var util = require('util');

var should = require('should');
var mocha = require('mocha');
var _ = require('underscore');

/*jshint camelcase:false*/
var child_process = require('child_process');

var testutil = require('../../util/util');
var MockedTestUtils = require('../../framework/mocked-test-utils');

var azure = testutil.libRequire('azure');

var testPrefix = 'scmservice-tests';

var siteNamePrefix = 'xplatcli';
var siteNames = [];

describe('SCM', function () {
  var service;
  var suiteUtil;
  var scmService;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
    service = azure.createWebsiteManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});

    suiteUtil = new MockedTestUtils(service, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });

  describe('when there is a site with a repository', function () {
    var siteName;
    var allSiteData;

    beforeEach(function (done) {
      service.listWebspaces(function (err, webspaces) {
        should.not.exist(err);

        webspace = webspaces[0];

        siteName = testutil.generateId(siteNamePrefix, siteNames, suiteUtil.isMocked);

        var siteProperties = {
          HostNames: {
            '$': { 'xmlns:a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays' },
            'a:string': [ siteName + '.azurewebsites.net' ]
          },
          Name: siteName,
          WebSpace: webspace.Name
        };

        service.createSite(webspace.Name, siteName, siteProperties, function (err) {
          should.not.exist(err);

          service.createSiteRepository(webspace.Name, siteName, function (err) {
            should.not.exist(err);

            service.getSite(webspace.Name, siteName, {
                propertiesToInclude: [ 'repositoryuri', 'publishingpassword', 'publishingusername' ]
              }, function (err, siteData) {
                should.not.exist(err);

                allSiteData = siteData;

                var repositoryUrl = url.parse(getRepositoryUri(siteData));
                var repositoryAuth = getRepositoryAuth(siteData).split(':');

                var authentication = null;
                if (process.env.AZURE_NOCK_RECORD) {
                  authentication = {
                    user: repositoryAuth[0],
                    pass: repositoryAuth[1]
                  };
                }

                scmService = azure.createScmService(authentication, {
                  host: repositoryUrl.hostname,
                  port: repositoryUrl.port
                });
                suiteUtil.setupService(scmService);

                done();
              });
          });
        });
      });
    });

    afterEach(function (done) {
      service.deleteSite(webspace.Name, siteName, done);
    });

    describe('settings', function () {
      it('should list the settings', function (done) {
        scmService.listSettings(function (err, settings) {
          should.not.exist(err);

          settings.length.should.be.above(0);
          var setting = settings.filter(function (k) {
            return k.Key === 'deployment_branch';
          })[0];

          setting.Value.should.equal('master');

          done(err);
        });
      });

      it('should get the setting', function (done) {
        scmService.getSetting('deployment_branch', function (err, setting) {
          should.not.exist(err);

          setting.should.equal('master');

          done(err);
        });
      });

      it('should update the setting', function (done) {
        scmService.updateSetting('deployment_branch', 'master', function (err) {
          should.not.exist(err);

          done(err);
        });
      });
    });

    describe('diagnostics settings', function () {
      it('should get the diagnostics settings', function (done) {
        scmService.getDiagnosticsSettings(function (err, settings) {
          should.not.exist(err);

          Object.keys(settings).length.should.equal(0);

          done(err);
        });
      });

      it('should update the diagnostics setting', function (done) {
        scmService.getDiagnosticsSettings(function (err, settings) {
          should.not.exist(err);

          scmService.updateDiagnosticsSettings(settings, function (err) {
            should.not.exist(err);

            done(err);
          });
        });
      });
    });

    describe('deployments', function () {
      describe('when there are no deployments', function () {
        it('should list nothing', function (done) {
          scmService.listDeployments(function (err, deployments) {
            should.not.exist(err);

            // there is more than one location
            deployments.length.should.equal(0);

            done(err);
          });
        });
      });

      describe('when there are deployments', function () {
        beforeEach(function (done) {
          if (!process.env.AZURE_NOCK_RECORD) {
            done();
          } else {
            process.chdir(path.join(__dirname, '../../data'));
            exec('rm -rf .git', function (err) {
              should.not.exist(err);

              exec('git init', function (err) {
                should.not.exist(err);

                var repositoryUri = getRepositoryUri(allSiteData);
                var repositoryAuth = getRepositoryAuth(allSiteData).split(':');

                var parsedUri = url.parse(repositoryUri);
                parsedUri.auth = util.format('%s:%s', repositoryAuth[0], repositoryAuth[1]);

                exec('git remote add azure ' + url.format(parsedUri), function (err) {
                  should.not.exist(err);

                  exec('git add .', function (err) {
                    should.not.exist(err);

                    exec('git commit -m "Initial commit"', function (err) {
                      should.not.exist(err);

                      exec('git push azure master', function (err) {
                        should.not.exist(err);

                        done();
                      });
                    });
                  });
                });
              });
            });
          }
        });

        it('should list, get and redeploy it', function (done) {
          scmService.listDeployments(function (err, deployments) {
            should.not.exist(err);

            // Make sure the deployment exists
            deployments.length.should.equal(1);
            should.exist(deployments[0].id);
            deployments[0].active.should.equal(true);

            done(err);
          });
        });

        it('should get', function (done) {
          scmService.listDeployments(function (err, deployments) {
            should.not.exist(err);

            // Make sure the deployment exists
            deployments.length.should.equal(1);
            should.exist(deployments[0].id);
            deployments[0].active.should.equal(true);

            scmService.getDeployment(deployments[0].id, function (err, deployment) {
              should.not.exist(err);

              should.exist(deployment.id);
              deployment.active.should.equal(true);

              done(err);
            });
          });
        });

        it('should update', function (done) {
          scmService.listDeployments(function (err, deployments) {
            should.not.exist(err);

            // Make sure the deployment exists
            deployments.length.should.equal(1);
            should.exist(deployments[0].id);
            deployments[0].active.should.equal(true);

            scmService.updateDeployment(deployments[0].id, function (err) {
              should.not.exist(err);

              done(err);
            });
          });
        });

        it('should list and get logs', function (done) {
          scmService.listDeployments(function (err, deployments) {
            should.not.exist(err);

            // Make sure the deployment exists
            deployments.length.should.equal(1);
            should.exist(deployments[0].id);
            deployments[0].active.should.equal(true);

            scmService.listLogs(deployments[0].id, function (err, logs) {
              should.not.exist(err);

              logs.length.should.be.above(1);
              should.exist(logs[0].id);

              scmService.getLog(deployments[0].id, logs[0].id, function (err) {
                should.not.exist(err);

                done(err);
              });
            });
          });
        });
      });
    });
  });
});

function getRepositoryUri(siteData) {
  if (siteData.SiteProperties.Properties) {
    for (var i = 0; i < siteData.SiteProperties.Properties.NameValuePair.length; ++i) {
      var pair = siteData.SiteProperties.Properties.NameValuePair[i];
      if (pair.Name === 'RepositoryUri') {
        if (typeof pair.Value === 'string') {
          if (!endsWith(pair.Value, '/')) {
            // Make sure there is a trailing slash
            pair.Value += '/';
          }

          return pair.Value;
        } else {
          return null;
        }
      }
    }
  }

  return null;
}

function getRepositoryAuth(siteData) {
  var userName, password;
  for (var i = 0; i < siteData.SiteProperties.Properties.NameValuePair.length; ++i) {
    var pair = siteData.SiteProperties.Properties.NameValuePair[i];
    if (pair.Name === 'PublishingUsername') {
      userName = pair.Value;
    } else if (pair.Name === 'PublishingPassword') {
      password = pair.Value;
    }
  }
  return userName && (userName + ':' + password);
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function exec(cmd, cb) {
  /*jshint camelcase:false*/
  child_process.exec(cmd, function (err, stdout, stderr) {
    cb(err, {
      stdout: stdout,
      stderr: stderr
    });
  });
}