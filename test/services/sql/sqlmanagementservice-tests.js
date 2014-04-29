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
var SqlAzureConstants = azure.Constants.SqlAzureConstants;

var SERVER_ADMIN_USERNAME = 'azuresdk';
var SERVER_ADMIN_PASSWORD = 'PassWord!1';
var SERVER_LOCATION = process.env['AZURE_SQL_TEST_LOCATION'] || 'West US';

var testPrefix = 'sqlManagement-tests';
var ruleNames = [];
var host = process.env['AZURE_MANAGEMENT_HOST'];

describe('SQL Server Management', function () {
  var sqlServersToClean = [];
  var service;
  var suiteUtil;

  before(function (done) {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = testutil.getAuthenticationCertificate();
    var hostOptions = {
      serializetype: 'XML'
    };

    if (process.env.AZURE_MANAGEMENT_HOST) {
      hostOptions.host = process.env.AZURE_MANAGEMENT_HOST;
    }

    service = azure.createSqlManagementService(
      subscriptionId, auth, hostOptions);

    suiteUtil = new MockedTestUtils(service, testPrefix);
    suiteUtil.setupSuite(done);
  });

  after(function (done) {
    deleteSqlServers(sqlServersToClean, function () {
      suiteUtil.teardownSuite(done);
    });
  });

  beforeEach(function (done) {
    suiteUtil.setupTest(done);
  });

  afterEach(function (done) {
    suiteUtil.baseTeardownTest(done);
  });

  describe('list SQL servers', function () {
    describe('No defined servers', function () {
      beforeEach(function (done) {
        service.listServers(function (err, sqlServers) {
          if (err) {
            return done(err);
          }
          deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), done);
        });
      });

      it('should return empty list of servers', function (done) {
        service.listServers(function (err, sqlServers) {
          should.exist(sqlServers);
          sqlServers.should.be.empty;
          done(err);
        });
      });
    });

    describe('when one server is defined', function () {
      beforeEach(function (done) {
        service.listServers(function (err, sqlServers) {
          deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), function () {
            service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, done);
          });
        });
      });

      it('should return one server in the list', function (done) {
        service.listServers(function (err, sqlServers) {
          should.exist(sqlServers);
          sqlServers.should.have.length(1);
          sqlServers[0].Location.should.equal(SERVER_LOCATION);
          done(err);
        });
      });
    });
  });

  describe('create server', function () {
    it('should succeed', function (done) {
      service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
        should.not.exist(err);
        name.should.not.be.null;
        done(err);
      });
    });
  });

  describe('delete server', function () {
    it('should fail if name is invalid', function (done) {
      service.deleteServer('!NotValid$', function (err, result) {
        should.exist(err);
        err.message.should.not.be.null;
        done();
      });
    });

    it('should succeed', function (done) {
      service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
        if (err) { return done(err); }
        service.deleteServer(name, function (err2) {
          should.not.exist(err2);

          done();
        });
      });
    });
  });

  describe('list Firewall Rules', function () {
    var serverName;

    beforeEach(function (done) {
      service.listServers(function (err, sqlServers) {
        deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), function () {
          service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
            serverName = name;
            done();
          });
        });
      });
    });

    afterEach(function (done) {
      service.deleteServer(serverName, done);
    });

    describe('No defined rules', function () {
      beforeEach(function (done) {
        service.listServerFirewallRules(serverName, function (err, rules) {
          deleteServerFirewallRules(rules.map(function (r) { return r.Name; }), done);
        });
      });

      it('should return empty list of rules', function (done) {
        service.listServerFirewallRules(serverName, function (err, rules) {
          should.exist(rules);
          rules.should.be.empty;
          done(err);
        });
      });
    });

    describe('when one rule is defined', function () {
      var name;

      beforeEach(function (done) {
        name = testutil.generateId('nodesdk', ruleNames, suiteUtil.isMocked);

        service.listServerFirewallRules(serverName, function (err, rules) {
          deleteServerFirewallRules(rules.map(function (r) { return r.Name; }), function () {
            service.createServerFirewallRule(serverName, name, '192.168.0.1', '192.168.0.255', done);
          });
        });
      });

      it('should return one rule in the list', function (done) {
        service.listServerFirewallRules(serverName, function (err, rules) {
          should.exist(rules);
          rules.should.have.length(1);
          rules[0].Name.should.equal(name);
          done(err);
        });
      });
    });
  });

  describe('create rule', function () {
    var serverName;

    beforeEach(function (done) {
      service.listServers(function (err, sqlServers) {
        deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), function () {
          service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
            serverName = name;
            done();
          });
        });
      });
    });

    afterEach(function (done) {
      service.deleteServer(serverName, done);
    });

    it('should succeed', function (done) {
      var ruleName = testutil.generateId('nodesdk', ruleNames, suiteUtil.isMocked);

      service.createServerFirewallRule(serverName, ruleName, '192.168.0.1', '192.168.0.255', function (err, rule) {
        should.not.exist(err);
        rule.Name.should.equal(ruleName);
        done(err);
      });
    });
  });

  describe('delete rule', function () {
    var serverName;

    beforeEach(function (done) {
      service.listServers(function (err, sqlServers) {
        deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), function () {
          service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
            serverName = name;
            done();
          });
        });
      });
    });

    afterEach(function (done) {
      service.deleteServer(serverName, done);
    });

    it('should fail if name is invalid', function (done) {
      service.deleteServerFirewallRule(serverName, '!NotValid$', function (err, result) {
        should.exist(err);
        err.message.should.not.be.null;
        done();
      });
    });

    it('should succeed if server exists and values are valid', function (done) {
      var ruleName = testutil.generateId('nodesdk', ruleNames, suiteUtil.isMocked);

      service.createServerFirewallRule(serverName, ruleName, '192.168.0.1', '192.168.0.255', function (err, rule) {
        if (err) { return done(err); }
        service.deleteServerFirewallRule(serverName, rule.Name, done);
      });
    });
  });

  describe('update rule', function () {
    var serverName;
    var ruleName;

    beforeEach(function (done) {
      ruleName = testutil.generateId('nodesdk', ruleNames, suiteUtil.isMocked);

      service.listServers(function (err, sqlServers) {
        deleteSqlServers(sqlServers.map(function (s) { return s.Name; }), function () {
          service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, name) {
            serverName = name;

            service.createServerFirewallRule(serverName, ruleName, '192.168.0.1', '192.168.0.255', done);
          });
        });
      });
    });

    afterEach(function (done) {
      service.deleteServer(serverName, done);
    });

    it('should succeed when server and rule exist', function (done) {
      service.updateServerFirewallRule(serverName, ruleName, '192.168.0.5', '192.168.0.255', function (err, rule) {
        should.not.exist(err);
        rule.Name.should.equal(ruleName);
        rule.StartIPAddress.should.equal('192.168.0.5');

        done(err);
      });
    });
  });

  describe('create database', function () {
    var serverName;

    beforeEach(function (done) {
      service.createServer(SERVER_ADMIN_USERNAME, SERVER_ADMIN_PASSWORD, SERVER_LOCATION, function (err, server) {
        if (err) { done(err); }
        serverName = server;
        done();
      });
    });

    afterEach(function (done) {
      service.deleteServer(serverName, done);
    });

    it('should create database with defaults', function (done) {
      service.createDatabase(serverName, 'db1', function (err, db) {
        if (err) { return done(err); }
        db.Name.should.equal('db1');
        db.Edition.should.equal('Web');
        db.MaxSizeGB.should.equal('1');
        db.CollationName.should.equal(SqlAzureConstants.DEFAULT_COLLATION_NAME);
        done();
      });
    });

    it('should create database with options', function (done) {
      service.createDatabase(serverName, 'db2', {
        edition: SqlAzureConstants.BUSINESS_EDITION,
        maxsize: SqlAzureConstants.BUSINESS_50GB
      }, function (err, db) {
        if (err) { return done(err); }
        db.Name.should.equal('db2');
        db.Edition.should.equal('Business');
        db.MaxSizeGB.should.equal('50');
        done();
      });
    });
  });

  function deleteSqlServers(sqlServers, callback) {
    if (sqlServers.length === 0) { return callback(); }
    var numDeleted = 0;
    sqlServers.forEach(function (sqlServerName) {
      service.deleteServer(sqlServerName, function () {
        ++numDeleted;
        if (numDeleted === sqlServers.length) {
          callback();
        }
      });
    });
  }

  function deleteServerFirewallRules(serverRules, callback) {
    if (serverRules.length === 0) { return callback(); }
    var numDeleted = 0;
    serverRules.forEach(function (rule) {
      service.deleteServerFirewallRule(serverName, rule, function () {
        ++numDeleted;
        if (numDeleted === serverRules.length) {
          callback();
        }
      });
    });
  }
});