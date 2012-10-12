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

var url = require('url');

var util = require('../../util/util');

var ConnectionStringParser = require('./connectionstringparser');
var ServiceSettings = require('./servicesettings');
var Constants = require('../../util/constants');
var ConnectionStringKeys = Constants.ConnectionStringKeys;
var Validate = require('../../util/validate');

exports = module.exports = StorageServiceSettings;

var _devStoreAccount = null;
var _useDevelopmentStorageSetting = ServiceSettings.setting(ConnectionStringKeys.USE_DEVELOPMENT_STORAGE_NAME, true);
var _developmentStorageProxyUriSetting = ServiceSettings.settingWithFunc(ConnectionStringKeys.DEVELOPMENT_STORAGE_PROXY_URI_NAME, Validate.getIsValidUri());
var _defaultEndpointsProtocolSetting = ServiceSettings.setting(ConnectionStringKeys.DEFAULT_ENDPOINTS_PROTOCOL_NAME, 'http', 'https');
var _accountNameSetting = ServiceSettings.setting(ConnectionStringKeys.ACCOUNT_NAME_NAME);
var _accountKeySetting = ServiceSettings.settingWithFunc(ConnectionStringKeys.ACCOUNT_KEY_NAME, Validate.getIsBase64Encoded());

var _blobEndpointSetting = ServiceSettings.settingWithFunc(
    ConnectionStringKeys.BLOB_ENDPOINT_NAME,
    Validate.getIsValidUri()
  );

var _queueEndpointSetting = ServiceSettings.settingWithFunc(
    ConnectionStringKeys.QUEUE_ENDPOINT_NAME,
    Validate.getIsValidUri()
  );

var _tableEndpointSetting = ServiceSettings.settingWithFunc(
    ConnectionStringKeys.TABLE_ENDPOINT_NAME,
    Validate.getIsValidUri()
  );

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
* Returns a StorageServiceSettings with development storage credentials using 
* the specified proxy Uri.
* 
* @param {string} proxyUri The proxy endpoint to use.
* 
* @return {StorageServiceSettings}
*/
StorageServiceSettings._getDevelopmentStorageAccount = function (proxyUri) {
  if (!proxyUri) {
    return StorageServiceSettings.developmentStorageAccount();
  }

  var parsedUri = url.parse(proxyUri);
  var scheme = parsedUri.protocol;
  var host   = parsedUri.host;
  var prefix = scheme + '//' + host;

  return new StorageServiceSettings(
    ConnectionStringKeys.DEV_STORE_NAME,
    ConnectionStringKeys.DEV_STORE_KEY,
    prefix + ':10000/devstoreaccount1/',
    prefix + ':10001/devstoreaccount1/',
    prefix + ':10002/devstoreaccount1/'
  );
};

/**
* Gets a StorageServiceSettings object that references the development storage 
* account.
* 
* @return {StorageServiceSettings}
*/
StorageServiceSettings.developmentStorageAccount = function () {
  if (!_devStoreAccount) {
    _devStoreAccount = StorageServiceSettings._getDevelopmentStorageAccount(Constants.DEV_STORE_URI);
  }

  return _devStoreAccount;
};

/**
* Gets the default service endpoint using the specified protocol and account 
* name.
* 
* @param {array}  settings The service settings.
* @param {string} dns      The service DNS.
* 
* @return {string}
*/
StorageServiceSettings._getDefaultServiceEndpoint = function (settings, dns) {
  var scheme = util.tryGetValueInsensitive(
    ConnectionStringKeys.DEFAULT_ENDPOINTS_PROTOCOL_NAME,
    settings
  );

  var accountName = util.tryGetValueInsensitive(
    ConnectionStringKeys.ACCOUNT_NAME_NAME,
    settings
  );

  return url.format({ protocol: scheme, host: accountName + '.' + dns });
};


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
StorageServiceSettings._createStorageServiceSettings = function (settings, blobEndpointUri, queueEndpointUri, tableEndpointUri) {
  var blobEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.BLOB_ENDPOINT_NAME,
    settings,
    blobEndpointUri
  );

  var queueEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.QUEUE_ENDPOINT_NAME,
    settings,
    queueEndpointUri
  );

  var tableEndpointUri = util.tryGetValueInsensitive(
    ConnectionStringKeys.TABLE_ENDPOINT_NAME,
    settings,
    tableEndpointUri
  );

  var accountName = util.tryGetValueInsensitive(
    ConnectionStringKeys.ACCOUNT_NAME_NAME,
    settings
  );

  var accountKey = util.tryGetValueInsensitive(
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
* Creates a ServiceBusSettings object from a set of settings.
* 
* @param {object} settings The settings object.
* 
* @return {StorageServiceSettings}
*/
StorageServiceSettings.createFromSettings = function (settings) {
  // Devstore case
  var matchedSpecs = ServiceSettings.matchedSpecification(
    settings,
    ServiceSettings.allRequired(_useDevelopmentStorageSetting),
    ServiceSettings.optional(_developmentStorageProxyUriSetting)
  );

  if (matchedSpecs) {
    var proxyUri = util.tryGetValueInsensitive(
      ConnectionStringKeys.DEVELOPMENT_STORAGE_PROXY_URI_NAME,
      settings
    );

    return this._getDevelopmentStorageAccount(proxyUri);
  }

  // Automatic case
  matchedSpecs = ServiceSettings.matchedSpecification(
    settings,
    ServiceSettings.allRequired(
      _defaultEndpointsProtocolSetting,
      _accountNameSetting,
      _accountKeySetting
    ),
    ServiceSettings.optional(
      _blobEndpointSetting,
      _queueEndpointSetting,
      _tableEndpointSetting
    )
  );

  if (matchedSpecs) {
    return this._createStorageServiceSettings(
      settings,
      this._getDefaultServiceEndpoint(
        settings,
        ConnectionStringKeys.BLOB_BASE_DNS_NAME
      ),
      this._getDefaultServiceEndpoint(
        settings,
        ConnectionStringKeys.QUEUE_BASE_DNS_NAME
      ),
      this._getDefaultServiceEndpoint(
        settings,
        ConnectionStringKeys.TABLE_BASE_DNS_NAME
      ));
  }

  // Explicit case
  matchedSpecs = ServiceSettings.matchedSpecification(
    settings,
    ServiceSettings.atLeastOne(
      _blobEndpointSetting,
      _queueEndpointSetting,
      _tableEndpointSetting
    ),
    ServiceSettings.allRequired(
      _accountNameSetting,
      _accountKeySetting
    )
  );

  if (matchedSpecs) {
    return this._createStorageServiceSettings(settings);
  }

  ServiceSettings.noMatchSettings(settings);
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
  try {
    return StorageServiceSettings.createFromSettings(tokenizedSettings);
  } catch (e) {
    if (e instanceof ServiceSettings.NoMatchError) {
      // Replace no match settings exception by no match connection string one.
      ServiceSettings.noMatchConnectionString(connectionString);
    } else {
      throw e;
    }
  }
};