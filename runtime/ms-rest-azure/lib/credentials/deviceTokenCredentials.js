// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const msrest = require('ms-rest');
const adal = require('adal-node');
const Constants = msrest.Constants;
const azureConstants = require('../constants');
const AzureEnvironment = require('../azureEnvironment');

/**
 * Creates a new DeviceTokenCredentials object that gets a new access token using userCodeInfo (contains user_code, device_code)
 * for authenticating user on device.
 *
 * When this credential is used, the script will provide a url and code. The user needs to copy the url and the code, paste it 
 * in a browser and authenticate over there. If successful, the script will get the access token.
 *
 * @constructor
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.username] The user name for account in the form: 'user@example.com'.
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with. Default environment is "Azure" popularly known as "Public Azure Cloud".
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value is 'common'
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid values are 'graph', 'batch' or any other resource like 'https://vault.azure.com/'.
 * If tokenAudience is 'graph' then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format). 
 * @param {string} [options.clientId] The active directory application client id. 
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 */
class DeviceTokenCredentials {
  constructor(options) {
    if (!options) {
      options = {};
    }

    if (!options.username) {
      options.username = 'user@example.com';
    }

    if (!options.environment) {
      options.environment = AzureEnvironment.Azure;
    }

    if (!options.domain) {
      options.domain = azureConstants.AAD_COMMON_TENANT;
    }

    if (!options.clientId) {
      options.clientId = azureConstants.DEFAULT_ADAL_CLIENT_ID;
    }

    if (!options.authorizationScheme) {
      options.authorizationScheme = Constants.HeaderConstants.AUTHORIZATION_SCHEME;
    }

    if (!options.tokenCache) {
      options.tokenCache = new adal.MemoryCache();
    }

    if (options.tokenAudience && options.tokenAudience.toLowerCase() === 'graph' && options.domain.toLowerCase() === 'common') {
      throw new Error('If the tokenAudience is specified as \'graph\' then \'domain\' cannot be the default \'commmon\' tenant. ' +
        'It must be the actual tenant (preferrably a string in a guid format).');
    }

    this.tokenAudience = options.tokenAudience;
    this.username = options.username;
    this.environment = options.environment;
    this.domain = options.domain;
    this.clientId = options.clientId;
    this.authorizationScheme = options.authorizationScheme;
    this.tokenCache = options.tokenCache;
    let authorityUrl = this.environment.activeDirectoryEndpointUrl + this.domain;
    this.context = new adal.AuthenticationContext(authorityUrl, this.environment.validateAuthority, this.tokenCache);
  }

  retrieveTokenFromCache(callback) {
    let self = this;
    let resource = self.environment.activeDirectoryResourceId;
    if (self.tokenAudience)  {
      resource = self.tokenAudience;
      if (self.tokenAudience.toLowerCase() === 'graph') {
        resource = self.environment.activeDirectoryGraphResourceId;
      } else if (self.tokenAudience.toLowerCase() === 'batch') {
        resource = self.environment.batchResourceId;
      }
    }
    self.context.acquireToken(resource, self.username, self.clientId, function (err, result) {
      if (err) return callback(err);
      return callback(null, result.tokenType, result.accessToken, result);
    });
  }

  getToken(callback) {
    this.retrieveTokenFromCache(function (err, scheme, token, result) {
      if (err) return callback(err);
      return callback(null, result);
    });
  }

  /**
  * Signs a request with the Authentication header.
  *
  * @param {webResource} The WebResource to be signed.
  * @param {function(error)}  callback  The callback function.
  * @return {undefined}
  */
  signRequest(webResource, callback) {
    return this.retrieveTokenFromCache(function (err, scheme, token) {
      if (err) return callback(err);
      webResource.headers[Constants.HeaderConstants.AUTHORIZATION] = `${scheme} ${token}`;
      return callback(null);
    });
  }
}

module.exports = DeviceTokenCredentials;