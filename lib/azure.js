/**
* Copyright 2011 Microsoft Corporation
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

var exports = module.exports;

/**
 * Table client exports.
 */

var TableService = require('./services/table/tableservice');
exports.TableService = TableService;

exports.createTableService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new TableService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
 * Blob client exports.
 */

var BlobService = require('./services/blob/blobservice');
exports.BlobService = BlobService;

exports.createBlobService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new BlobService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
 * Queue client exports.
 */

var QueueService = require('./services/queue/queueservice');
exports.QueueService = QueueService;

exports.createQueueService = function (storageAccount, storageAccessKey, host, authenticationProvider) {
  return new QueueService(storageAccount, storageAccessKey, host, authenticationProvider);
};

/**
 * Other exports.
 */

exports.ServiceClient = require('./services/serviceclient');
exports.TableQuery = require('./services/table/tablequery');
exports.BatchServiceClient = require('./services/table/batchserviceclient');
exports.Constants = require('./util/constants');
exports.LinearRetryPolicyFilter = require('./common/linearretrypolicyfilter');
exports.ExponentialRetryPolicyFilter = require('./common/exponentialretrypolicyfilter');
exports.SharedAccessSignature = require('./services/blob/sharedaccesssignature');
exports.SharedKey = require('./services/blob/sharedkey');
exports.SharedKeyLite = require('./services/blob/sharedkeylite');
exports.SharedKeyTable = require('./services/table/sharedkeytable');
exports.SharedKeyLiteTable = require('./services/table/sharedkeylitetable');
exports.ISO8061Date = require('./util/iso8061date');
exports.Base64 = require('./util/base64');
exports.Logger = require('./diagnostics/logger');

/*
* Convenience functions.
*/
exports.isEmulated = function (host) {
  return exports.ServiceClient.isEmulated(host);
};