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
var xml2js = require('azure-common').xml2js;
var _ = require('underscore');
var should = require('should');
var uuid = require('node-uuid');
var os = require('os');
var util = require('util');
var MockedTestUtils = require('./mocked-test-utils');
var testutil = require('../util/util');
var azure = testutil.libRequire('azure');
var azureHDInsight = require('azure-asm-hdinsight');
var hdInsight;
var creds;

function HDInsightTestUtils(callback) {
  var self = this;
  _getTestCredentialData(function (result) {
    var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
    creds = result;
    should.exist(result);
    hdInsight = azureHDInsight.createHDInsightService(self.getDefaultCreds().subscriptionId, auth);
    HDInsightTestUtils.super_.call(self, hdInsight, 'hdinsight-tests');
    callback();
  });
}

util.inherits(HDInsightTestUtils, MockedTestUtils);

module.exports = HDInsightTestUtils;

HDInsightTestUtils.prototype.getHDInsight = function() {
  return hdInsight;
}

HDInsightTestUtils.prototype.getSubscriptionId = function() {
  return this.getDefaultCreds().subscriptionId;
}

HDInsightTestUtils.prototype.getDefaultCreds = function() {
  return creds['default'];
};

HDInsightTestUtils.prototype.getDefaultWithAsvAndMetastores = function() {
  return this.getCreationWithAsvAndMetastore('default');
};

HDInsightTestUtils.prototype.getCreationWithAsvAndMetastore = function (name) {
  var cred = creds[name];
  var machineName = os.hostname();
  if (_.isUndefined(machineName)) {
    machineName = 'unknown';
  }
  var now = new Date();
  var day = now.getDate();
  day = day < 10 ? '0'+day : day;
  var month = now.getMonth();
  month = month < 10 ? '0'+month : month;

  var creationName = 'CLITest-' + machineName + '-' + month + day + now.getFullYear() + '-' + uuid.v4();
  if (this.isRecording || this.isMocked) {
    creationName = "azure-hdinsight-test-cluster";
  }
  var clusterCreationObject = {
    name : creationName.toLowerCase(),
    location : 'East US',
    defaultStorageAccountName : cred.defaultStorageAccount.name,
    defaultStorageAccountKey : cred.defaultStorageAccount.key,
    defaultStorageContainer : cred.defaultStorageAccount.container,
    user : cred.user,
    password : cred.password,
    nodes : 4,
    additionalStorageAccounts : [{
      name : cred.additionalStorageAccounts[0].name,
      key : cred.additionalStorageAccounts[0].key
    }],
    oozieMetastore : {
      server : cred.oozieStores[0].server,
      database : cred.oozieStores[0].database,
      user : cred.oozieStores[0].user,
      password : cred.oozieStores[0].password
    },
    hiveMetastore : {
      server : cred.hiveStores[0].server,
      database : cred.hiveStores[0].database,
      user : cred.hiveStores[0].user,
      password : cred.hiveStores[0].password
    }
  };
  return clusterCreationObject;
};

function _getTestCredentialData(callback) {
  var file = process.env['AZURE_HDINSIGHT_CREDENTIALFILE'];
  if (!file) {
    file = __dirname + '/creds.xml';
  }
  var parser = new xml2js.Parser();
  fs.readFile(file, 'utf-8', function(err, data) {
    parser.parseString(data, function(err, result) {
      var creds = result.ArrayOfAzureTestCredentials.AzureTestCredentials;
      if (!_.isArray(creds)) {
        creds = [
          creds
        ];
      }
      var retval = { };
      for (var i = 0; i < creds.length; i++) {
        var cred = {
          credsName : creds[i].CredentialsName[0],
          subscriptionId : creds[i].SubscriptionId[0],
          dnsName : creds[i].DnsName[0],
          cluster : creds[i].Cluster[0],
          user : creds[i].AzureUserName[0],
          password : creds[i].AzurePassword[0],
          hadoopUserName : creds[i].HadoopUserName[0],
          defaultStorageAccount : {
            name : creds[i].DefaultStorageAccount[0].Name[0],
            key : creds[i].DefaultStorageAccount[0].Key[0],
            container : creds[i].DefaultStorageAccount[0].Container[0]
          }
        };
        if (_.isArray(creds[i].AdditionalStorageAccounts)) {
          creds[i].AdditionalStorageAccounts = creds[i].AdditionalStorageAccounts[0];
        }
        var accounts = creds[i].AdditionalStorageAccounts.StorageAccountCredentials;
        if (!_.isArray(accounts)) {
          accounts = [ accounts ];
        }
        cred.additionalStorageAccounts = [];
        for (var j = 0; j < accounts.length; j++) {
          var account = {
            name : accounts[j].Name[0],
            key : accounts[j].Key[0],
            container : accounts[j].Container[0]
          };
          cred.additionalStorageAccounts.push(account);
        }
        var oozies = creds[i].OozieStores[0].MetastoreCredentials;
        if (!_.isArray(oozies)) {
          oozies = [ oozies ];
        }
        cred.oozieStores = [];
        for (j = 0; j < oozies.length; j++) {
          var oozie = {
            description : oozies[j].Description[0],
            server : oozies[j].SqlServer[0],
            database : oozies[j].Database[0],
            user : oozies[j].UserName[0],
            password : oozies[j].Password[0]
          };
          cred.oozieStores.push(oozie);
        }
        var hives = creds[i].HiveStores[0].MetastoreCredentials;
        if (!_.isArray(hives)) {
          hives = [ hives ];
        }
        cred.hiveStores = [];
        for (j = 0; j < hives.length; j++) {
          var hive = {
            description : hives[j].Description[0],
            server : hives[j].SqlServer[0],
            database : hives[j].Database[0],
            user : hives[j].UserName[0],
            password : hives[j].Password[0]
          };
          cred.hiveStores.push(hive);
        }
        retval[cred.credsName] = cred;
      }
      callback(retval);
    });
  });
};
