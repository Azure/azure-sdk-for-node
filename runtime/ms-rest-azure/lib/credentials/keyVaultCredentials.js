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

'use strict';
/* jshint latedef:false */

const url = require('url');
const msRest = require('ms-rest');
const ApplicationTokenCredentials = require('./applicationTokenCredentials');
const UserTokenCredentials = require('./userTokenCredentials');
const DeviceTokenCredentials = require('./deviceTokenCredentials');
const MSITokenCredentials = require('./msiTokenCredentials');
const MSIVmTokenCredentials = require('./msiVmTokenCredentials');
const MSIAppServiceTokenCredentials = require('./msiAppServiceTokenCredentials');

const AuthenticationContext = require('adal-node').AuthenticationContext;
let HeaderConstants = msRest.Constants.HeaderConstants;
let requestPipeline = msRest.requestPipeline;


function authenticatorMapper(credentials) {
  return function (challenge, callback) {
    // Function to take token Response and format a authorization value
    function _formAuthorizationValue(err, tokenResponse) {
      if (err) {
        return callback(err);
      }
      // Calculate the value to be set in the request's Authorization header and resume the call.
      var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;

      return callback(null, authorizationValue);
    }

    // Create a new authentication context.

    let context = new AuthenticationContext(challenge.authorization, true, credentials.context && credentials.context.cache);

    if (credentials instanceof ApplicationTokenCredentials) {
      return context.acquireTokenWithClientCredentials(
        challenge.resource, credentials.clientId, credentials.secret, _formAuthorizationValue);
    } else if (credentials instanceof UserTokenCredentials) {
      return context.acquireTokenWithUsernamePassword(
        challenge.resource, credentials.username, credentials.password, credentials.clientId, _formAuthorizationValue);
    } else if (credentials instanceof DeviceTokenCredentials) {
      return context.acquireToken(
        challenge.resource, credentials.username, credentials.clientId, _formAuthorizationValue);
    } else if (credentials instanceof MSITokenCredentials) {
      return credentials.getToken(_formAuthorizationValue);
    } else {
      callback(new Error('credentials must be one of: ApplicationTokenCredentials, UserTokenCredentials, ' +
        'DeviceTokenCredentials, MSITokenCredentials'));
    }
  };
}

/**
 * An object that performs authentication for Key Vault.
 * @class
 * @param {KeyVaultCredentials~authRequest} authenticator  A callback that receives a challenge and returns an authentication token.
 * @param {object} credentials A valid credentials to be used for KeyVault data-plane.
 */
function KeyVaultCredentials(authenticator, credentials) {
  this.challengeCache = [];
  this.authenticator = authenticator;
  if (!this.authenticator && !credentials) {
    throw new Error('Either the authenticator callback or a valid credentials must be provided.');
  }
  if (credentials instanceof MSIAppServiceTokenCredentials) {
    this.credentials = new MSIAppServiceTokenCredentials({
      msiEndpoint: credentials.msiEndpoint,
      msiSecret: credentials.msiSecret,
      msiApiVersion: credentials.msiApiVersion,
      resource: credentials.resource
    });
  } else if (credentials instanceof MSIVmTokenCredentials) {
    this.credentials = new MSIVmTokenCredentials({
      resource: credentials.resource,
      port: credentials.port
    });
  } else if (credentials instanceof MSITokenCredentials) {
    throw new Error('MSI-credentials not one of: MSIVmTokenCredentials, MSIAppServiceTokenCredentials');
  } else {
    this.credentials = credentials;
  }
  if (!this.authenticator) {
    this.authenticator = authenticatorMapper(this.credentials);
  }
}

KeyVaultCredentials.prototype.signRequest = function (resource, callback) {
  // authentication is provided by the createSigningFilter method.
  callback(null);
};

