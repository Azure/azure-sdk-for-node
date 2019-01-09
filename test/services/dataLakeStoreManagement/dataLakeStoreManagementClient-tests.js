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

// all the requires
var should = require('should');
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');
var dump = util.inspect;

// test constants/ pre-initialized variables.
var testPrefix = 'arm-datalake-store-tests';
var accountPrefix = 'xplattestadls';
var knownNames = [];
var requiredEnvironment = [{
    name: 'AZURE_TEST_LOCATION',
    defaultValue: 'East US 2'
  }, {
    name: 'AZURE_TEST_RESOURCE_GROUP',
    defaultValue: 'xplattestadlsrg01'
  }
];

// the necessary clients
var DataLakeStoreAccountManagementClient = require('../../../lib/services/datalake.Store/lib/account/dataLakeStoreAccountManagementClient');
var DataLakeStoreFileSystemManagementClient = require('../../../lib/services/datalake.Store/lib/filesystem/dataLakeStoreFileSystemManagementClient');
var ResourceManagementClient = require('../../../lib/services/resourceManagement/lib/resource/resourceManagementClient');
var adlsClient;
var adlsFileSystemClient;
var resourceClient;

// test variables.
var suite;
var testLocation;
var testResourceGroup;
var secondResourceGroup;

var accountName;
var filesystemAccountName;

// filesystem variables
var content = 'adls sdk test content!';
var firstFolder = 'adlssdkfolder01';
var noContentFile = firstFolder + '/emptyfile.txt';
var contentFile = firstFolder + '/contentfile.txt';
var importFile = firstFolder + '/importfile.txt';
var concatFile = firstFolder + '/concatfile.txt';
var moveFolder = 'adlssdkfolder02';
var moveFile = firstFolder + '/movefile.txt';
var filesystemDnsSuffix = 'azuredatalakestore.net';
var baseUri = 'https://management.azure.com';

if(process.env['AZURE_ENVIRONMENT'] && process.env['AZURE_ENVIRONMENT'].toUpperCase() === 'DOGFOOD') {
  filesystemDnsSuffix = 'caboaccountdogfood.net';
  baseUri = 'https://api-dogfood.resources.windows-int.net'
}

var fs = require('fs');

// required functions for reading data
var readStreamToBuffer = function (strm, callback) {
  var bufs = [];
  strm.on('data', function (d) {
    bufs.push(d);
  });
  strm.on('end', function () {
    callback(null, Buffer.concat(bufs));
  });
};


