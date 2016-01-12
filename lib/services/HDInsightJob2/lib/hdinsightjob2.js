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

var HDInsightJobManagementClient = require('./hDInsightJobManagementClient');
exports.HDInsightJobManagementClient = HDInsightJobManagementClient;

/**
*
* Creates a new HDInsightJobManagementClient object 
* @class
* The HDInsightJobManagementClient class is used to submit jobs on the Microsoft Azure HDInsight Service.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.token]               The access token.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {HDInsightJobManagementClient}            A new HDInsightJobManagementClient object.
*/
exports.createHDInsightJobManagementClient = function (credentials, baseUri, filters) {
    return new exports.HDInsightJobManagementClient.HDInsightJobManagementClient(credentials, baseUri, filters);
}; 