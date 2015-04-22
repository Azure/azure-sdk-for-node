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

var exports = module.exports;

/**
* HDInsight client exports.
* @ignore
*/

var HDInsightJobManagementClient = require('./hDInsightJobManagementClient.js');
exports.HDInsightJobManagementClient = HDInsightJobManagementClient;

/**
*
* Creates a new HDInsightJobManagementClient object
* @class
* The HDInsightJobManagementClient class is used to perform job CRUD operations on the Microsoft Azure HDInsight Service.
*
* @constructor
* @param {string} clusterName The cluster DNS Name against which the job operations are performed
* @param {object} credentials                    The authentication object for the client.
*
* You must use either token or key/cert to authenticate service requests.
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
*/
exports.createHDInsightJobManagementClient = function (clusterName, credentials) {
	return new exports.HDInsightJobManagementClient.HDInsightJobManagementClient(clusterName, credentials);
};

var HDInsightClusterManagementClient = require('./hDInsightClusterManagementClient.js');
exports.HDInsightClusterManagementClient = HDInsightClusterManagementClient;

/**
*
* Creates a new HDInsightClusterManagementClient object 
* @class
* The HDInsightClusterManagementClient class is used to perform cluster CRUD operations on the Microsoft Azure HDInsight **Windows** Service.
*
* @constructor
* @param {string} clusterName The cluster DNS Name against which the job operations are performed
* @param {object} credentials                    The authentication object for the client.
*
* You must use either token or key/cert to authenticate service requests.
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
*/
exports.createHDInsightClusterManagementClient = function (cloudServiceName, credentials) {
	return new exports.HDInsightClusterManagementClient.HDInsightClusterManagementClient(cloudServiceName, credentials);
};

var HDInsightCluster2ManagementClient = require('./hDInsightCluster2ManagementClient.js');
exports.HDInsightCluster2ManagementClient = HDInsightCluster2ManagementClient;

/**
*
* Creates a new HDInsightCluster2ManagementClient object
* @class
* The HDInsightCluster2ManagementClient class is used to perform cluster CRUD operations on the Microsoft Azure HDInsight **Linux** Service.
*
* @constructor
* @param {string} clusterName The cluster DNS Name against which the job operations are performed
* @param {object} credentials                    The authentication object for the client.
*
* You must use either token or key/cert to authenticate service requests.
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
*/
exports.createHDInsightCluster2ManagementClient = function (cloudServiceName, credentials) {
	return new exports.HDInsightCluster2ManagementClient.HDInsightCluster2ManagementClient(cloudServiceName, credentials);
};


var BasicAuthenticationCloudCredentials = require('./basicAuthenticationCloudCredentials.js');
exports.BasicAuthenticationCloudCredentials = BasicAuthenticationCloudCredentials;

/**
* Creates a new BasicAuthenticationCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @constructor
* @param {string} credentials.username            The username.
* @param {string} credentials.password            The password.
*/
exports.createBasicAuthenticationCloudCredentials = function (credentials) {
	return new exports.BasicAuthenticationCloudCredentials.BasicAuthenticationCloudCredentials(credentials);
};