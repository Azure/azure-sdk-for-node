// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

// jshint ignore: start
// Note that this file is jshint clean except for properties inside token response 
// which are not camel cased and they are issued by the MSI service, 
// we do not control the shape of the response object.

'use strict';

const msrest = require('ms-rest');
const Constants = msrest.Constants;

/**
 * Base class for MSI based credentials
 */
class MSITokenCredentials {

  /**
   * Creates an instance of MSITokenCredentials.
   * @param {object} [options] - Optional parameters
   * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
   * For e.g. it can be:
   * - resourcemanagement endpoint "https://management.azure.com"(default) 
   * - management endpoint "https://management.core.windows.net/"
   */
  constructor(options) {
    if (!options) options = {};

    if (!options.resource) {
      options.resource = 'https://management.azure.com/';
    } else if (typeof options.resource.valueOf() !== 'string') {
      throw new Error('resource must be a uri.');
    }
    this.resource = options.resource;
  }

  /**
   * Parses a tokenResponse json string into a object, and converts properties on the first level to camelCase
   * @param  {string} body  A json string
   * @return {object} [tokenResponse] The tokenResponse (tokenType and accessToken are the two important properties). 
   */
  parseTokenResponse(body) {
    let parsedBody = JSON.parse(body);
    parsedBody.accessToken = parsedBody['access_token'];
    parsedBody.tokenType = parsedBody['token_type'];
    delete parsedBody['access_token'];
    delete parsedBody['token_type'];
    return parsedBody;
  }

  /**
   * Prepares and sends a request to the MSI service endpoint which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (tokenType and accessToken are the two important properties). 
   */
  getToken(callback) {
    return callback();
  }

  prepareRequestOptions() {
    let reqOptions = {
      headers: {},
      body: ''
    };

    return reqOptions;
  }

  /**
   * Signs a request with the Authentication header.
   *
   * @param {webResource} webResource The WebResource to be signed.
   * @param {function(error)}  callback  The callback function.
   * @return {undefined}
   */
  signRequest(webResource, callback) {
    this.getToken(function (err, result) {
      if (err) return callback(err);
      webResource.headers[Constants.HeaderConstants.AUTHORIZATION] = `${result.tokenType} ${result.accessToken}`;
      return callback(null);
    });
  }
}

module.exports = MSITokenCredentials;