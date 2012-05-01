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

// Module dependencies.
var http = require('http');
var url = require('url');
var util = require('util');
var qs = require('qs');
var crypto = require('crypto');
var xml2js = require('xml2js');

var azureutil = require('../../util/util');

var ServiceClient = require('./serviceclient');
var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;
var HttpConstants = Constants.HttpConstants;
var Logger = require('../../diagnostics/logger');

// Expose 'StorageServiceClient'.
exports = module.exports = StorageServiceClient;

// Validation error messages
StorageServiceClient.incorrectStorageAccountErr = 'Account name must be a non empty string. Set AZURE_STORAGE_ACCOUNT';
StorageServiceClient.incorrectStorageAccessKeyErr = 'AccessKey must be a non empty string. Set AZURE_STORAGE_ACCESS_KEY';

/**
* Creates a new ServiceClient object.
*
* @constructor
* @param {string} host                    The host for the service.
* @param {string} storageAccount          The storage account.
* @param {string} storageAccessKey        The storage access key.
* @param {object} authenticationProvider  The authentication provider object (e.g. sharedkey / sharedkeytable / sharedaccesssignature).
*/
function StorageServiceClient(host, storageAccount, storageAccessKey, authenticationProvider) {
  this._setAccountCredentials(storageAccount, storageAccessKey);
  this.apiVersion = HeaderConstants.TARGET_STORAGE_VERSION;
  this.usePathStyleUri = ServiceClient.isEmulated(host);

  StorageServiceClient.super_.call(this, host, authenticationProvider);

  this._initDefaultFilter();
}

util.inherits(StorageServiceClient, ServiceClient);

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

  webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, this.apiVersion);
  webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, new Date().toUTCString());
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_HEADER, 'application/atom+xml,application/xml');
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');

  webResource.addOptionalHeader(HeaderConstants.HOST_HEADER, this.getHostname() + ':' + this.port);

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
        method: webResource.httpVerb,
        path: webResource.requestUrl,
        host: self.getRequestHost(),
        port: self.getRequestPort(),
        headers: webResource.headers
      };
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
StorageServiceClient.prototype.getPath = function (path) {
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
* Retrives the hostname taking into consideration the usePathStyleUri flag which indicates whether the account
* should be a prefix for it or not.
*
* @return {string} The hostname.
*/
StorageServiceClient.prototype.getHostname = function () {
  if (this.usePathStyleUri) {
    return this.host;
  }

  return this.storageAccount + '.' + this.host;
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
    if (ServiceClient.isEmulated()) {
      storageAccount = ServiceClient.DEVSTORE_STORAGE_ACCOUNT;
    } else {
      storageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    }
  }

  if (azureutil.objectIsNull(storageAccessKey)) {
    if (ServiceClient.isEmulated()) {
      storageAccessKey = ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY;
    } else {
      storageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
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