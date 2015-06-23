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
var mocha = require('mocha');
var uuid = require('node-uuid');

var testutil = require('../../util/util');

var MockedTestUtils = require('../../framework/mocked-test-utils');

var azure = testutil.libRequire('azure');
var azureSql = require('azure-asm-sql');

var SERVER_ADMIN_USERNAME = 'azuresdk';
var SERVER_ADMIN_PASSWORD = 'PassWord!1';
var SERVER_LOCATION = process.env['AZURE_SQL_TEST_LOCATION'] || 'West US';
var DATABASE_HOST = process.env['AZURE_SQL_DNS_SUFFIX'];

var DATABASE_NAME = 'mydatabase';

var testPrefix = 'sqlservice-tests';

describe('SQL Azure Database', function () {
  var serverName;

  var service;
  var serviceManagement;
  var suiteUtil;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = testutil.getAuthenticationCertificate();
    var hostOptions = { serializetype: 'XML' };
    if (process.env['AZURE_MANAGEMENT_HOST']) {
      hostOptions.host = process.env['AZURE_MANAGEMENT_HOST'];
    }

    serviceManagement = azure.createSqlManagementService(
      subscriptionId, auth, hostOptions)
      .withFilter(new azure.ExponentialRetryPolicyFilter());

    suiteUtil = new MockedTestUtils(serviceManagement, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    suiteUtil.teardownSuite(done);
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(function () {
      serviceManagement.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
        should.not.exist(err);

        serverName = name;

        service = azureSql.createSqlService(serverName, SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, DATABASE_HOST);
        suiteUtil.setupService(service);

        // add firewall rule for all the ip range
        serviceManagement.createServerFirewallRule(serverName, 'rule1', '0.0.0.0', '255.255.255.255', function () {
          var intervalTimeout = (suiteUtil.isMocked && !suiteUtil.isRecording) ? 0 : 2000;

          // Wait for the firewall rule to be added (test different operations needed as it seems they dont go valid at the same time)
          var checkIfRuleAdded = function () {
            setTimeout(function () {
              var databaseId;

              service.createServerDatabase(DATABASE_NAME, function (err, db) {
                if (err) {
                  checkIfRuleAdded();
                } else {
                  databaseId = db.Id;

                  var checkIfRuleDeleted = function () {
                    setTimeout(function () {
                      service.deleteServerDatabase(databaseId, function (err) {
                        if (err) {
                          checkIfRuleDeleted();
                        } else {
                          var checkIfRuleLists = function () {
                            setTimeout(function () {
                              service.listServerDatabases(function (err) {
                                if (err) {
                                  checkIfRuleLists();
                                } else {
                                  done();
                                }
                              })
                            }, intervalTimeout);
                          };

                          checkIfRuleLists();
                        }
                      });
                    }, intervalTimeout);
                  };

                  checkIfRuleDeleted();
                }
              });
            }, intervalTimeout);
          };

          checkIfRuleAdded();
        });
      });
    });
  });

  afterEach(function (done) {
    serviceManagement.deleteServer(serverName, function () {
      suiteUtil.baseTeardownTest(done);
    });
  });

  describe('list SQL databases', function () {
    describe('when only master database is defined', function () {
      it('should return it', function (done) {
        service.listServerDatabases(function (err, databases) {
          should.not.exist(err);
          should.exist(databases);
          databases.should.have.length(1);
          databases[0].Name.should.equal('master');
          done(err);
        });
      });
    });

    describe('when multiple databases are defined', function () {
      var databaseId;

      beforeEach(function (done) {
        service.createServerDatabase(DATABASE_NAME, function (err, database) {
          should.not.exist(err);
          databaseId = database.Id;

          done(err);
        });
      });

      afterEach(function (done) {
        service.deleteServerDatabase(databaseId, done);
      });

      it('should return it', function (done) {
        service.listServerDatabases(function (err, databases) {
          should.not.exist(err);
          should.exist(databases);
          databases.should.have.length(2);
          should.exist(databases.filter(function (database) {
            return database.Name === DATABASE_NAME;
          })[0]);

          done(err);
        });
      });
    });
  });

  describe('Delete SQL databases', function () {
    var databaseId;

    beforeEach(function (done) {
      service.createServerDatabase(DATABASE_NAME, function (err, database) {
        should.not.exist(err);
        databaseId = database.Id;

        done(err);
      });
    });

    it('should delete existing database', function (done) {
      service.deleteServerDatabase(databaseId, function (err, databases) {
        should.not.exist(err);

        service.listServerDatabases(function (err, databases) {
          should.exist(databases);
          should.not.exist(databases.filter(function (database) {
            return database.Name === DATABASE_NAME;
          })[0]);

          done(err);
        });
      });
    });
  });

  function deleteSqlDatabases(databases, callback) {
    if (databases.length === 0) { return callback(); }
    var numDeleted = 0;
    databases.forEach(function (databaseId) {
      service.deleteServerDatabase(databaseId, function (err) {
        ++numDeleted;
        if (numDeleted === databases.length) {
          callback();
        }
      });
    });
  }
});