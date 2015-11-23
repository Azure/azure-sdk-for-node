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


var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var _ = require('underscore');
var util = require('util');
var uuid = require('node-uuid');
var msRestAzure = require('ms-rest-azure');
var FileTokenCache = require('../../lib/util/fileTokenCache');
var MockTokenCache = require('./mock-token-cache');
var nockHelper = require('./nock-helper');
var ResourceManagementClient = require('../../lib/services/resourceManagement/lib/resource/resourceManagementClient');

/**
 * @class
 * Initializes a new instance of the SuiteBase class.
 * @constructor
 * 
 * @param {object} mochaSuiteObject - The mocha suite object
 *
 * @param {string} testPrefix - The prefix to use for the test suite
 * 
 * @param {Array} env - (Optional) Array of environment variables required by the test
 * Example:
 * [
 *   { requiresToken: true },
 *   { name: 'AZURE_ARM_TEST_LOCATION', defaultValue: 'West US' },
 *   { name: 'AZURE_AD_TEST_PASSWORD'},
 * ];
 */
function SuiteBase(mochaSuiteObject, testPrefix, env) {
  this.mochaSuiteObject = mochaSuiteObject;
  this.testPrefix = this.normalizeTestName(testPrefix);
  this.mockServerClient;
  this.currentTest = '';
  //Recording info
  this.setRecordingsDirectory(__dirname + '/../recordings/' + this.testPrefix + '/');
  this.suiteRecordingsFile = this.getRecordingsDirectory() + 'suite.' + this.testPrefix + '.nock.js';
  this.recordingsFile = __dirname + '/../recordings/' + this.testPrefix + '.nock.js';
  //test modes
  this.isMocked = !process.env.NOCK_OFF;
  this.isRecording = process.env.AZURE_NOCK_RECORD;
  this.isPlayback = !process.env.NOCK_OFF && !process.env.AZURE_NOCK_RECORD;
  //authentication info
  this.subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'] || 'subscription-id';
  this.clientId = process.env['CLIENT_ID'] || 'client-id';
  this.domain = process.env['DOMAIN'] || 'domain';
  this.username = process.env['USERNAME'] || 'username@example.com';
  this.password = process.env['PASSWORD'] || 'dummypassword';
  this.secret = process.env['APPLICATION_SECRET'] || 'dummysecret';
  this.clientRedirectUri = process.env['CLIENT_REDIRECT_URI'] || 'clientRedirectUri';
  this.tokenCache = new FileTokenCache(path.resolve(path.join(__dirname, '../tmp/tokenstore.json')));
  this._setCredentials();
  //subscriptionId should be recorded for playback
  if (!env) { env = []; }
  env.push('AZURE_SUBSCRIPTION_ID');
  // Normalize environment
  this.normalizeEnvironment(env);
  this.validateEnvironment();
  //track & restore generated uuids to be used as part of request url, like a RBAC role assignment name
  this.uuidsGenerated = [];
  this.currentUuid = 0;
  this.randomTestIdsGenerated = [];
  this.numberOfRandomTestIdGenerated = 0;
  this.mockVariables = {};
  //stub necessary methods if in playback mode
  this._stubMethods();
}

