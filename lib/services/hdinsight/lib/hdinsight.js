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
* HDInsightService client exports.
* @ignore
*/

var HDInsightService = require('./hdinsightservice.js');
exports.HDInsightService = HDInsightService;

/**
*
* Creates a new HDInsightService object
* @class
* The HDInsightService class is used to perform operations on the Microsoft Azure HDInsight Service.
*
* @constructor
* @param {string} configOrSubscriptionId  configuration store or subscription ID for the account or the connection string
* @param {object} authentication                    The authentication object for the client.
*
* You must use either keyfile/certfile or keyvalue/certvalue
* to provide a management certificate to authenticate
* service requests.
* @param {string} [authentication.keyfile]          The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]         The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]         A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]        A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                     The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']                The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']          The API vesion to be used.
*/
exports.createHDInsightService = function (configOrSubscriptionId, authentication, hostOptions) {
	return new HDInsightService(configOrSubscriptionId, authentication, hostOptions);
};