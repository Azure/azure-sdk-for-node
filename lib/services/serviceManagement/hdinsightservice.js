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
var js2xml = require('../../util/js2xml');
var _ = require('underscore');
var uuid = require('node-uuid');

var ServiceManagementClient = require('../core/servicemanagementclient');
var HDInsightNamespace = require('./hdinsightnamespaceutils.js');

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

function isInt(value){
  if((parseFloat(value) == parseInt(value, 10)) && !isNaN(value)) {
    return true;
  }
  else {
    return false;
  }
}

/**
*
* Validates that a clusterCreationObject is properly formed.
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
HDInsightService.prototype.validateCreationObject = function (clusterCreationObject) {
  if (typeof(clusterCreationObject.name) != 'string') {
    throw new Error('The [name] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.location) != 'string') {
    throw new Error('The [location] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.defaultStorageAccountName) != 'string') {
    throw new Error('The [defaultStorageAccountName] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.defaultStorageAccountKey) != 'string') {
    throw new Error('The [defaultStorageAccountKey] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.defaultStorageContainer) != 'string') {
    throw new Error('The [defaultStorageContainer] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.user) != 'string') {
    throw new Error('The [user] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.password) != 'string') {
    throw new Error('The [password] field is required when creating a cluster and must be a string');
  }
  if (typeof(clusterCreationObject.nodes) != 'number' || !isInt(clusterCreationObject.nodes)) {
    throw new Error('The [nodes] field is required when creating a cluster and must be an integer');
  }
  if (clusterCreationObject.additionalStorageAccounts) {
    if (!_.isArray(clusterCreationObject.additionalStorageAccounts)) {
      throw new Error('The [additionalStorageAccounts] field is optional when creating a cluster but must be an array when specified');
    }
    for (var i = 0; i < clusterCreationObject.additionalStorageAccounts.length; i++) {
      var account = clusterCreationObject.additionalStorageAccounts[i];
      if (typeof(account.name) != 'string') {
        throw new Error('The [additionalStorageAccounts] field is optional but if supplied each element must have a [name] field and it must be a string. Element ' + i + ' does not have a [name] field or it is not a string');
      }
      if (typeof(account.key) != 'string') {
        throw new Error('The [additionalStorageAccounts] field is optional but if supplied each element must have a [key] field and it must be a string. Element ' + i + ' does not have a [key] field or it is not a string');
      }
    }
  }
  if (clusterCreationObject.oozieMetastore) {
    if (!clusterCreationObject.hiveMetastore) {
      throw new Error('If the [oozieMetastore] field is supplied, than the [hiveMetastore] field must also be supplied');
    }
    if (typeof(clusterCreationObject.oozieMetastore.server) != 'string') {
      throw new Error('If the [oozieMetastore] field is supplied it must contain a [server] field which must be a string');
    }
    if (typeof(clusterCreationObject.oozieMetastore.database) != 'string') {
      throw new Error('If the [oozieMetastore] field is supplied it must contain a [database] field which must be a string');
    }
    if (typeof(clusterCreationObject.oozieMetastore.user) != 'string') {
      throw new Error('If the [oozieMetastore] field is supplied it must contain a [user] field which must be a string');
    }
    if (typeof(clusterCreationObject.oozieMetastore.password) != 'string') {
      throw new Error('If the [oozieMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  }
  if (clusterCreationObject.hiveMetastore) {
    if (!clusterCreationObject.oozieMetastore) {
      throw new Error('If the [hiveMetastore] field is supplied, than the [oozieMetastore] field must also be supplied');
    }
    if (typeof(clusterCreationObject.hiveMetastore.server) != 'string') {
      throw new Error('If the [hiveMetastore] field is supplied it must contain a [server] field which must be a string');
    }
    if (typeof(clusterCreationObject.hiveMetastore.database) != 'string') {
      throw new Error('If the [hiveMetastore] field is supplied it must contain a [database] field which must be a string');
    }
    if (typeof(clusterCreationObject.hiveMetastore.user) != 'string') {
      throw new Error('If the [hiveMetastore] field is supplied it must contain a [user] field which must be a string');
    }
    if (typeof(clusterCreationObject.hiveMetastore.password) != 'string') {
      throw new Error('If the [hiveMetastore] field is supplied it must contain a [password] field which must be a string');
    }
  }
};

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

HDInsightService.prototype.deleteCluster = function (callback) {
  callback('ERROR', null);
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
  this.validateCreationObject(clusterCreationObject);
  var payload = this.convertCreationObject(clusterCreationObject);
  var namespaceUtil = new HDInsightNamespace();
  var regionCloudServiceName = namespaceUtil.GetNameSpace(this.subscriptionId, 'hdinsight' , 'East US');
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