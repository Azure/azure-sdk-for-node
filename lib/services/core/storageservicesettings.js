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

var util = require('../../util/util');

var ConnectionStringParser = require('./connectionstringparser');
var ServiceSettings = require('./servicesettings');
var Constants = require('../../util/constants');
var ConnectionStringKeys = Constants.ConnectionStringKeys;

exports = module.exports = StorageServiceSettings;

var validKeys = [ 
  ConnectionStringKeys.USE_DEVELOPMENT_STORAGE_NAME,
  ConnectionStringKeys.DEVELOPMENT_STORAGE_PROXY_URI_NAME,
  ConnectionStringKeys.DEFAULT_ENDPOINTS_PROTOCOL_NAME,
  ConnectionStringKeys.ACCOUNT_NAME_NAME,
  ConnectionStringKeys.ACCOUNT_KEY_NAME,
  ConnectionStringKeys.BLOB_ENDPOINT_NAME,
  ConnectionStringKeys.QUEUE_ENDPOINT_NAME,
  ConnectionStringKeys.TABLE_ENDPOINT_NAME
];

var _useDevelopmentStorageSetting = settings(ConnectionStringKeys.USE_DEVELOPMENT_STORAGE_NAME, 'true');

/**
* Creates new storage service settings instance.
* 
* @param {string} name             The storage service name.
* @param {string} key              The storage service key.
* @param {string} blobEndpointUri  The storage service blob endpoint.
* @param {string} queueEndpointUri The storage service queue endpoint.
* @param {string} tableEndpointUri The storage service table endpoint.
*/
function StorageServiceSettings(name, key, blobEndpointUri, queueEndpointUri, tableEndpointUri) {
  this._name = name;
  this._key = key;
  this._blobEndpointUri  = blobEndpointUri;
  this._queueEndpointUri = queueEndpointUri;
  this._tableEndpointUri = tableEndpointUri;
}

/**
* Creates StorageServiceSettings object given endpoints uri.
* 
* @param {array}  settings         The service settings.
* @param {string} blobEndpointUri  The blob endpoint uri.
* @param {string} queueEndpointUri The queue endpoint uri.
* @param {string} tableEndpointUri The table endpoint uri.
* 
* @return {StorageServiceSettings}
*/
StorageServiceSettings._createStorageServiceSettings = function (
  settings, blobEndpointUri, queueEndpointUri, tableEndpointUri
) {
  blobEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.BLOB_ENDPOINT_NAME,
    settings,
    blobEndpointUri
  );

  queueEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.QUEUE_ENDPOINT_NAME,
    settings,
    queueEndpointUri
  );

  tableEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.TABLE_ENDPOINT_NAME,
    settings,
    tableEndpointUri
  );

  accountName = util.tryGetValueInsensitive(
    ConnectionStringKeys.ACCOUNT_NAME_NAME,
    settings
  );

  accountKey = util.tryGetValueInsensitive(
    ConnectionStringKeys.ACCOUNT_KEY_NAME,
    settings
  );

  return new StorageServiceSettings(
    accountName,
    accountKey,
    blobEndpointUri,
    queueEndpointUri,
    tableEndpointUri
  );
};

/**
* Creates a StorageServiceSettings object from the given connection string.
* 
* @param {string} connectionString The storage settings connection string.
* 
* @return {StorageServiceSettings}
*/
StorageServiceSettings.createFromConnectionString = function (connectionString) {
  var tokenizedSettings = ServiceSettings.parseAndValidateKeys(connectionString, validKeys);

  return this._createStorageServiceSettings(
    tokenizedSettings,
    this._getDefaultServiceEndpoint(
      tokenizedSettings,
      ConnectionStringKeys.BLOB_BASE_DNS_NAME
    ),
    this._getDefaultServiceEndpoint(
      tokenizedSettings,
      ConnectionStringKeys.QUEUE_BASE_DNS_NAME
    ),
    this._getDefaultServiceEndpoint(
      tokenizedSettings,
      ConnectionStringKeys.TABLE_BASE_DNS_NAME
    )
  );
};