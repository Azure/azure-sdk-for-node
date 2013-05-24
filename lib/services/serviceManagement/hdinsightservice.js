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

// Module dependencies.
var util = require('util');
var azureUtil = require('../../util/util.js');
var js2xml = require('../../util/js2xml');
var _ = require('underscore');
var uuid = require('node-uuid');
var Validate = require('../../util/validate.js');

var ServiceManagementClient = require('../core/servicemanagementclient');

// var js2xml = require('../../util/js2xml');
// var Constants = require('../../util/constants');

/**
*
* Creates a new HDInsightService object
*
* @constructor
* @param {string} subscriptionId   Subscription ID for the account or the connection string
* @param {object} authentication                    The authentication object for the client.
*                                                   {
*                                                     keyfile: 'path to .pem',
*                                                     certfile: 'path to .pem',
*                                                     keyvalue: privatekey value,
*                                                     certvalue: public cert value
*                                                   }
* @param {object} hostOptions                       The host options to override defaults.
*                                                   {
*                                                     host: 'management.core.windows.net',
*                                                     apiversion: '2012-03-01',
*                                                     serializetype: 'XML'
*                                                   }
*/
function HDInsightService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  if (!hostOptions) {
    hostOptions = { };
  }

  hostOptions.serializetype = 'XML';
  HDInsightService['super_'].call(this, authentication, hostOptions);

  this.subscriptionId = subscriptionId;
}

util.inherits(HDInsightService, ServiceManagementClient);

var WebResource = require('../../http/webresource');

/**
*
* Converts a cluster creation object into a playload that is actually sent to the server to create the cluster.
*
* @param {object} clusterCreationObject             The object used to supply all parameters needed to create a cluster.
*                                                   {
*                                                     // the following are required fields
*                                                     name: 'the name of the cluster (dns name) all lower case',
*                                                     location: 'the Azure data center where the cluster is to be created',
*                                                     defaultStorageAccountName: 'The name of the default Azure storage account',
*                                                     defaultStorageAccountKey: 'The secret key for the default Azure storage account',
*                                                     defaultStorageContainer: 'The container for the default Azure storage account',
*                                                     user: 'The username to use for the cluster',
*                                                     password: 'The password to use for the cluster',
*                                                     nodes: number // The number of nodes to use
*                                                     // the following are optional fields
*                                                     additionalStorageAccounts : [ {
*                                                         name: 'the name of the storage acount'
*                                                         key: 'the secret key for the storage acount'
*                                                       }, { // additional accounts following the same pattern }
*                                                     ]
*                                                     // the following are optional but if one is specified the other is required
*                                                     oozieMetastore : {
*                                                       server : 'the name of the sql server to use',
*                                                       database : 'the sql databse to use'
*                                                       user : 'the user name to use when logging into the database'
*                                                       password : 'the password to use when logging into the database'
*                                                     }
*                                                     hiveMetastore : {
*                                                       server : 'the name of the sql server to use',
*                                                       database : 'the sql databse to use'
*                                                       user : 'the user name to use when logging into the database'
*                                                       password : 'the password to use when logging into the database'
*                                                     }
*                                                   }
*/
HDInsightService.prototype.convertCreationObject = function (clusterCreationObject) {
  var payload = {
    Resource : {
      '$' : { 'xmlns' : 'http://schemas.microsoft.com/windowsazure' },
      IntrinsicSettings : {
        ClusterContainer : {
          '$' : { xmlns : 'http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess.Context' },
          AzureStorageLocation : clusterCreationObject.location,
          Deployment : {
            ASVAccounts : {
              ASVAccount : [{
                AccountName : clusterCreationObject.defaultStorageAccountName,
                BlobContainerName : clusterCreationObject.defaultStorageContainer,
                SecretKey : clusterCreationObject.defaultStorageAccountKey
              }]
            },
            ClusterPassword : clusterCreationObject.password,
            ClusterUsername : clusterCreationObject.user,
            NodeSizes : {
              ClusterNodeSize : [
                {
                  Count : 1,
                  RoleType : 'HeadNode',
                  VMSize : 'ExtraLarge'
                },
                {
                  Count : clusterCreationObject.nodes,
                  RoleType : 'DataNode',
                  VMSize : 'Large'
                }
              ]
            },
            SqlMetaStores : { },
            Version : 'default'
          },
          DeploymentAction : 'Create',
          DnsName : clusterCreationObject.name,
          IncarnationID : uuid.v4(),
          SubscriptionId : this.subscriptionId
        }
      }
    }
  };
  if (clusterCreationObject.additionalStorageAccounts) {
    for (var i = 0; i < clusterCreationObject.additionalStorageAccounts.length; i++) {
      var account = {
        AccountName : clusterCreationObject.additionalStorageAccounts[i].name,
        BlobContainerName : 'deployment1',
        SecretKey : clusterCreationObject.additionalStorageAccounts[i].key
      };
      payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.ASVAccounts.ASVAccount.push(account);
    }
  }
  if (clusterCreationObject.oozieMetastore) {
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.SqlMetaStores.SqlAzureMetaStore = [];
    var oozieMetastore = {
      '$' : { xmlns: 'http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess' },
      AzureServerName : clusterCreationObject.oozieMetastore.server,
      DatabaseName : clusterCreationObject.oozieMetastore.database,
      Password : clusterCreationObject.oozieMetastore.password,
      Type : 'OozieMetastore',
      Username : clusterCreationObject.oozieMetastore.user
    };
    var hiveMetastore = {
      '$' : { xmlns: 'http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess' },
      AzureServerName : clusterCreationObject.hiveMetastore.server,
      DatabaseName : clusterCreationObject.hiveMetastore.database,
      Password : clusterCreationObject.hiveMetastore.password,
      Type : 'OozieMetastore',
      Username : clusterCreationObject.hiveMetastore.user
    };
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.SqlMetaStores.SqlAzureMetaStore.push(oozieMetastore);
    payload.Resource.IntrinsicSettings.ClusterContainer.Deployment.SqlMetaStores.SqlAzureMetaStore.push(hiveMetastore);
  }
  return payload;
};