_.extend(SuiteBase.prototype, {

  _setCredentials: function () {
    if (!this.isPlayback) {
      if ((process.env['PASSWORD'] && process.env['APPLICATION_SECRET']) || 
          (!process.env['PASSWORD'] && !process.env['APPLICATION_SECRET'])) {
        throw new Error('You must either set the envt. variables \'USERNAME\' ' + 
                        'and \'PASSWORD\' for running tests as a user or set the ' + 
                        'envt. variable \'APPLICATION_SECRET\' for running tests ' + 
                        'as a service-principal, but not both.');
      }

      if (process.env['PASSWORD']) {
        this.credentials = this._createUserCredentials();
      } else if (process.env['APPLICATION_SECRET']) {
        this.credentials = this._createApplicationCredentials();
      }
    } else {
      //The type of credential object does not matter in playback mode as authentication 
      //header is not recorded. Hence we always default to UsertokenCredentials.
      this.credentials = this._createUserCredentials();
    } 
  },
  
  /**
   * Creates the UserTokenCredentials object.
   * 
   * @returns {ms-rest-azure.UserTokenCredentials} The user token credentials object.
   */
  _createUserCredentials: function () {
    return new msRestAzure.UserTokenCredentials(this.clientId, this.domain, this.username, 
                                                this.password, this.clientRedirectUri, 
                                                { 'tokenCache': this.tokenCache });
  },
  
  /**
   * Creates the ApplicationTokenCredentials object.
   * 
   * @returns {ms-rest-azure.ApplicationTokenCredentials} The application token credentials object.
   */
  _createApplicationCredentials: function () {
    return new msRestAzure.ApplicationTokenCredentials(this.clientId, this.domain, this.secret, { 'tokenCache': this.tokenCache });
  },

  /**
   * Creates a ResourceManagementClient and sets it as a property of the suite.
   */
  _setupResourceManagementClient: function () {
    if (!this.resourceManagement) {
      this.resourceManagement = new ResourceManagementClient(this.credentials, this.subscriptionId);
    }
    if (this.isPlayback) {
      this.resourceManagement.longRunningOperationRetryTimeoutInSeconds = 0;
    }
  },
  
  /**
   * Creates a new ResourceGroup with the specified name and location.
   * 
   * @param {string} groupName - The resourcegroup name
   * @param {string} location - The location
   * 
   * @returns {function} callback(err, result) - It contains error and result for the create request.
   */
  createResourcegroup: function (groupName, location, callback) {
    console.log('Creating Resource Group: \'' + groupName + '\' at location: \'' + location + '\'');
    this._setupResourceManagementClient();
    return this.resourceManagement.resourceGroups.createOrUpdate(groupName, {'location': location}, callback);
  },
  
  /**
   * Deletes the specified ResourceGroup.
   * 
   * @param {string} groupName - The resourcegroup name
   * 
   * @returns {function} callback(err, result) - It contains error and result for the delete request.
   */
  deleteResourcegroup: function (groupName, callback) {
    console.log('Deleting Resource Group: ' + groupName);
    if (!this.resourceManagement) { this._setupResourceManagementClient(); }
    return this.resourceManagement.resourceGroups.deleteMethod(groupName, callback);
  },
  
  /**
   * Provides the recordings directory for the test suite
   *
   * @returns {string} The test recordings directory
   */
  getRecordingsDirectory: function () {
    return this.recordingsDirectory;
  },
  
  /**
   * Sets the recordings directory for the test suite
   *
   * @param {string} dir The test recordings directory
   */
  setRecordingsDirectory: function (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    this.recordingsDirectory = dir;
  },
  
  /**
   * Provides the curent test recordings file
   *
   * @returns {string} The curent test recordings file
   */
  getTestRecordingsFile: function () {
    this.testRecordingsFile = this.getRecordingsDirectory() + 
    this.normalizeTestName(this.currentTest) + ".nock.js";
    return this.testRecordingsFile;
  },
  
  normalizeTestName: function (str) {
    return str.replace(/[{}\[\]'";\(\)#@~`!%&\^\$\+=,\/\\?<>\|\*:]/ig, '').replace(/(\s+)/ig, '_');
  },
  
  normalizeEnvironment: function (env) {
    this.requiredEnvironment = env.map(function (env) {
      if (typeof (env) === 'string') {
        return { name: env, secure: false };
      } else {
        return env;
      }
    });
  },
  
  validateEnvironment: function () {
    if (this.isPlayback) {
      return;
    }
    
    var messages = [];
    var missing = [];
    this.requiredEnvironment.forEach(function (e) {
      if (!process.env[e.name] && !e.defaultValue) {
        missing.push(e.name);
      }
    });
    
    if (missing.length > 0) {
      messages.push('This test requires the following environment variables which are not set: ' +
        missing.join(', '));
    }
    
    if (messages.length > 0) {
      throw new Error(messages.join(os.EOL));
    }
  },
  
  setEnvironmentDefaults: function () {
    this.requiredEnvironment.forEach(function (env) {
      if (env.defaultValue && !process.env[env.name]) {
        process.env[env.name] = env.defaultValue;
      }
    });
  },
  
  /**
   * Provides the curent suite recordings file
   *
   * @returns {string} The curent suite recordings file
   */
  getSuiteRecordingsFile: function () {
    return this.suiteRecordingsFile;
  },
  
  /**
   * Performs the specified actions before executing the suite. Records the random test ids and uuids generated during the
   * suite setup and restores them in playback
   *
   * @param {function} callback  A hook to provide the steps to execute during setup suite
   */
  setupSuite: function (callback) {
    if (this.isMocked) {
      process.env.AZURE_ENABLE_STRICT_SSL = false;
    }
    
    if (this.isPlayback) {
      // retrive suite level recorded testids and uuids if any
      var nocked = require(this.getSuiteRecordingsFile());
      if (nocked.randomTestIdsGenerated) {
        this.randomTestIdsGenerated = nocked.randomTestIdsGenerated();
      }
      
      if (nocked.uuidsGenerated) {
        this.uuidsGenerated = nocked.uuidsGenerated();
      }

      if (nocked.mockVariables) {
        this.mockVariables = nocked.mockVariables();
      }
      
      if (nocked.setEnvironment) {
        nocked.setEnvironment();
      }

      this.subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
      this.originalTokenCache = this.tokenCache;
      this.tokenCache = new MockTokenCache();
    } else {
      this.setEnvironmentDefaults();
    }
    
    callback();
    //write the suite level testids and uuids to a suite recordings file
    if (this.isMocked && this.isRecording) {
      this.writeRecordingHeader(this.getSuiteRecordingsFile());
      fs.appendFileSync(this.getSuiteRecordingsFile(), '];\n');
      this.writeGeneratedUuids(this.getSuiteRecordingsFile());
      this.writeGeneratedRandomTestIds(this.getSuiteRecordingsFile());
      this.writeMockVariables(this.getSuiteRecordingsFile());
    }
  },
  
  /**
   * Performs the specified actions after executing the suite.
   *
   * @param {function} callback  A hook to provide the steps to execute after the suite has completed execution
   */
  teardownSuite: function(callback) {
    if (this.isMocked) {
      delete process.env.AZURE_ENABLE_STRICT_SSL;
    }
    callback();
  },
  
  /**
   * Performs the specified actions before executing the test. Restores the random test ids and uuids in  
   * playback mode. Creates a new recording file for every test.
   *
   * @param {function} callback  A hook to provide the steps to execute before the test starts execution
   */
  setupTest: function (callback) {
    this.currentTest = this.mochaSuiteObject.currentTest.fullTitle();
    this.numberOfRandomTestIdGenerated = 0;
    this.currentUuid = 0;
    nockHelper.nockHttp();
    if (this.isMocked && this.isRecording) {
      // nock recording
      this.writeRecordingHeader();
      nockHelper.nock.recorder.rec(true);
    }
    
    if (this.isPlayback) {
      // nock playback
      var nocked = require(this.getTestRecordingsFile());
      if (nocked.randomTestIdsGenerated) {
        this.randomTestIdsGenerated = nocked.randomTestIdsGenerated();
      }
      
      if (nocked.uuidsGenerated) {
        this.uuidsGenerated = nocked.uuidsGenerated();
      }

      if (nocked.mockVariables) {
        this.mockVariables = nocked.mockVariables();
      }
      
      if (nocked.setEnvironment) {
        nocked.setEnvironment();
      }
      
      this.originalTokenCache = this.tokenCache;
      this.tokenCache = new MockTokenCache();

      if (nocked.scopes.length === 1) {
        nocked.scopes[0].forEach(function (createScopeFunc) {
          createScopeFunc(nockHelper.nock);
        });
      } else {
        throw new Error('It appears the ' + this.getTestRecordingsFile() + ' file has more tests than there are mocked tests. ' +
          'You may need to re-generate it.');
      }
    }
    
    callback();
  },
  
  /**
   * Performs the specified actions after executing the test. Writes the generated uuids and test ids during 
   * the test to the recorded file.
   *
   * @param {function} callback  A hook to provide the steps to execute after the test has completed execution
   */
  baseTeardownTest: function(callback) {
    if (this.isMocked) {
      if (this.isRecording) {
        // play nock recording
        var scope = '[';
        var lineWritten;
        nockHelper.nock.recorder.play().forEach(function (line) {
          if (line.indexOf('nock') >= 0) {
            // apply fixups of nock generated mocks
            
            // do not filter on body as they usual have time related stamps
            line = line.replace(/(\.post\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            line = line.replace(/(\.get\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            line = line.replace(/(\.put\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            line = line.replace(/(\.delete\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            line = line.replace(/(\.merge\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            line = line.replace(/(\.patch\('.*?')\s*,\s*"[^]+[^\\]"\)/, '.filteringRequestBody(function (path) { return \'*\';})\n$1, \'*\')');
            
            // put deployment have a timestamp in the url
            line = line.replace(/(\.put\('\/deployment-templates\/\d{8}T\d{6}')/,
              '.filteringPath(/\\/deployment-templates\\/\\d{8}T\\d{6}/, \'/deployment-templates/timestamp\')\n.put(\'/deployment-templates/timestamp\'');
            
            // Requests to logging service contain timestamps in url query params, filter them out too
            line = line.replace(/(\.get\('.*\/microsoft.insights\/eventtypes\/management\/values\?api-version=[0-9-]+)[^)]+\)/,
              '.filteringPath(function (path) { return path.slice(0, path.indexOf(\'&\')); })\n$1\')');
            if (line.match(/\/oauth2\/token\//ig) === null && 
              line.match(/login\.windows\.net/ig) === null && line.match(/login\.windows-ppe\.net/ig) === null) {
              scope += (lineWritten ? ',\n' : '') + 'function (nock) { \n' +
                'var result = ' + line + ' return result; }';
              lineWritten = true;
            }
          }
        });
        scope += ']];';
        fs.appendFileSync(this.getTestRecordingsFile(), scope);
        this.writeGeneratedUuids();
        this.writeGeneratedRandomTestIds();
        this.writeMockVariables();
        nockHelper.nock.recorder.clear();
      } else {
        //playback mode
        this.tokenCache = this.originalTokenCache;
        nockHelper.nock.cleanAll();
      }
    }
    nockHelper.unNockHttp();
    callback();
  },
  
  /**
   * Writes the generated uuids to the specified file.
   *
   * @param {string} filename        (Optional) The file name to which the uuids need to be added
   *                                 If the filename is not provided then it will get the current test recording file.
   */
  writeGeneratedUuids: function(filename) {
    if (this.uuidsGenerated.length > 0) {
      var uuids = this.uuidsGenerated.map(function (uuid) { return '\'' + uuid + '\''; }).join(',');
      var content = util.format('\n exports.uuidsGenerated = function() { return [%s];};', uuids);
      filename = filename || this.getTestRecordingsFile();
      fs.appendFileSync(filename, content);
      this.uuidsGenerated.length = 0;
    }
  },
  
  /**
   * Writes the generated random test ids to the specified file.
   *
   * @param {string} filename        (Optional) The file name to which the random test ids need to be added
   *                                 If the filename is not provided then it will get the current test recording file.
   */
  writeGeneratedRandomTestIds: function(filename) {
    if (this.randomTestIdsGenerated.length > 0) {
      var ids = this.randomTestIdsGenerated.map(function (id) { return '\'' + id + '\''; }).join(',');
      var content = util.format('\n exports.randomTestIdsGenerated = function() { return [%s];};', ids);
      filename = filename || this.getTestRecordingsFile();
      fs.appendFileSync(filename, content);
      this.randomTestIdsGenerated.length = 0;
    }
  },

  /**
   * Writes the mock variables to the specified file
   *
   * @param {string} filename        (Optional) The file name to which the mock variables need to be added
   *                                 If the filename is not provided then it will get the current test recording file.
   */
  writeMockVariables: function(filename) {
    if (Object.keys(this.mockVariables).length > 0) {
      var mockVariablesObject = JSON.stringify(this.mockVariables);
      var content = util.format('\n exports.mockVariables = function() { return JSON.parse(%s); };', mockVariablesObject);
      filename = filename || this.getTestRecordingsFile();
      fs.appendFileSync(filename, content);
      this.mockVariables = {};
    }
  },

  /**
   * Writes the recording header to the specified file.
   *
   * @param {string} filename        (Optional) The file name to which the recording header needs to be added
   *                                 If the filename is not provided then it will get the current test recording file.
   */
  writeRecordingHeader: function (filename) {
    var template = fs.readFileSync(path.join(__dirname, 'preamble.template'), { encoding: 'utf8' });
    filename = filename || this.getTestRecordingsFile();
    fs.writeFileSync(filename, _.template(template, {
      requiredEnvironment: this.requiredEnvironment
    }));
  },

  /**
   * Generates an unique identifier using a prefix, based on a currentList and repeatable or not depending on the isMocked flag.
   *
   * @param {string} prefix          The prefix to use in the identifier.
   * @param {array}  currentList     The current list of identifiers.
   * @return {string} A new unique identifier.
   */
  generateId: function (prefix, currentList) {
    if (!currentList) {
      currentList = [];
    }
    
    var newNumber;
    //record or live
    if (!this.isPlayback) {
      newNumber = this.generateRandomId(prefix, currentList);
      //record
      if (this.isMocked) {
        this.randomTestIdsGenerated[this.numberOfRandomTestIdGenerated++] = newNumber;
      }
    } else {
      //playback
      if (this.randomTestIdsGenerated && this.randomTestIdsGenerated.length > 0) {
        newNumber = this.randomTestIdsGenerated[this.numberOfRandomTestIdGenerated++];
      } else {
        //some test might not have recorded generated ids, so we fall back to the old sequential logic
        newNumber = prefix + (currentList.length + 1);
      }
    }
    
    currentList.push(newNumber);
    return newNumber;
  },
  
  /**
   * Generates a Guid. It will save the Guid to the recording file if in 'Record' mode or 
   * retrieve the guid from the recording file if in 'Playback' mode.
   * @return {string} A new Guid.
   */
  generateGuid: function () {
    var newGuid;
    //record or live
    if (!this.isPlayback) {
      newGuid = uuid.v4();
      //record
      if (this.isMocked) {
        this.uuidsGenerated[this.currentUuid++] = newGuid;
      }
    } else {
      //playback
      if (this.uuidsGenerated && this.uuidsGenerated.length > 0) {
        newGuid = this.uuidsGenerated[this.currentUuid++];
      }
    }

    return newGuid;
  },
  
  /**
   * Saves the mock variable with the specified name to the recording file when the test is run 
   * in 'Record' mode or keeps it in memory when the test is run in 'Live' mode.
   */
  saveMockVariable: function (mockVariableName, mockVariable) {
    //record or live
    if (!this.isPlayback) {
      this.mockVariables[mockVariableName] = mockVariable;
    }
  },

  /**
   * Gets the mock variable with the specified name. Returns undefined if the variable name is not present.
   * @return {object} A mock variable.
   */
  getMockVariable: function (mockVariableName) {
    return this.mockVariables[mockVariableName];
  },

  /**
   * A helper function to handle wrapping an existing method in sinon.
   *
   * @param {ojbect} sinonObj    either sinon or a sinon sandbox instance
   * @param {object} object      The object containing the method to wrap
   * @param {string} property    property name of method to wrap
   * @param {function (function)} setup function that receives the original function,
   *                              returns new function that runs when method is called.
   * @return {object}             The created stub.
   */
  wrap: function (sinonObj, object, property, setup) {
    var original = object[property];
    return sinonObj.stub(object, property, setup(original));
  },
  
  /**
   * A helper function to generate a random id.
   *
   * @param {string} prefix       A prefix for the generated random id
   * @param {array}  currentList  The list that contains the generated random ids 
   *                              (This ensures that there are no duplicates in the list)
   * @return {string}             The generated random nmumber.
   */
  generateRandomId: function (prefix, currentList) {
    var newNumber;
    while (true) {
      newNumber = prefix + Math.floor(Math.random() * 10000);
      if (!currentList || currentList.indexOf(newNumber) === -1) {
        break;
      }
    }
    return newNumber;
  },

  /**
   * Stubs certain methods to make them work in playback mode.
   */
  _stubMethods: function () {
    if (this.isPlayback) {
      if (msRestAzure.UserTokenCredentials.prototype.signRequest.restore) {
        msRestAzure.UserTokenCredentials.prototype.signRequest.restore();
      }
      sinon.stub(msRestAzure.UserTokenCredentials.prototype, 'signRequest', function (webResource, callback) {
        return callback(null);
      });
      
      if (msRestAzure.ApplicationTokenCredentials.prototype.signRequest.restore) {
        msRestAzure.ApplicationTokenCredentials.prototype.signRequest.restore();
      }
      sinon.stub(msRestAzure.ApplicationTokenCredentials.prototype, 'signRequest', function (webResource, callback) {
        return callback(null);
      });
      
      if (this.createResourcegroup.restore) {
        this.createResourcegroup.restore();
      }
      sinon.stub(this, 'createResourcegroup', function (groupName, location, callback) {
        return callback(null);
      });
      
      if (this.deleteResourcegroup.restore) {
        this.deleteResourcegroup.restore();
      }
      sinon.stub(this, 'deleteResourcegroup', function (groupName, callback) {
        return callback(null);
      });
    }
  }
});

exports = module.exports = SuiteBase;