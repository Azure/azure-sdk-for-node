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
var http = require('http');
var url = require('url');
var util = require('util');
var qs = require('qs');
var crypto = require('crypto');
var xml2js = require('xml2js');

var azureutil = require('../../util/util');

var StorageServiceSettings = require('../core/storageservicesettings');

var ServiceClient = require('./serviceclient');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var Logger = require('../../diagnostics/logger');

// Expose 'StorageServiceClient'.
exports = module.exports = StorageServiceClient;

// Validation error messages
StorageServiceClient.incorrectStorageAccountErr = 'You must supply an account name or use the environment variable AZURE_STORAGE_ACCOUNT if you are not running in the emulator.';
StorageServiceClient.incorrectStorageAccessKeyErr = 'You must supply an account key or use the environment variable AZURE_STORAGE_ACCESS_KEY if you are not running in the emulator.';

/**
* Creates a new ServiceClient object.
*
* @constructor
* @param {string} storageAccount           The storage account.
* @param {string} storageAccessKey         The storage access key.
* @param {string} host                     The host for the service.
* @param {bool}   usePathStyleUri          Boolean value indicating wether to use path style uris.
* @param {object} authenticationProvider   The authentication provider object (e.g. sharedkey / sharedkeytable / sharedaccesssignature).
*/
function StorageServiceClient(storageAccount, storageAccessKey, host, usePathStyleUri, authenticationProvider) {
  this._setAccountCredentials(storageAccount, storageAccessKey);
  this.apiVersion = HeaderConstants.TARGET_STORAGE_VERSION;
  this.usePathStyleUri = usePathStyleUri;

  StorageServiceClient.super_.call(this, host, authenticationProvider);

  this._initDefaultFilter();
}

util.inherits(StorageServiceClient, ServiceClient);

/**
* Gets the storage settings.
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
*
* @return {StorageServiceSettings}
*/
StorageServiceClient.getStorageSettings = function (storageAccountOrConnectionString, storageAccessKey, host) {
  var storageServiceSettings;

  if (storageAccountOrConnectionString && !storageAccessKey) {
    // If storageAccountOrConnectionString was passed and no accessKey was passed, assume connection string
    storageServiceSettings = StorageServiceSettings.createFromConnectionString(storageAccountOrConnectionString);
  } else if (!(storageAccountOrConnectionString && storageAccessKey) && ServiceClient.isEmulated()) {
    // Dev storage scenario
    storageServiceSettings = StorageServiceSettings.getDevelopmentStorageAccountSettings();
  } else {
    // Explicit or environment variable credentials scenario
    storageServiceSettings = StorageServiceClient._getStorageSettingsExplicitOrEnvironment(
      storageAccountOrConnectionString,
      storageAccessKey,
      host);
  }

  return storageServiceSettings;
};

/**
* Gets the storage settings from the parameters or environment variables.
*
* @param {string} [storageAccount]                    The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
*
* @return {StorageServiceSettings}
*/
StorageServiceClient._getStorageSettingsExplicitOrEnvironment = function (storageAccount, storageAccessKey, host) {
  var usePathStyleUri = false;

  if (!storageAccount) {
    storageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
  }

  if (!storageAccessKey) {
    storageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
  }

  // Default endpoints
  var blobendpoint = url.format({ protocol: 'http:',  port: 80, hostname: storageAccount + '.' + ServiceClient.CLOUD_BLOB_HOST });
  var tableendpoint = url.format({ protocol: 'http:', port: 80, hostname: storageAccount + '.' + ServiceClient.CLOUD_TABLE_HOST });
  var queueendpoint = url.format({ protocol: 'http:', port: 80, hostname: storageAccount + '.' + ServiceClient.CLOUD_QUEUE_HOST });

  if (host) {
    var parsedHost = ServiceClient._parseHost(host);
    var parsedHostUrl = url.format(parsedHost);
    if (parsedHostUrl === url.format(ServiceClient._parseHost(ServiceClient.DEVSTORE_BLOB_HOST)) ||
        parsedHostUrl === url.format(ServiceClient._parseHost(ServiceClient.DEVSTORE_TABLE_HOST)) ||
        parsedHostUrl === url.format(ServiceClient._parseHost(ServiceClient.DEVSTORE_QUEUE_HOST))) {
      usePathStyleUri = true;
    }

    blobendpoint = parsedHostUrl;
    tableendpoint = parsedHostUrl;
    queueendpoint = parsedHostUrl;
  }

  var settings = {
    accountname: storageAccount,
    accountkey: storageAccessKey,
    blobendpoint: blobendpoint,
    tableendpoint: tableendpoint,
    queueendpoint: queueendpoint
  };

  var storageServiceSettings = StorageServiceSettings.createFromSettings(settings);
  storageServiceSettings._usePathStyleUri = usePathStyleUri;

  return storageServiceSettings;
};

