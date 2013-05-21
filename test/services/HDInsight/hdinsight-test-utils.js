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

var fs = require('fs');
var xml2js = require('xml2js');
var _ = require('underscore');


function HDInsightTestUtils() {
}

module.exports = HDInsightTestUtils;

HDInsightTestUtils.prototype.getTestCredentialData = function(callback) {
  var file = process.env['AZURE_HDINSIGHT_CREDENTIALFILE']; 
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
          credsName : creds[i].CredentialsName,
          subscriptionId : creds[i].SubscriptionId,
          dnsName : creds[i].DnsName,
          cluster : creds[i].Cluster,
          user : creds[i].AzureUserName,
          password : creds[i].AzurePassword,
          hadoopUserName : creds[i].HadoopUserName,
          defaultStorageAccount : {
            name : creds[i].DefaultStorageAccount.Name,
            key : creds[i].DefaultStorageAccount.Key,
            container : creds[i].DefaultStorageAccount.Container
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
            name : accounts[j].Name,
            key : accounts[j].Key,
            container : accounts[j].Container
          };
          cred.additionalStorageAccounts.push(account);
        }
        if (_.isArray(creds[i].OozieStores)) {
          creds[i].OozieStores = creds[i].OozieStores[0];
        }
        var oozies = creds[i].OozieStores.MetastoreCredentials;
        if (!_.isArray(oozies)) {
          oozies = [ oozies ];
        }
        cred.oozieStores = [];
        for (j = 0; j < oozies.length; j++) {
          var oozie = {
            description : oozies[j].Description,
            server : oozies[j].SqlServer,
            database : oozies[j].Database,
            user : oozies[j].UserName,
            password : oozies[j].Password
          };
          cred.oozieStores.push(oozie);
        }
        if (_.isArray(creds[i].HiveStores)) {
          creds[i].HiveStores = creds[i].HiveStores[0];
        }
        var hives = creds[i].HiveStores.MetastoreCredentials;
        if (!_.isArray(hives)) {
          hives = [ hives ];
        }
        cred.hiveStores = [];
        for (j = 0; j < hives.length; j++) {
          var hive = {
            description : hives[j].Description,
            server : hives[j].SqlServer,
            database : hives[j].Database,
            user : hives[j].UserName,
            password : hives[j].Password
          };
          cred.hiveStores.push(hive);
        }
        retval[cred.credsName] = cred;
      }
      callback(retval);
    });
  });
};
