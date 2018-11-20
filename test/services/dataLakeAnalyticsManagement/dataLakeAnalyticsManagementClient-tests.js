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
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');

var dump = util.inspect;

var DataLakeAnalyticsAccountManagementClient = require('../../../lib/services/dataLake.Analytics/lib/account/dataLakeAnalyticsAccountManagementClient');
var DataLakeStoreAccountManagementClient = require('../../../lib/services/datalake.Store/lib/account/dataLakeStoreAccountManagementClient');
var DataLakeAnalyticsJobManagementClient = require('../../../lib/services/dataLake.Analytics/lib/job/dataLakeAnalyticsJobManagementClient');
var DataLakeAnalyticsCatalogManagementClient = require('../../../lib/services/dataLake.Analytics/lib/catalog/dataLakeAnalyticsCatalogManagementClient');
var ResourceManagementClient = require('../../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var StorageManagementClient = require('../../../lib/services/storageManagement2/lib/storageManagementClient');

var testPrefix = 'datalakeAnalyticsManagement-tests';
var accountPrefix = 'xplattestadla';
var storeAccountPrefix = 'xplattestadls';
var catalogItemPrefix = 'adlacatalogitem';
var knownNames = [];

var requiredEnvironment = [
  { name: 'AZURE_TEST_LOCATION', defaultValue: 'East US 2'},
  {name: 'AZURE_TEST_RESOURCE_GROUP', defaultValue: 'xplattestadlarg05'}
];

// setup the client variables
var suite;
var accountClient;
var jobClient;
var catalogClient;
var resourceClient;
var storageClient;
var adlsClient;

// setup the test variables (accounts, jobs, etc.)
var testLocation;
var testResourceGroup;
var secondResourceGroup;

var accountName;
var jobAndCatalogAccountName;
var storeAccountName;
var additionalStoreAccountName;
var azureBlobAccountName;
var azureBlobAccountKey;

var script = 'DROP DATABASE IF EXISTS FOO; CREATE DATABASE FOO; DROP DATABASE IF EXISTS FOO;';
var jobName = 'xplattestjob';
var jobAndCatalogDnsSuffix = 'azuredatalakeanalytics.net';
var filesystemDnsSuffix = 'azuredatalakestore.net';
var baseUri = 'https://management.azure.com';
if(process.env['AZURE_ENVIRONMENT'] && process.env['AZURE_ENVIRONMENT'].toUpperCase() === 'DOGFOOD') {
  jobAndCatalogDnsSuffix = 'konaaccountdogfood.net';
  filesystemDnsSuffix = 'caboaccountdogfood.net';
  baseUri = 'https://api-dogfood.resources.windows-int.net'
}

// catalog item names
var dbName;
var tableName;
var tvfName;
var viewName;
var procName;
var secretName;
var secretPwd;
var credName;

describe('Data Lake Analytics Clients (Account, Job and Catalog)', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      resourceClient = new ResourceManagementClient(suite.credentials, suite.subscriptionId, baseUri);
      storageClient = new StorageManagementClient(suite.credentials, suite.subscriptionId, baseUri);
      accountClient = new DataLakeAnalyticsAccountManagementClient(suite.credentials, suite.subscriptionId, baseUri);
      adlsClient = new DataLakeStoreAccountManagementClient(suite.credentials, suite.subscriptionId, baseUri);
      
      var jobOptions = {
        adlaJobDnsSuffix: jobAndCatalogDnsSuffix
      };
      
      var catalogOptions = {
        adlaCatalogDnsSuffix: jobAndCatalogDnsSuffix
      };
      
      jobClient = new DataLakeAnalyticsJobManagementClient(suite.credentials, jobOptions);
      catalogClient = new DataLakeAnalyticsCatalogManagementClient(suite.credentials, catalogOptions);
      
      testLocation = process.env['AZURE_TEST_LOCATION'];
      testLocation = testLocation.toLowerCase().replace(/ /g, '');
      testResourceGroup = process.env['AZURE_TEST_RESOURCE_GROUP'];
      secondResourceGroup = suite.generateId(accountPrefix, knownNames);
      accountName = suite.generateId(accountPrefix, knownNames);
      jobAndCatalogAccountName = suite.generateId(accountPrefix, knownNames);
      storeAccountName = suite.generateId(storeAccountPrefix, knownNames);
      additionalStoreAccountName = suite.generateId(storeAccountPrefix, knownNames);
      azureBlobAccountName = suite.generateId(storeAccountPrefix, knownNames);
      dbName = suite.generateId(catalogItemPrefix, knownNames);
      tableName = suite.generateId(catalogItemPrefix, knownNames);
      tvfName = suite.generateId(catalogItemPrefix, knownNames);
      viewName = suite.generateId(catalogItemPrefix, knownNames);
      procName = suite.generateId(catalogItemPrefix, knownNames);
      secretName = suite.generateId(catalogItemPrefix, knownNames);
      secretPwd = suite.generateId(catalogItemPrefix, knownNames);
      credName = suite.generateId(catalogItemPrefix, knownNames);
      
      // construct all of the parameter objects
      var adlsAccount = {
        location: testLocation
      };
      
      var secondAdlsAccount = {
        location: testLocation
      };
      
      var adlaAccount = {
        location: testLocation,
        defaultDataLakeStoreAccount: storeAccountName,
        dataLakeStoreAccounts: [
          {
            name: storeAccountName
          }
        ]
      };
      
      var storageAccount = {
        location: testLocation,
        sku: {
          name: 'Standard_GRS',
        },
        kind: 'Storage',
      };
      
      if(!suite.isPlayback) {
        resourceClient.resourceGroups.createOrUpdate(testResourceGroup, {location: testLocation}, function (err) {
          should.not.exist(err);
          resourceClient.resourceGroups.createOrUpdate(secondResourceGroup, {location: testLocation}, function (err) {
            should.not.exist(err);
            adlsClient.accounts.create(testResourceGroup, storeAccountName, adlsAccount, function(err) {
              should.not.exist(err);
              adlsClient.accounts.create(testResourceGroup, additionalStoreAccountName, secondAdlsAccount, function(err) {
                should.not.exist(err);
                storageClient.storageAccounts.create(testResourceGroup, azureBlobAccountName, storageAccount, function (err) {
                  should.not.exist(err);
                  // create an account for job and catalog operations
                  accountClient.account.create(testResourceGroup, jobAndCatalogAccountName, adlaAccount, function (err) {
                    should.not.exist(err);
                    setTimeout(function () {
                      done();
                    }, 30); // quick sleep to ensure that it finishes.
                  });
                });
              });
            });
          });
        });
      }
      else {
        accountClient.longRunningOperationRetryTimeout = 0;
        done();
      }
    });
  });

  after(function (done) {
    // this is required as a work around to ensure that the datalake analytics account does not get left behind and stuck in the "deleting" state if its storage gets deleted out from under it
    if(!suite.isPlayback) {
      setTimeout(function () {
        accountClient.account.deleteMethod(testResourceGroup, jobAndCatalogAccountName, function () {
          accountClient.account.deleteMethod(testResourceGroup, accountName, function () {
            resourceClient.resourceGroups.deleteMethod(secondResourceGroup, function () {
              resourceClient.resourceGroups.deleteMethod(testResourceGroup, function () {
                suite.teardownSuite(done);
              });
            });
          });
        });                  
      }, 30); // quick sleep to ensure that it finishes.
    }
    else {
      suite.teardownSuite(done);
    }
  });

  beforeEach(function (done) {
    suite.setupTest(done);
  });

  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  describe('Data Lake Analytics Account', function () {
    it('create command should work', function (done) {
      // define the account to create
      var accountToCreate = {
        tags: {
          testtag1: 'testvalue1',
          testtag2: 'testvalue2'
        },
        location: testLocation,
        defaultDataLakeStoreAccount: storeAccountName,
        dataLakeStoreAccounts: [
          {
            name: storeAccountName
          }
        ]
      };

      accountClient.account.create(testResourceGroup, accountName, accountToCreate, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.be.equal(accountName);
        Object.keys(result.tags).length.should.be.equal(2);
        done();
      });
    });

    it('create account with same name should fail', function (done) {
      // define the account to create
      var accountToCreate = {
        tags: {
          testtag1: 'testvalue1',
          testtag2: 'testvalue2'
        },
        location: testLocation,
        defaultDataLakeStoreAccount: storeAccountName,
        dataLakeStoreAccounts: [
          {
            name: storeAccountName
          }
        ]
      };
      accountClient.account.create(secondResourceGroup, accountName, accountToCreate, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.statusCode.should.equalOneOf([400, 409]);
        done();
      });
    });

    it('get command should work', function (done) {
      accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.name.should.be.equal(jobAndCatalogAccountName);
        done();
      });
    });

    it('list commands should work', function (done) {
      accountClient.account.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        var accountList = result;
        accountList.length.should.be.above(0);
        
        // list within resource group as well.
        accountClient.account.listByResourceGroup(testResourceGroup, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          var accountList = result;
          accountList.length.should.be.above(0);
          done();
        });
      });
    });

    it('updating the account should work', function (done) {
      // define the account to update
      var accountToUpdate = {
        parameters: {
          tags: {
            testtag1: 'testvalue1',
            testtag2: 'testvalue2',
            testtag3: 'testvalue3'
          }
        }
      };
      
      accountClient.account.update(testResourceGroup, jobAndCatalogAccountName, accountToUpdate, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.name.should.be.equal(jobAndCatalogAccountName);
        Object.keys(result.tags).length.should.be.equal(3);
        done();
      });
    });
    
    it('adding and removing data lake storage accounts to the account should work', function (done) {
      var options = {
        suffix: filesystemDnsSuffix
      };

      accountClient.dataLakeStoreAccounts.add(testResourceGroup, jobAndCatalogAccountName, additionalStoreAccountName, options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.dataLakeStoreAccounts.length.should.be.equal(2);
          accountClient.dataLakeStoreAccounts.deleteMethod(testResourceGroup, jobAndCatalogAccountName, additionalStoreAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.not.exist(result);
            response.statusCode.should.equal(200);
            accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.dataLakeStoreAccounts.length.should.be.equal(1);
              done();
            });
          });
        });
      });
    });
    
    it('adding and removing blob storage accounts to the account should work', function (done) {
      storageClient.storageAccounts.listKeys(testResourceGroup, azureBlobAccountName, function (err, result) {
        azureBlobAccountKey = result.keys[0].value;
        var storageParams = {
          accessKey: azureBlobAccountKey
        };
        accountClient.storageAccounts.add(testResourceGroup, jobAndCatalogAccountName, azureBlobAccountName, storageParams, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
          accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.storageAccounts.length.should.be.equal(1);
            accountClient.storageAccounts.deleteMethod(testResourceGroup, jobAndCatalogAccountName, azureBlobAccountName, function (err, result, request, response) {
              should.not.exist(err);
              should.not.exist(result);
              response.statusCode.should.equal(200);
              accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.storageAccounts.length.should.be.equal(0);
                done();
              });
            });
          });
        });
      });
    });
    
    it('Delete command should work', function (done) {
      accountClient.account.deleteMethod(testResourceGroup, accountName, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equalOneOf([200, 204]);
        accountClient.account.get(testResourceGroup, accountName, function (err, result, request, response) {
          should.exist(err);
          should.not.exist(result);
          err.statusCode.should.equal(404);
          done();
        });
      });
    });
  });
  describe('Data Lake Analytics Job', function () {
    it('create and show commands should work', function (done) {
      var job = {
        jobId: suite.generateGuid(),
        name: jobName,
        type: 'USql', // NOTE: We do not support hive jobs yet.
        properties: {
          type: 'USql',
          script: script
        }
      };
      
      jobClient.job.create(jobAndCatalogAccountName, job.jobId, job, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.jobId.should.not.be.empty;
        var jobId = result.jobId;
        result.name.should.be.equal(jobName);
        listPoll(suite, 10, jobAndCatalogAccountName, result.jobId, function (err, result, request, response) {
          jobClient.job.get(jobAndCatalogAccountName, jobId, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.result.should.be.equal('Succeeded');
            // result.properties.statistics.length.should.be.above(0); // Statistics are not currently included in catalog CRUD operations. Will uncomment this when that changes.
            // now build a job and verify the diagnostics
            job.properties.script = 'DROP DATABASE IF EXIST FOO; CREATE DATABASE FOO;';
            jobClient.job.build(jobAndCatalogAccountName, job, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.properties.diagnostics.length.should.be.equal(1);
              result.properties.diagnostics[0].severity.should.be.equal('Error');
              result.properties.diagnostics[0].columnNumber.should.be.equal(18);
              result.properties.diagnostics[0].end.should.be.equal(22);
              result.properties.diagnostics[0].start.should.be.equal(17);
              result.properties.diagnostics[0].lineNumber.should.be.equal(1);
              result.properties.diagnostics[0].message.indexOf('E_CSC_USER_SYNTAXERROR').should.not.be.equal(-1);
              done();
            });
          });
        });
      });
    });
    
    it('create and cancel job should work', function (done) {
      var job = {
        jobId: suite.generateGuid(),
        name: jobName,
        type: 'USql', // NOTE: We do not support hive jobs yet.
        properties: {
          type: 'USql',
          script: script
        }
      };
      
      jobClient.job.create(jobAndCatalogAccountName, job.jobId, job, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.jobId.should.not.be.empty;
        var jobId = result.jobId;
        result.name.should.be.equal(jobName);
        jobClient.job.cancel(jobAndCatalogAccountName, jobId, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
          jobClient.job.get(jobAndCatalogAccountName, jobId, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.result.should.be.equal('Cancelled');
            done();
          });  
        });
      });
    });

    it('list command should work', function (done) {
      jobClient.job.list(jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.length.should.be.above(0);
        done();
      });
    });
  });
  describe('Data Lake Analytics Catalog', function () {
    it('list commands should work', function (done) {
      var scriptToRun = 'DROP DATABASE IF EXISTS ' + dbName + '; CREATE DATABASE ' + dbName + '; CREATE TABLE ' + dbName + '.dbo.' + tableName + '( UserId int, Start DateTime, Region string, Query string, Duration int, Urls string, ClickedUrls string, INDEX idx1 CLUSTERED (Region ASC) PARTITIONED BY (UserId) HASH (Region)); ALTER TABLE ' + dbName + '.dbo.' + tableName + ' ADD IF NOT EXISTS PARTITION (1); DROP FUNCTION IF EXISTS ' + dbName + '.dbo.' + tvfName + '; CREATE FUNCTION ' + dbName + '.dbo.' + tvfName + '() RETURNS @result TABLE ( s_date DateTime, s_time string, s_sitename string, cs_method string, cs_uristem string, cs_uriquery string, s_port int, cs_username string, c_ip string, cs_useragent string, cs_cookie string, cs_referer string, cs_host string, sc_status int, sc_substatus int, sc_win32status int, sc_bytes int, cs_bytes int, s_timetaken int) AS BEGIN @result = EXTRACT s_date DateTime, s_time string, s_sitename string, cs_method string, cs_uristem string, cs_uriquery string, s_port int, cs_username string, c_ip string, cs_useragent string, cs_cookie string, cs_referer string, cs_host string, sc_status int, sc_substatus int, sc_win32status int, sc_bytes int, cs_bytes int, s_timetaken int FROM @"/Samples/Data/WebLog.log" USING Extractors.Text(delimiter:\' \'); RETURN; END; CREATE VIEW ' + dbName + '.dbo.' + viewName + ' AS SELECT * FROM ( VALUES(1,2),(2,4) ) AS T(a, b); CREATE PROCEDURE ' + dbName + '.dbo.' + procName + '() AS BEGIN CREATE VIEW ' + dbName + '.dbo.' + viewName + ' AS SELECT * FROM ( VALUES(1,2),(2,4) ) AS T(a, b); END;';
      // Get the default database (master) and all databases.
      catalogClient.catalog.getDatabase(jobAndCatalogAccountName, 'master', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.name.should.be.equal('master');
        // add a database, table, tvf, view and procedure
        var job = {
          jobId: suite.generateGuid(),
          name: jobName,
          type: 'USql', // NOTE: We do not support hive jobs yet.
          properties: {
            type: 'USql',
            script: scriptToRun
          }
        };
        jobClient.job.create(jobAndCatalogAccountName, job.jobId, job, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.jobId.should.not.be.empty;
          var jobId = result.jobId;
          result.name.should.be.equal(jobName);
          listPoll(suite, 10, jobAndCatalogAccountName, result.jobId, function (err, result, request, response) {
            jobClient.job.get(jobAndCatalogAccountName, jobId, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.result.should.be.equal('Succeeded');
              // list all databases and confirm that there are now at least two.
              catalogClient.catalog.listDatabases(jobAndCatalogAccountName, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.length.should.be.above(1);
                // now get the specific database we created
                catalogClient.catalog.getDatabase(jobAndCatalogAccountName, dbName, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  response.statusCode.should.equal(200);
                  result.name.should.be.equal(dbName);
                  // list all tables in the db and confirm that there is one entry.
                  catalogClient.catalog.listTables(jobAndCatalogAccountName, dbName, 'dbo', function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.length.should.be.equal(1);
                    // now get the specific table we created
                    catalogClient.catalog.getTable(jobAndCatalogAccountName, dbName, 'dbo', tableName, function (err, result, request, response) {
                      should.not.exist(err);
                      should.exist(result);
                      response.statusCode.should.equal(200);
                      result.name.should.be.equal(tableName);
                      // list all table partitions in the table and confirm that there is one entry.
                      catalogClient.catalog.listTablePartitions(jobAndCatalogAccountName, dbName, 'dbo', tableName, function (err, result, request, response) {
                        should.not.exist(err);
                        should.exist(result);
                        response.statusCode.should.equal(200);
                        result.length.should.be.equal(1);
                        var singlePartition = result[0];
                        // now get the specific table partition we created
                        catalogClient.catalog.getTablePartition(jobAndCatalogAccountName, dbName, 'dbo', tableName, singlePartition.name, function (err, result, request, response) {
                          should.not.exist(err);
                          should.exist(result);
                          response.statusCode.should.equal(200);
                          result.name.should.be.equal(singlePartition.name);
                          // list all tvfs in the db and confirm that there is one entry.
                          catalogClient.catalog.listTableValuedFunctions(jobAndCatalogAccountName, dbName, 'dbo', function (err, result, request, response) {
                            should.not.exist(err);
                            should.exist(result);
                            response.statusCode.should.equal(200);
                            result.length.should.be.equal(1);
                            // now get the specific tvf we created
                            catalogClient.catalog.getTableValuedFunction(jobAndCatalogAccountName, dbName, 'dbo', tvfName, function (err, result, request, response) {
                              should.not.exist(err);
                              should.exist(result);
                              response.statusCode.should.equal(200);
                              result.name.should.be.equal(tvfName);
                              // list all views in the db and confirm that there is one entry.
                              catalogClient.catalog.listViews(jobAndCatalogAccountName, dbName, 'dbo', function (err, result, request, response) {
                                should.not.exist(err);
                                should.exist(result);
                                response.statusCode.should.equal(200);
                                result.length.should.be.equal(1);
                                // now get the specific view we created
                                catalogClient.catalog.getView(jobAndCatalogAccountName, dbName, 'dbo', viewName, function (err, result, request, response) {
                                  should.not.exist(err);
                                  should.exist(result);
                                  response.statusCode.should.equal(200);
                                  result.name.should.be.equal(viewName);
                                  // list all procedures in the db and confirm that there is one entry.
                                  catalogClient.catalog.listProcedures(jobAndCatalogAccountName, dbName, 'dbo', function (err, result, request, response) {
                                    should.not.exist(err);
                                    should.exist(result);
                                    response.statusCode.should.equal(200);
                                    result.length.should.be.equal(1);
                                    // now get the specific procedure we created
                                    catalogClient.catalog.getProcedure(jobAndCatalogAccountName, dbName, 'dbo', procName, function (err, result, request, response) {
                                      should.not.exist(err);
                                      should.exist(result);
                                      response.statusCode.should.equal(200);
                                      result.name.should.be.equal(procName);
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
                });
              });
            });
          });
        });
      });
    });
    
    it('create set get and delete commands should work for secrets', function (done) {
      var secretCreateParameters = {
        password: secretPwd,
        uri: 'https://psrreporthistory.database.windows.net:443'
      };
      
      // TODO: secret creation is still supported and hasn't been removed from REST, but credential creation using secrets has.
      // as a result, we will keep these tests but removed the unsupported part. Eventually, secret CRUD will be completely removed.
      var setSecretPwd = 'clitestsetsecretpwd';
      var databaseName = 'master';
      var secondSecretName = secretName + 'dup';
      
      catalogClient.catalog.createSecret(jobAndCatalogAccountName, databaseName, secretName, secretCreateParameters, function (err, result, request, response) {
        should.not.exist(err);
        // should.exist(result);
        response.statusCode.should.equal(200);
        // update the secret's password
        secretCreateParameters.password = setSecretPwd;
        catalogClient.catalog.updateSecret(jobAndCatalogAccountName, databaseName, secretName, secretCreateParameters, function (err, result, request, response) {
          should.not.exist(err);
          // should.exist(result);
          response.statusCode.should.equal(200);
          // Create another secret
          catalogClient.catalog.createSecret(jobAndCatalogAccountName, databaseName, secondSecretName, secretCreateParameters, function (err, result, request, response) {
            should.not.exist(err);
            response.statusCode.should.equal(200);
            // attempt to create the secret again (should throw)
            catalogClient.catalog.createSecret(jobAndCatalogAccountName, databaseName, secondSecretName, secretCreateParameters, function (err, result, request, response) {
              should.exist(err);
              err.statusCode.should.equal(409);
              // get the secret
              catalogClient.catalog.getSecret(jobAndCatalogAccountName, databaseName, secretName, function(err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.creationTime.should.not.be.empty;
                // delete the secret
                catalogClient.catalog.deleteSecret(jobAndCatalogAccountName, databaseName, secretName, function(err, result, request, response) {
                  should.not.exist(err);
                  should.not.exist(result);
                  response.statusCode.should.equal(200);
                  // try to set the secret again (should fail)
                  catalogClient.catalog.updateSecret(jobAndCatalogAccountName, databaseName, secretName, secretCreateParameters, function(err, result, request, response) {
                    should.exist(err);
                    should.not.exist(result);
                    err.statusCode.should.equal(404);
                    // delete all secrets
                    catalogClient.catalog.deleteAllSecrets(jobAndCatalogAccountName, databaseName, function(err, result, request, response) {
                      should.not.exist(err);
                      should.not.exist(result);
                      response.statusCode.should.equal(200);
                      // try to set the second secret again (should fail)
                      catalogClient.catalog.updateSecret(jobAndCatalogAccountName, databaseName, secondSecretName, secretCreateParameters, function(err, result, request, response) {
                        should.exist(err);
                        should.not.exist(result);
                        err.statusCode.should.equal(404);
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
  });
});


function listPoll(suite, attemptsLeft, accountName, jobId, callback) {
  if (attemptsLeft === 0) {
    throw new Error('azure datalake analytics job show --accountName ' + accountName + ' --jobId ' + jobId + ' : Timeout expired for job execution');
  }

  var objectFound = false;
  jobClient.job.get(jobAndCatalogAccountName, jobId, function (err, result, request, response) {
    should.not.exist(err);
    should.exist(result);
    response.statusCode.should.equal(200);
    if (response) {
      objectFound = result.state === 'Ended';
    }
    if (objectFound === true) {
      callback(response);
    }
    else {
      if(!suite.isPlayback) {
        setTimeout(function () {
          listPoll(suite, attemptsLeft - 1, accountName, jobId, callback);
        }, 30000);
      }
      else {
        listPoll(suite, attemptsLeft - 1, accountName, jobId, callback);
      }
    }
  });
}