/**
* Builds the request options to be passed to the http.request method.
*
* @param {WebResource} webResource The webresource where to build the options from.
* @param {object}      options     The request options.
* @param {function(error, requestOptions)}  callback  The callback function.
* @return {undefined}
*/
StorageServiceClient.prototype._buildRequestOptions = function (webResource, options, callback) {
  var self = this;

  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, '');
  }

  if (!webResource.headers || webResource.headers[HeaderConstants.CONTENT_LENGTH] === undefined) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);
  } else if(webResource.headers && webResource.headers[HeaderConstants.CONTENT_LENGTH] === null) {
    delete webResource.headers[HeaderConstants.CONTENT_LENGTH];
  }

  webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, this.apiVersion);
  webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, new Date().toUTCString());
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_HEADER, 'application/atom+xml,application/xml');
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');

  webResource.addOptionalHeader(HeaderConstants.HOST_HEADER, this.host + ':' + this.port);

  if (options) {
    if (options.timeoutIntervalInMs) {
      webResource.addOptionalQueryParam(QueryStringConstants.TIMEOUT, options.timeoutIntervalInMs);
    }

    if (options.accessConditions) {
      webResource.addOptionalAccessConditionHeader(options.accessConditions);
    }

    if (options.sourceAccessConditions) {
      webResource.addOptionalSourceAccessConditionHeader(options.sourceAccessConditions);
    }
  }

  // Sets the request url in the web resource.
  this._setRequestUrl(webResource);

  // Now that the web request is finalized, sign it
  this.authenticationProvider.signRequest(webResource, function (error) {
    var requestOptions = null;

    if (!error) {
      requestOptions = {
        url: url.format({
          protocol: self._isHttps() ? 'https:' : 'http:',
          hostname: self.host,
          port: self.port,
          pathname: webResource.path + webResource.getQueryString(true)
        }),
        method: webResource.httpVerb,
        headers: webResource.headers
      };

      self._setRequestOptionsProxy(requestOptions);
    }

    callback(error, requestOptions);
  });
};

/**
* Retrieves the normalized path to be used in a request.
* This takes into consideration the usePathStyleUri object field
* which specifies if the request is against the emulator or against
* the live service. It also adds a leading "/" to the path in case
* it's not there before.
*
* @param {string} path The path to be normalized.
* @return {string} The normalized path.
*/
StorageServiceClient.prototype._getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  if (this.usePathStyleUri) {
    path = '/' + this.storageAccount + path;
  }

  return path;
};

/**
* Sets the account credentials taking into consideration the isEmulated value and the environment variables:
* AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
*
* @param {string} storageAccount          The storage account.
* @param {string} storageAccessKey        The storage access key.
* @return {undefined}
*/
StorageServiceClient.prototype._setAccountCredentials = function (storageAccount, storageAccessKey) {
  if (azureutil.objectIsNull(storageAccount)) {
    if (process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT]) {
      storageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    } else if (ServiceClient.isEmulated()) {
      storageAccount = ServiceClient.DEVSTORE_STORAGE_ACCOUNT;
    }
  }

  if (azureutil.objectIsNull(storageAccessKey)) {
    if (process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY]) {
      storageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
    } else if (ServiceClient.isEmulated()) {
      storageAccessKey = ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY;
    }
  }

  if (!azureutil.objectIsString(storageAccount) || azureutil.stringIsEmpty(storageAccount)) {
    throw new Error(StorageServiceClient.incorrectStorageAccountErr);
  }

  if (!azureutil.objectIsString(storageAccessKey) || azureutil.stringIsEmpty(storageAccessKey)) {
    throw new Error(StorageServiceClient.incorrectStorageAccessKeyErr);
  }

  this.storageAccount = storageAccount;
  this.storageAccessKey = storageAccessKey;
};