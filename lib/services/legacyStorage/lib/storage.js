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

'use strict';

var common = require('azure-common');

//
// Entry point / factories for storage library
//

/**
 * Table client exports.
 * @ignore
 */

var TableService = require('./table/tableservice');
exports.TableService = TableService;

exports.TableQuery = require('./table/tablequery');

/**
* Creates a new {@link TableService} object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {TableService}                              A new TableService object.
*
*/
exports.createTableService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new TableService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
 * Blob client exports.
 * @ignore
 */

var BlobService = require('./blob/blobservice');
exports.BlobService = BlobService;

/**
* Creates a new {@link BlobService} object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {BlobService}                               A new BlobService object.
*/
exports.createBlobService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new BlobService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

/**
 * Queue client exports.
 * @ignore
 */
var QueueService = require('./queue/queueservice');
exports.QueueService = QueueService;

/**
* Creates a new {@link QueueService} object.
* If no storageAccount or storageAccessKey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
* environment variables will be used.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
* @return {QueueService}                              A new QueueService object.
*/
exports.createQueueService = function (storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  return new QueueService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider);
};

//
// Helpers & constants previously exposed by azure module.
//

exports.date = common.date;
exports.Constants = {
  BlobConstants: common.Constants.BlobConstants
};

exports.StorageServiceSettings = common.StorageServiceSettings;

// Credentials
exports.CertificateCloudCredentials = common.CertificateCloudCredentials;
exports.TokenCloudCredentials = common.TokenCloudCredentials;
exports.AnonymousCloudCredentials = common.AnonymousCloudCredentials;
exports.SharedAccessSignature = require('./blob/internal/sharedaccesssignature');
exports.SharedKey = require('./blob/internal/sharedkey');
exports.SharedKeyLite = require('./blob/internal/sharedkeylite');
exports.SharedKeyTable = require('./table/internal/sharedkeytable');
exports.SharedKeyLiteTable = require('./table/internal/sharedkeylitetable');