KeyVaultCredentials.prototype.createSigningFilter = function () {
  var self = this;
  return function (resource, next, callback) {

    var nextHandler = function (err, response, body) {
      // If this is not a 401 result, just resume.
      if (!response || response.statusCode !== 401 || !response.headers) {
        return callback(err, response, body);
      }
      // Otherwise we must handle the 401.
      return self.handleUnauthorized(resource, next, err, response, body, callback);
    };

    // Check if we have a cached challenge for this resource.
    var cachedChallenge = self.getCachedChallenge(resource);
    if (!cachedChallenge) {
      // Resume without any challenge. The service may return a 401-unauthorized that will be handled afterwards.
      return next(resource, nextHandler);
    }

    // Calls the authenticator to retrieve an authorization value.
    // Since the authenticator doesn't return a stream, we need to use the interimStream.
    return requestPipeline.interimStream(function (inputStream, outputStream) {
      inputStream.pause();
      self.authenticator(cachedChallenge, function (err, authorizationValue) {
        if (err) {
          inputStream.resume();
          return callback(err);
        }
        if (authorizationValue) {
          // If we have credentials, set in the header.          
          resource.headers[HeaderConstants.AUTHORIZATION] = authorizationValue;
        }
        var nextStream = next(resource, nextHandler);
        resource.pipeInput(inputStream, nextStream).pipe(outputStream);
        inputStream.resume();
      });
    });

  };
};

KeyVaultCredentials.prototype.handleUnauthorized = function (resource, next, err, response, body, callback) {

  // If the www-authenticate header is not as expected, just resume.
  var wwwAuthenticate = response.headers['www-authenticate'];
  var challenge = wwwAuthenticate ? parseAuthorizationHeader(wwwAuthenticate) : null;
  if (!challenge || !challenge.authorization || !challenge.resource) {
    return callback(err, response, body);
  }

  // Cache the challenge.
  this.addChallengeToCache(resource, challenge);

  var authenticate = function (err, authorizationValue) {
    if (err) {
      return callback(err);
    }
    if (authorizationValue) {
      // If we have credentials, set in the header.          
      resource.headers[HeaderConstants.AUTHORIZATION] = authorizationValue;
    }

    // Resume the call.
    return next(resource, callback);
  };

  return this.authenticator(challenge, authenticate);
};

KeyVaultCredentials.prototype.getCachedChallenge = function (resource) {
  var authority = getAuthority(resource.url);
  return this.challengeCache[authority];
};

KeyVaultCredentials.prototype.addChallengeToCache = function (resource, challenge) {
  var authority = getAuthority(resource.url);
  this.challengeCache[authority] = challenge;
};

// Callbacks

/**
 * @callback KeyVaultCredentials~authRequest
 * @param {object}                            challenge     The service defined challenge. This contains the value of a 'www-authenticate' header. Typical fields are authorization and resource.
 * @param {KeyVaultCredentials~authResponse}  callback      A callback that must be called with the result of authorization.
 */

/**
* @callback KeyVaultCredentials~authResponse
* @param {object}    err             An error object. Must be null if the authentication was successful.
* @param {string}    authorization   The contents of an 'authorization' header that answers the challenge. Typically a string in the format 'Bearer &lt;token&gt;'.
*/

module.exports = KeyVaultCredentials;

function parseAuthorizationHeader(header) {

  if (!header) {
    return null;
  }

  var headerParts = header.match(/^(\w+)(?:\s+(.*))?$/); // Header: scheme[ something]
  if (!headerParts) {
    return null;
  }

  var scheme = headerParts[1];
  if (scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  var attributesString = headerParts[2];
  if (!attributesString) {
    return null;
  }

  var attributes = {};

  var attrStrings = attributesString.split(',');
  for (var i = 0; i < attrStrings.length; ++i) {
    var attrString = attrStrings[i];
    var j = attrString.indexOf('=');
    var name = attrString.substring(0, j).trim();
    var value = attrString.substring(j + 1).trim();
    attributes[name] = JSON.parse('{"value":' + value + '}').value;
  }

  return attributes;
}

function getAuthority(uri) {
  var v = url.parse(uri, true, true);
  var protocol = v.protocol ? v.protocol : ':';
  var host = v.host;
  var result = protocol;
  if (v.slashes) {
    result += '//';
  }
  result += host;
  return result;
}