/**
*
* Deletes an HDInsight Cluster
*
* @param {string} name
* @param {string} location
* @param {function} callback                       
*
*/
HDInsightService.prototype.deleteCluster = function (name, location, callback){

  var regionCloudServiceName = azureUtil.getNameSpace(this.subscriptionId, 'hdinsight' , location);
  var path = '/' + this.subscriptionId + '/cloudservices/' + regionCloudServiceName + '/resources/hdinsight/containers/' + name;

  var webResource = WebResource.del(path);
  webResource.withHeader('x-ms-version', '2011-08-18');
  webResource.withHeader('accept', 'application/xml');

  this.performRequest(webResource, null, null, function (responseObject , next)  {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
*
* Creates a new HDInsight Cluster
*
* @param {object} clusterCreationObject             // The details of the cluster to create
*                                                   {
*                                                     // the following are required fields
*                                                     name: 'the name of the cluster (dns name) all lower case',
*                                                     location: 'the Azure data center where the cluster is to be created',
*                                                     defaultStorageAccountName: 'The name of the default Azure storage account',
*                                                     defaultStorageAccountKey: 'The secret key for the default Azure storage account',
*                                                     defaultStorageContainer: 'The container for the default Azure storage account',
*                                                     user: 'The username to use for the cluster',
*                                                     password: 'The password to use for the cluster',
*                                                     nodes: number // The number of nodes to use
*                                                     // the following are optional fields
*                                                     additionalStorageAccounts : [ {
*                                                         name: 'the name of the storage acount'
*                                                         key: 'the secret key for the storage acount'
*                                                       }, { // additional accounts following the same pattern }
*                                                     ]
*                                                     // the following are optional but if one is specified the other is required
*                                                     oozieMetastore : {
*                                                       server : 'the name of the sql server to use',
*                                                       database : 'the sql databse to use'
*                                                       user : 'the user name to use when logging into the database'
*                                                       password : 'the password to use when logging into the database'
*                                                     }
*                                                     hiveMetastore : {
*                                                       server : 'the name of the sql server to use',
*                                                       database : 'the sql databse to use'
*                                                       user : 'the user name to use when logging into the database'
*                                                       password : 'the password to use when logging into the database'
*                                                     }
*                                                   }
* @param {function} callback                       
*
*
*
*/
HDInsightService.prototype.createCluster = function (clusterCreationObject, callback) {
  // Convert the simply form "clusterCreationObject" into the complex form "payload" needed by the server REST call.
  Validate.isValidHDInsightCreationObject(clusterCreationObject);
  var payload = this.convertCreationObject(clusterCreationObject);
  var regionCloudServiceName = azureUtil.getNameSpace(this.subscriptionId, 'hdinsight' , 'East US');
  var path = '/' + this.subscriptionId + '/cloudservices/' + regionCloudServiceName + '/resources/hdinsight/containers/' + payload.Resource.IntrinsicSettings.ClusterContainer.DnsName;
  var webResource = WebResource.put(path);
  webResource.withHeader('x-ms-version', '2011-08-18');
  webResource.withHeader('accept', 'application/xml');
  this.performRequest(webResource, js2xml.serialize(payload), null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
*
* Lists all HDInsight clusters current existing on the subscription.
* @param {function} callback                       
*
*/
HDInsightService.prototype.listClusters = function (callback) {
  var path = '/' + this.subscriptionId + '/cloudservices';
  var webResource = WebResource.get(path);
  webResource.withHeader('x-ms-version', '2011-08-18');
  webResource.withHeader('accept', 'application/xml');

  this.performRequest(webResource, null, null, function (responseObject , next)  {
    var cloudServices = [];
    if (!responseObject.error) {
      if (responseObject.response && responseObject.response.body &&
          responseObject.response.body.CloudServices && responseObject.response.body.CloudServices.CloudService) {

        if (!_.isArray(responseObject.response.body.CloudServices.CloudService)) {
          responseObject.response.body.CloudServices.CloudService = [ responseObject.response.body.CloudServices.CloudService ];
        }

        var cloudService = responseObject.response.body.CloudServices.CloudService;

        for (var i = 0; i < cloudService.length; i++) {
          if (cloudService[i].Name &&
              cloudService[i].Name.indexOf('hdinsight') === 0) {
            var resources = [];

            if (cloudService[i].Resources && cloudService[i].Resources.Resource) {
              if (!_.isArray(cloudService[i].Resources.Resource)) {
                cloudService[i].Resources.Resource = [ cloudService[i].Resources.Resource ];
              }

              var resource = cloudService[i].Resources.Resource;
              for (var j = 0; j < resource.length; j++) {
                if (resource[j].ResourceProviderNamespace == 'hdinsight') {
                  resources.push(resource[j]);
                }
              }
              cloudService[i].Resources.Resource = resources;
            }

            cloudServices.push (cloudService[i]);
          }

          responseObject.response.body.CloudServices.CloudService = cloudServices;
        }

      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);

  });
};

module.exports = HDInsightService;