describe('Data Lake Store Clients (Account and Filesystem)', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      testLocation = process.env['AZURE_TEST_LOCATION'];
      testLocation = testLocation.toLowerCase().replace(/ /g, '');
      testResourceGroup = process.env['AZURE_TEST_RESOURCE_GROUP'];
      secondResourceGroup = suite.generateId(accountPrefix, knownNames);
      accountName = suite.generateId(accountPrefix, knownNames);
      filesystemAccountName = suite.generateId(accountPrefix, knownNames);
      
      var options = {
        adlsFileSystemDnsSuffix: filesystemDnsSuffix
      };
      
      adlsClient = new DataLakeStoreAccountManagementClient(suite.credentials, suite.subscriptionId, baseUri);
      adlsFileSystemClient = new DataLakeStoreFileSystemManagementClient(suite.credentials, options);
      resourceClient = new ResourceManagementClient(suite.credentials, suite.subscriptionId, baseUri);

      // construct all of the parameter objects
      var adlsAccount = {
        location: testLocation
      };

      if (!suite.isPlayback) {
        resourceClient.resourceGroups.createOrUpdate(testResourceGroup, { location: testLocation }, function (err) {
          should.not.exist(err);
          resourceClient.resourceGroups.createOrUpdate(secondResourceGroup, { location: testLocation }, function (err) {
            should.not.exist(err);
            adlsClient.accounts.create(testResourceGroup, filesystemAccountName, adlsAccount, function (err) {
              should.not.exist(err);
              done();
            });
          });
        });
      }
      else {
        adlsClient.longRunningOperationRetryTimeout = 0;
        done();
      }
    });
  });
  
  after(function (done) {
    if (!suite.isPlayback) {
      resourceClient.resourceGroups.deleteMethod(secondResourceGroup, function () {
        resourceClient.resourceGroups.deleteMethod(testResourceGroup, function () {
          suite.teardownSuite(done);
        });
      });
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
  
  describe('Data Lake Store Account', function () {
    it('create command should work', function (done) {
      // define the account to create
      var accountToCreate = {
        tags: {
          testtag1: 'testvalue1',
          testtag2: 'testvalue2'
        },
        location: testLocation
      };
      
      adlsClient.accounts.create(testResourceGroup, accountName, accountToCreate, function (err, result) {
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
        location: testLocation
      };
      
      adlsClient.accounts.create(secondResourceGroup, accountName, accountToCreate, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.statusCode.should.equalOneOf([409,400]);
        done();
      });
    });
    
    it('get command should work', function (done) {
      adlsClient.accounts.get(testResourceGroup, filesystemAccountName, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.name.should.be.equal(filesystemAccountName);
        done();
      });
    });
    
    it('list commands should work', function (done) {
      adlsClient.accounts.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.length.should.be.above(0);
        // list within resource group as well.
        adlsClient.accounts.listByResourceGroup(testResourceGroup, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.length.should.be.above(0);
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
        }
      };
      
      adlsClient.accounts.update(testResourceGroup, filesystemAccountName, accountToUpdate, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.name.should.be.equal(filesystemAccountName);
        Object.keys(result.tags).length.should.be.equal(3);
        done();
      });
    });
    
    it('Delete command should work', function (done) {
      adlsClient.accounts.deleteMethod(testResourceGroup, accountName, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equalOneOf([200, 204]);
        adlsClient.accounts.get(testResourceGroup, accountName, function (err, result, request, response) {
          should.exist(err);
          should.not.exist(result);
          err.statusCode.should.equal(404);
          done();
        });
      });
    });
  });
  describe('Data Lake Store FileSystem', function () {
    it('create and show commands should work', function (done) {
      // create a folder
      adlsFileSystemClient.fileSystem.mkdirs(filesystemAccountName, firstFolder, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        // now get the folder.
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, firstFolder, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.fileStatus.type.should.be.equal('DIRECTORY');
          var validLength = !result.fileStatus.length || result.fileStatus.length === 0;
          validLength.should.be.equal(true);
          
          // create a file with no contents inside of the folder
          adlsFileSystemClient.fileSystem.create(filesystemAccountName, noContentFile, function (err, result, request, response) {
            should.not.exist(err);
            should.not.exist(result);
            response.statusCode.should.equal(201);
            // now get the file.
            adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, noContentFile, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.fileStatus.type.should.be.equal('FILE');
              var validLength = !result.fileStatus.length || result.fileStatus.length === 0;
              validLength.should.be.equal(true);
              
              // create a file with contents
              var options = {
                streamContents: new Buffer(content)
              };
              
              adlsFileSystemClient.fileSystem.create(filesystemAccountName, contentFile, options, function (err, result, request, response) {
                should.not.exist(err);
                should.not.exist(result);
                response.statusCode.should.equal(201);
                // now get the file.
                adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, contentFile, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  response.statusCode.should.equal(200);
                  result.fileStatus.type.should.be.equal('FILE');
                  result.fileStatus.length.should.be.equal(content.length);
                  
                  // list the contents of the folder, there should be two entries
                  adlsFileSystemClient.fileSystem.listFileStatus(filesystemAccountName, firstFolder, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.fileStatuses.fileStatus.length.should.be.equal(2);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
    
    it('add content should work', function (done) {
      adlsFileSystemClient.fileSystem.append(filesystemAccountName, noContentFile, new Buffer(content), function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        // now get the file.
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, noContentFile, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.fileStatus.type.should.be.equal('FILE');
          result.fileStatus.length.should.be.equal(content.length);
          done();
        });
      });
    });
    
    it('concat should work', function (done) {
      var options = [noContentFile, contentFile];
      adlsFileSystemClient.fileSystem.concat(filesystemAccountName, concatFile, options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        // now get the file.
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, concatFile, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.fileStatus.type.should.be.equal('FILE');
          result.fileStatus.length.should.be.equal(content.length * 2);
          done();
        });
      });
    });
    
    it('read should work', function (done) {
      var contentFromRead = content + content[0];
      var readOptions = {
        length: content.length + 1,
        offset: 0
      };

      // create a file with contents
      var options = {
        streamContents: new Buffer(content + content),
        overwrite: true
      };

      adlsFileSystemClient.fileSystem.create(filesystemAccountName, concatFile, options, function(err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        adlsFileSystemClient.fileSystem.open(filesystemAccountName, concatFile, readOptions, function(err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          readStreamToBuffer(result, function (err, buff) {
            should.not.exist(err);
            buff.toString().should.be.equal(contentFromRead);
            done();
          });
        });
      });
    });
    
    it('move commands should work', function (done) {
      // move a file
      adlsFileSystemClient.fileSystem.rename(filesystemAccountName, concatFile, moveFile, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        // now get the moved file.
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, moveFile, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.fileStatus.type.should.be.equal('FILE');
          result.fileStatus.length.should.be.equal(content.length * 2);
          adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, concatFile, function (err, result, request, response) {
            should.exist(err);
            should.not.exist(result);
            err.statusCode.should.equalOneOf([400,404]);
          
            // now move the whole folder
            adlsFileSystemClient.fileSystem.rename(filesystemAccountName, firstFolder, moveFolder, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);

              // get the moved folder
              adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, moveFolder, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.fileStatus.type.should.be.equal('DIRECTORY');
                var validLength = !result.fileStatus.length || result.fileStatus.length === 0;
                validLength.should.be.equal(true);
                
                // now get the old folder (should fail)
                adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, firstFolder, function (err, result, request, response) {
                  should.exist(err);
                  should.not.exist(result);
                  err.statusCode.should.equalOneOf([400, 404]);
                
                  // list the contents of the moved folder, there should be two entries
                  adlsFileSystemClient.fileSystem.listFileStatus(filesystemAccountName, moveFolder, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.fileStatuses.fileStatus.length.should.be.equal(1);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
    
    it('file expiry commands should work', function (done) {
      // delete a file
      var noExpiryTime = 253402300800000;
      var expireFile = noContentFile + '.expire'
      adlsFileSystemClient.fileSystem.create(filesystemAccountName, expireFile, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, expireFile, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          response.statusCode.should.equal(200);
          result.fileStatus.expirationTime.should.equalOneOf([noExpiryTime,0]);
          var absoluteAndRelativeToCreationExpiryTime = result.fileStatus.modificationTime + (120 * 1000);
          var options = {
            expireTime: absoluteAndRelativeToCreationExpiryTime
          };
          // Set absolute expire time
          adlsFileSystemClient.fileSystem.setFileExpiry(filesystemAccountName, expireFile, 'Absolute', options, function (err, result, request, response) {
            should.not.exist(err);
            should.not.exist(result);
            response.statusCode.should.equal(200);
            
            // get the fileInfo again and verify that the value is within 200ms of the set time.
            adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, expireFile, function (err, result, request, response) {
              should.not.exist(err);
              should.exist(result);
              response.statusCode.should.equal(200);
              result.fileStatus.expirationTime.should.within(absoluteAndRelativeToCreationExpiryTime - 100, absoluteAndRelativeToCreationExpiryTime + 100);
              
              // set relative to creation time expire time
              options.expireTime = 120 * 1000;
              adlsFileSystemClient.fileSystem.setFileExpiry(filesystemAccountName, expireFile, 'RelativeToCreationDate', options, function (err, result, request, response) {
                should.not.exist(err);
                should.not.exist(result);
                response.statusCode.should.equal(200);
                
                // get the fileInfo again and verify that the value is within 200ms of the set time.
                adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, expireFile, function (err, result, request, response) {
                  should.not.exist(err);
                  should.exist(result);
                  response.statusCode.should.equal(200);
                  result.fileStatus.expirationTime.should.within(absoluteAndRelativeToCreationExpiryTime - 100, absoluteAndRelativeToCreationExpiryTime + 100);
                  
                  // set relative to now
                  var nowPlusOffset = suite.getMockVariable('nowPlusOffset');
                  if (!nowPlusOffset) {
                    nowPlusOffset = (new Date()).getTime() + (120*1000);
                    suite.saveMockVariable('nowPlusOffset', nowPlusOffset);
                  }
                  
                  adlsFileSystemClient.fileSystem.setFileExpiry(filesystemAccountName, expireFile, 'RelativeToNow', options, function (err, result, request, response) {
                    should.not.exist(err);
                    should.not.exist(result);
                    response.statusCode.should.equal(200);
                    
                    adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, expireFile, function (err, result, request, response) {
                      should.not.exist(err);
                      should.exist(result);
                      response.statusCode.should.equal(200);
                      // we give +- 2 seconds of range due to commit timing in the service.
                      result.fileStatus.expirationTime.should.within(nowPlusOffset - 2000, nowPlusOffset + 2000);
                      
                      // and finally revert it back to never and the value of options should be ignored
                      adlsFileSystemClient.fileSystem.setFileExpiry(filesystemAccountName, expireFile, 'NeverExpire', options, function (err, result, request, response) {
                        should.not.exist(err);
                        should.not.exist(result);
                        response.statusCode.should.equal(200);
                        
                        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, expireFile, function (err, result, request, response) {
                          should.not.exist(err);
                          should.exist(result);
                          response.statusCode.should.equal(200);
                          result.fileStatus.expirationTime.should.equalOneOf([noExpiryTime,0]);
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
    
    it('delete commands should work', function (done) {
      // delete a file
      adlsFileSystemClient.fileSystem.deleteMethod(filesystemAccountName, moveFile, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
      
        // now get the deleted file, which should fail
        adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, moveFile, function (err, result, request, response) {
          should.exist(err);
          should.not.exist(result);
          err.statusCode.should.equalOneOf([400, 404]);
          
          // delete the whole folder
          var options = {
            recursive: true
          };

          adlsFileSystemClient.fileSystem.deleteMethod(filesystemAccountName, moveFolder, options, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
          
            // now get the folder (should fail)
            adlsFileSystemClient.fileSystem.getFileStatus(filesystemAccountName, moveFolder, function (err, result, request, response) {
              should.exist(err);
              should.not.exist(result);
              err.statusCode.should.equalOneOf([400, 404]);
              done();
            });
          });
        });
      });
    });
  });
  
  describe('Data Lake Store FileSystem Permissions', function () {
    var userIdToUse = '027c28d5-c91d-49f0-98c5-d10134b169b3';
    var permissionToRemove = 'user:' + userIdToUse;
    var permissionToSet = permissionToRemove + ':rwx';
    var permissionToUpdate = permissionToRemove + ':-w-';
    var permissionFolder = '/';
    it('get, set and delete entry commands should work', function (done) {
      // show permissions
      adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.aclStatus.entries.length.should.be.above(0);
        var initialEntryNum = result.aclStatus.entries.length;
        result.aclStatus.owner.should.not.be.empty;
        // now add permissions for a specific user.
        adlsFileSystemClient.fileSystem.modifyAclEntries(filesystemAccountName, permissionFolder, permissionToSet, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
        
          // show permissions again to confirm it was added
          adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.aclStatus.entries.length.should.be.above(initialEntryNum);
            var newEntryNum = result.aclStatus.entries.length;
            var foundEntry = false;
            for (var i = 0; i < result.aclStatus.entries.length; i++) {
              if (result.aclStatus.entries[i].indexOf(permissionToSet) > -1) {
                foundEntry = true;
                break;
              }
            }
            
            foundEntry.should.be.equal(true);
            
            // modify the existing entry
            adlsFileSystemClient.fileSystem.modifyAclEntries(filesystemAccountName, permissionFolder, permissionToUpdate, function (err, result, request, response) {
              should.not.exist(err);
              should.not.exist(result);
              response.statusCode.should.equal(200);
            
              // show permissions again to confirm it was modified
              adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
                should.not.exist(err);
                should.exist(result);
                response.statusCode.should.equal(200);
                result.aclStatus.entries.length.should.be.equal(newEntryNum);
                var foundEntry = false;
                for (var i = 0; i < result.aclStatus.entries.length; i++) {
                  if (result.aclStatus.entries[i].indexOf(permissionToUpdate) > -1) {
                    foundEntry = true;
                    break;
                  }
                }
                
                foundEntry.should.be.equal(true);
              
                // now remove permissions for a specific user.
                adlsFileSystemClient.fileSystem.removeAclEntries(filesystemAccountName, permissionFolder,permissionToRemove, function (err, result, request, response) {
                  should.not.exist(err);
                  should.not.exist(result);
                  response.statusCode.should.equal(200);
                
                  // show permissions again to confirm it was removed
                  adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
                    should.not.exist(err);
                    should.exist(result);
                    response.statusCode.should.equal(200);
                    result.aclStatus.entries.length.should.be.equal(initialEntryNum);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
    
    it('show, set and delete full ACL commands should work', function (done) {
      // show permissions
      adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        result.aclStatus.entries.length.should.be.above(0);
        var initialEntryNum = result.aclStatus.entries.length;
        result.aclStatus.owner.should.not.be.empty;
        var aclSpec = result.aclStatus.entries.toString();
        // now replace the ACL spec with the exact same ACL spec with the addition of one new user as the default user.
        aclSpec = aclSpec + ',default:' + permissionToSet;
        
        // we also need to add the default entries now:
        permissionLength = result.aclStatus.permission.length
        ownerOctal = result.aclStatus.permission.charAt(permissionLength - 3)
        groupOctal = result.aclStatus.permission.charAt(permissionLength - 2)
        otherOctal = result.aclStatus.permission.charAt(permissionLength - 1)
        
        ownerAce = 'user::'
        ownerAce += ownerOctal & 4 ? 'r' : '-'
        ownerAce += ownerOctal & 2 ? 'w' : '-'
        ownerAce += ownerOctal & 1 ? 'x' : '-'
        
        otherAce = 'other::'
        otherAce += otherOctal & 4 ? 'r' : '-'
        otherAce += otherOctal & 2 ? 'w' : '-'
        otherAce += otherOctal & 1 ? 'x' : '-'
        
        maskOrGroupAce = 'group::'
        maskOrGroupAce += groupOctal & 4 ? 'r' : '-'
        maskOrGroupAce += groupOctal & 2 ? 'w' : '-'
        maskOrGroupAce += groupOctal & 1 ? 'x' : '-'
        
        if (result.aclStatus.entries[0].startsWith("group::")) {
          maskOrGroupAce = 'mask::'
          maskOrGroupAce += groupOctal & 4 ? 'r' : '-'
          maskOrGroupAce += groupOctal & 2 ? 'w' : '-'
          maskOrGroupAce += groupOctal & 1 ? 'x' : '-'
        }
        
        aclSpec += ',' + ownerAce + ',' + otherAce + ',' + maskOrGroupAce
        
        adlsFileSystemClient.fileSystem.setAcl(filesystemAccountName, permissionFolder, aclSpec, function (err, result, request, response) {
          should.not.exist(err);
          should.not.exist(result);
          response.statusCode.should.equal(200);
        
          // show permissions again to confirm it was added
          adlsFileSystemClient.fileSystem.getAclStatus(filesystemAccountName, permissionFolder, function (err, result, request, response) {
            should.not.exist(err);
            should.exist(result);
            response.statusCode.should.equal(200);
            result.aclStatus.entries.length.should.be.above(initialEntryNum);
            done();
          });
        });
      });
    });
  });
});