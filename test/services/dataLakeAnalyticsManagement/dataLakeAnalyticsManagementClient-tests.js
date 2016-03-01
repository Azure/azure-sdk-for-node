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
var DataLakeStoreAccountManagementClient = require('../../../lib/services/dataLake.Store/lib/account/dataLakeStoreAccountManagementClient');
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
var jobAndCatalogDnsSuffix = 'azuredatalakeanalytics.net'; // TODO: Make this configurable for dogfood environments
var filesystemDnsSuffix = 'azuredatalakestore.net'; // TODO: Make this configurable for dogfood environments
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
      resourceClient = new ResourceManagementClient(suite.credentials, suite.subscriptionId);
      storageClient = new StorageManagementClient(suite.credentials, suite.subscriptionId);
      accountClient = new DataLakeAnalyticsAccountManagementClient(suite.credentials, suite.subscriptionId);
      adlsClient = new DataLakeStoreAccountManagementClient(suite.credentials, suite.subscriptionId);
      jobClient = new DataLakeAnalyticsJobManagementClient(suite.credentials, suite.subscriptionId, jobAndCatalogDnsSuffix);
      catalogClient = new DataLakeAnalyticsCatalogManagementClient(suite.credentials, suite.subscriptionId, jobAndCatalogDnsSuffix);
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
        name: storeAccountName,
        location: testLocation
      };
      
      var secondAdlsAccount = {
        name: additionalStoreAccountName,
        location: testLocation
      };
      
      var adlaAccount = {
        name: jobAndCatalogAccountName,
        location: testLocation,
        properties: {
          defaultDataLakeStoreAccount: storeAccountName,
          dataLakeStoreAccounts: [
            {
              name: storeAccountName
            }
          ]
        }
      };
      
      var storageAccount = {
        location: testLocation,
        accountType: 'Standard_GRS'
      };
      
      if(!suite.isPlayback) {
        resourceClient.resourceGroups.createOrUpdate(testResourceGroup, {location: testLocation}, function (err) {
          should.not.exist(err);
          resourceClient.resourceGroups.createOrUpdate(secondResourceGroup, {location: testLocation}, function (err) {
            should.not.exist(err);
            adlsClient.account.create(testResourceGroup, storeAccountName, adlsAccount, function(err) {
              should.not.exist(err);
              adlsClient.account.create(testResourceGroup, additionalStoreAccountName, secondAdlsAccount, function(err) {
                should.not.exist(err);
                storageClient.storageAccounts.create(testResourceGroup, azureBlobAccountName, storageAccount, function (err) {
                  should.not.exist(err);
                  // create an account for job and catalog operations
                  accountClient.account.create(testResourceGroup, jobAndCatalogAccountName, adlaAccount, function (err) {
                    should.not.exist(err);
                    setTimeout(function () {
                      done();
                    }, 120000); // sleep for two minutes to guarantee that the queue has been created to run jobs against
                  });
                });
              });
            });
          });
        });
      }
      else {
        accountClient.longRunningOperationRetryTimeoutInSeconds = 0;
        done();
      }
    });
  });

  after(function (done) {
    // this is required as a work around to ensure that the datalake analytics account does not get left behind and stuck in the "deleting" state if its storage gets deleted out from under it.
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
      }, 60000); // sleep for one minute before attempting to delete the analytics account.
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
        name: accountName,
        location: testLocation,
        properties: {
          defaultDataLakeStoreAccount: storeAccountName,
          dataLakeStoreAccounts: [
            {
              name: storeAccountName
            }
          ]
        }
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
        name: accountName,
        location: testLocation,
        properties: {
          defaultDataLakeStoreAccount: storeAccountName,
          dataLakeStoreAccounts: [
            {
              name: storeAccountName
            }
          ]
        }
      };
      accountClient.account.create(testResourceGroup, accountName, accountToCreate, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.statusCode.should.equalOneOf([400, 409]); //TODO: need to update to just 409 when fixed in the service.
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
          tags: {
            testtag1: 'testvalue1',
            testtag2: 'testvalue2',
            testtag3: 'testvalue3'
          },
          name: jobAndCatalogAccountName
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
        properties: {
          suffix: filesystemDnsSuffix
        }
      };

      accountClient.account.addDataLakeStoreAccount(testResourceGroup, jobAndCatalogAccountName, additionalStoreAccountName, options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.properties.dataLakeStoreAccounts.length.should.be.equal(2);
          accountClient.account.deleteDataLakeStoreAccount(testResourceGroup, jobAndCatalogAccountName, additionalStoreAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.not.exist(result);
            response.statusCode.should.equal(200);
            accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.properties.dataLakeStoreAccounts.length.should.be.equal(1);
              done();
            });
          });
        });
      });
    });
    
    it('adding and removing blob storage accounts to the account should work', function (done) {
      storageClient.storageAccounts.listKeys(testResourceGroup, azureBlobAccountName, function (err, result) {
        azureBlobAccountKey = result.key1;
        var storageParams = {
          properties: {
            accessKey: azureBlobAccountKey
          }
        };
        accountClient.account.addStorageAccount(testResourceGroup, jobAndCatalogAccountName, azureBlobAccountName, storageParams, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
          accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.properties.storageAccounts.length.should.be.equal(1);
            accountClient.account.deleteStorageAccount(testResourceGroup, jobAndCatalogAccountName, azureBlobAccountName, function (err, result, request, response) {
              should.not.exist(err);
              should.not.exist(result);
              response.statusCode.should.equal(200);
              accountClient.account.get(testResourceGroup, jobAndCatalogAccountName, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.properties.storageAccounts.length.should.be.equal(0);
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
      
      jobClient.job.create(job.jobId, job, jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.jobId.should.not.be.empty;
        var jobId = result.jobId;
        result.name.should.be.equal(jobName);
        listPoll(suite, 10, jobAndCatalogAccountName, result.jobId, function (err, result, request, response) {
          jobClient.job.get(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.result.should.be.equal('Succeeded');
            // result.properties.statistics.length.should.be.above(0); // Statistics are not currently included in catalog CRUD operations. Will uncomment this when that changes.
            done();
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
      
      jobClient.job.create(job.jobId, job, jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.jobId.should.not.be.empty;
        var jobId = result.jobId;
        result.name.should.be.equal(jobName);
        jobClient.job.cancel(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
          jobClient.job.get(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
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
      var scriptToRun = 'DROP DATABASE IF EXISTS ' + dbName + '; CREATE DATABASE ' + dbName + '; CREATE TABLE ' + dbName + '.dbo.' + tableName + '( UserId int, Start DateTime, Region string, Query string, Duration int, Urls string, ClickedUrls string, INDEX idx1 CLUSTERED (Region ASC) PARTITIONED BY HASH (Region)); DROP FUNCTION IF EXISTS ' + dbName + '.dbo.' + tvfName + '; CREATE FUNCTION ' + dbName + '.dbo.' + tvfName + '() RETURNS @result TABLE ( s_date DateTime, s_time string, s_sitename string, cs_method string, cs_uristem string, cs_uriquery string, s_port int, cs_username string, c_ip string, cs_useragent string, cs_cookie string, cs_referer string, cs_host string, sc_status int, sc_substatus int, sc_win32status int, sc_bytes int, cs_bytes int, s_timetaken int) AS BEGIN @result = EXTRACT s_date DateTime, s_time string, s_sitename string, cs_method string, cs_uristem string, cs_uriquery string, s_port int, cs_username string, c_ip string, cs_useragent string, cs_cookie string, cs_referer string, cs_host string, sc_status int, sc_substatus int, sc_win32status int, sc_bytes int, cs_bytes int, s_timetaken int FROM @"/Samples/Data/WebLog.log" USING Extractors.Text(delimiter:\' \'); RETURN; END; CREATE VIEW ' + dbName + '.dbo.' + viewName + ' AS SELECT * FROM ( VALUES(1,2),(2,4) ) AS T(a, b); CREATE PROCEDURE ' + dbName + '.dbo.' + procName + '() AS BEGIN CREATE VIEW ' + dbName + '.dbo.' + viewName + ' AS SELECT * FROM ( VALUES(1,2),(2,4) ) AS T(a, b); END;';
      // Get the default database (master) and all databases.
      catalogClient.catalog.getDatabase('master', jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.databaseName.should.be.equal('master');
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
        jobClient.job.create(job.jobId, job, jobAndCatalogAccountName, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.jobId.should.not.be.empty;
          var jobId = result.jobId;
          result.name.should.be.equal(jobName);
          listPoll(suite, 10, jobAndCatalogAccountName, result.jobId, function (err, result, request, response) {
            jobClient.job.get(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
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
                catalogClient.catalog.getDatabase(dbName, jobAndCatalogAccountName, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  response.statusCode.should.equal(200);
                  result.databaseName.should.be.equal(dbName);
                  // list all tables in the db and confirm that there is one entry.
                  catalogClient.catalog.listTables(dbName, 'dbo', jobAndCatalogAccountName, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.length.should.be.equal(1);
                    // now get the specific table we created
                    catalogClient.catalog.getTable(dbName, 'dbo', tableName, jobAndCatalogAccountName, function (err, result, request, response) {
                      should.not.exist(err);
                      should.exist(result);
                      response.statusCode.should.equal(200);
                      result.tableName.should.be.equal(tableName);
                      // list all tvfs in the db and confirm that there is one entry.
                      catalogClient.catalog.listTableValuedFunctions(dbName, 'dbo', jobAndCatalogAccountName, function (err, result, request, response) {
                        should.not.exist(err);
                        should.exist(result);
                        response.statusCode.should.equal(200);
                        result.length.should.be.equal(1);
                        // now get the specific tvf we created
                        catalogClient.catalog.getTableValuedFunction(dbName, 'dbo', tvfName, jobAndCatalogAccountName, function (err, result, request, response) {
                          should.not.exist(err);
                          should.exist(result);
                          response.statusCode.should.equal(200);
                          result.tvfName.should.be.equal(tvfName);
                          // list all views in the db and confirm that there is one entry.
                          catalogClient.catalog.listViews(dbName, 'dbo', jobAndCatalogAccountName, function (err, result, request, response) {
                            should.not.exist(err);
                            should.exist(result);
                            response.statusCode.should.equal(200);
                            result.length.should.be.equal(1);
                            // now get the specific view we created
                            catalogClient.catalog.getView(dbName, 'dbo', viewName, jobAndCatalogAccountName, function (err, result, request, response) {
                              should.not.exist(err);
                              should.exist(result);
                              response.statusCode.should.equal(200);
                              result.viewName.should.be.equal(viewName);
                              // list all procedures in the db and confirm that there is one entry.
                              catalogClient.catalog.listProcedures(dbName, 'dbo', jobAndCatalogAccountName, function (err, result, request, response) {
                                should.not.exist(err);
                                should.exist(result);
                                response.statusCode.should.equal(200);
                                result.length.should.be.equal(1);
                                // now get the specific procedure we created
                                catalogClient.catalog.getProcedure(dbName, 'dbo', procName, jobAndCatalogAccountName, function (err, result, request, response) {
                                  should.not.exist(err);
                                  should.exist(result);
                                  response.statusCode.should.equal(200);
                                  result.procName.should.be.equal(procName);
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
    
    it('create set get and delete commands should work for secrets', function (done) {
      var secretCreateParameters = {
        password: secretPwd,
        uri: 'https://psrreporthistory.database.windows.net:443'
      };
      
      var setSecretPwd = 'clitestsetsecretpwd';
      var databaseName = 'master';
      var scriptToRun = 'USE ' + databaseName + '; CREATE CREDENTIAL ' + credName + ' WITH USER_NAME = "scope@rkm4grspxa", IDENTITY = "' + secretName + '";';
      // Get the default database (master) and all databases.
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
      
      catalogClient.catalog.createSecret(databaseName, secretName, secretCreateParameters, jobAndCatalogAccountName, function (err, result, request, response) {
        should.not.exist(err);
        // should.exist(result);
        response.statusCode.should.equal(200);
        // update the secret's password
        secretCreateParameters.password = setSecretPwd;
        catalogClient.catalog.updateSecret(databaseName, secretName, secretCreateParameters, jobAndCatalogAccountName, function (err, result, request, response) {
          should.not.exist(err);
          // should.exist(result);
          response.statusCode.should.equal(200);
          // Create a credential that uses the secret
          jobClient.job.create(job.jobId, job, jobAndCatalogAccountName, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.jobId.should.not.be.empty;
            var jobId = result.jobId;
            result.name.should.be.equal(jobName);
            listPoll(suite, 10, jobAndCatalogAccountName, result.jobId, function (err, result, request, response) {
              jobClient.job.get(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.result.should.be.equal('Succeeded');
                // list all credentials in the db and confirm that there is one entry.
                catalogClient.catalog.listCredentials(databaseName, jobAndCatalogAccountName, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  response.statusCode.should.equal(200);
                  result.length.should.be.equal(1);
                  // now get the specific credential we created
                  catalogClient.catalog.getCredential(databaseName, credName, jobAndCatalogAccountName, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.credentialName.should.be.equal(credName);
                    // get the secret
                    catalogClient.catalog.getSecret(databaseName, secretName, jobAndCatalogAccountName, function(err, result, request, response) {
                      should.not.exist(err);
                      should.exist(result);
                      response.statusCode.should.equal(200);
                      result.creationTime.should.not.be.empty;
                      // delete the secret
                      catalogClient.catalog.deleteSecret(databaseName, secretName, jobAndCatalogAccountName, function(err, result, request, response) {
                        should.not.exist(err);
                        should.not.exist(result);
                        response.statusCode.should.equal(200);
                        // try to set the secret again (should fail)
                        catalogClient.catalog.updateSecret(databaseName, secretName, secretCreateParameters, jobAndCatalogAccountName, function(err, result, request, response) {
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
});


function listPoll(suite, attemptsLeft, accountName, jobId, callback) {
  if (attemptsLeft === 0) {
    throw new Error('azure datalake analytics job show --accountName ' + accountName + ' --jobId ' + jobId + ' : Timeout expired for job execution');
  }

  var objectFound = false;
  jobClient.job.get(jobId, jobAndCatalogAccountName, function (err, result, request, response) {
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