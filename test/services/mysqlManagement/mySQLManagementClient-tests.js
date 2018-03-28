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
var util = require('util');
var msRestAzure = require('ms-rest-azure');

var SuiteBase = require('../../framework/suite-base');
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var MySQLManagementClient = require('../../../lib/services/mysqlManagement/lib/mySQLManagementClient');

const testPrefix = 'mysqlmanagementservice-tests';
const groupPrefix = 'nodeTestGroup';
const serverPrefix = 'testserver';
const databasePrefix = 'testdb';
const serverType = 'Microsoft.DBforMySQL/servers';
const databaseType = 'Microsoft.DBforMySQL/servers/databases';
const databaseCharset = 'latin1';
const mysqlAdmin = 'mysql';
const mysqlAdminPassword = 'F00Bar!!';
const readyState = 'Ready';

var suite;
var client;

var createdGroups = [];
var groupName;

var createdServers = [];
var serverName1;
var serverName2;

var createdDatabases = [];
var databaseName;

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'westus' }
];

var location;

describe('MySQL Management', function () {

  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      groupName = suite.generateId(groupPrefix, createdGroups, suite.isMocked);
      client = new MySQLManagementClient(suite.credentials, suite.subscriptionId);
      serverName1 = suite.generateId(serverPrefix, createdServers, suite.isMocked);
      serverName2 = suite.generateId(serverPrefix, createdServers, suite.isMocked);
      databaseName = suite.generateId(databasePrefix, createdDatabases, suite.isMocked);
      location = process.env['AZURE_TEST_LOCATION'];
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      suite.createResourcegroup(groupName, location, function (err, result) {
        should.not.exist(err);
        done();
      });
    });
  });

  after(function (done) {
    suite.teardownSuite(function () {
      suite.deleteResourcegroup(groupName, function (err, result) {
        should.not.exist(err);
        done();
      });
    });
  });
  
  beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  describe('servers', function () {

    it('should create a server correctly', function () {
      return client.servers.create(groupName, serverName1, {
        location: location,
        properties: {
          createMode: 'Default',
          administratorLogin: mysqlAdmin,
          administratorLoginPassword: mysqlAdminPassword
        }
      }).should.be.fulfilled().then((server) => {
        server.name.should.equal(serverName1);
        server.type.should.equal(serverType);
        server.location.should.equal(location);
        server.administratorLogin.should.equal(mysqlAdmin);
        server.userVisibleState.should.equal(readyState);
      });
    });

    it('should get the specified server', function () {
      return client.servers.get(
        groupName,
        serverName1
      ).should.be.fulfilled().then((server) => {
        server.name.should.equal(serverName1);
        server.type.should.equal(serverType);
        server.location.should.equal(location);
        server.administratorLogin.should.equal(mysqlAdmin);
        server.userVisibleState.should.equal(readyState);
      });
    });

    it('should list all the servers in the subscription', function () {
      return client.servers.list().should.be.fulfilled().then((servers) => {
        servers.length.should.equal(1);
      });
    });

    it('should list all the servers in the resourcegroup', function () {
      return client.servers.listByResourceGroup(
        groupName
      ).should.be.fulfilled().then((servers) => {
        servers.length.should.equal(1);
      });
    });

    it('should delete the specified server', function () {
      return client.servers.deleteMethod(
        groupName,
        serverName1
      ).should.be.fulfilled().then(() => {
        return client.servers.get(groupName, serverName1).should.be.rejected();
      });
    });

  });

  describe('databases', function () {

    before(function (done) {
      if (suite.isPlayback) {
        done();
      }
      client.servers.create(groupName, serverName2, {
        location: location,
        properties: {
          createMode: 'Default',
          administratorLogin: mysqlAdmin,
          administratorLoginPassword: mysqlAdminPassword
        }
      }).then(() => { done(); });
    });

    after(function (done) {
      if (suite.isPlayback) {
        done();
      }
      client.servers.deleteMethod(
        groupName,
        serverName2
      ).then(() => { done(); });
    });

    it('should create a database correctly', function () {
      return client.databases.createOrUpdate(
        groupName,
        serverName2,
        databaseName,
        {}
      ).should.be.fulfilled().then((database) => {
        database.name.should.equal(databaseName);
        database.type.should.equal(databaseType);
        database.charset.should.equal(databaseCharset);
      });
    });

    it('should get the specified database', function () {
      return client.databases.get(
        groupName,
        serverName2,
        databaseName
      ).should.be.fulfilled().then((database) => {
        database.name.should.equal(databaseName);
        database.type.should.equal(databaseType);
        database.charset.should.equal(databaseCharset);
      });
    });

    it('should list all the databases in the server', function () {
      return client.databases.listByServer(
        groupName,
        serverName2
      ).should.be.fulfilled().then((databases) => {
        databases.length.should.equal(1);
      });
    });

    it('should delete the specified database', function () {
      return client.databases.deleteMethod(
        groupName,
        serverName2,
        databaseName
      ).should.be.fulfilled().then(() => {
        return client.databases.get(
          groupName,
          serverName2
        ).should.be.rejected();
      });
    });

  });

});
