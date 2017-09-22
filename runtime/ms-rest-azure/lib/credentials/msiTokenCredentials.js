// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

// jshint ignore: start
// Note that this file is jshint clean except for properties inside token response 
// which are not camel cased and they are issued by the MSI service, 
// we do not control the shape of the response object.

'use strict';

const msrest = require('ms-rest');
const request = require('request');
const Constants = msrest.Constants;

class MSITokenCredentials {
  constructor(options) {
    if (!options) {
      options = {};
    }

    if (!options.port) {
      options.port = 50342; // default port where token service runs.
    } else if (typeof options.port.valueOf() !== 'number') {
      throw new Error('port must be a number.');
    }

    if (!options.resource) {
      options.resource = 'https://management.azure.com/';
    } else if (typeof options.resource.valueOf() !== 'string') {
      throw new Error('resource must be a uri.');
    }
    
    this.port = options.port;
    this.resource = options.resource;
  }

  /**
   * Prepares and sends a POST request to a service endpoint hosted on the Azure VM, which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (token_type and access_token are the two important properties). 
   */
  getToken(callback) {
    const postUrl = `http://localhost:${this.port}/oauth2/token`;
    const reqOptions = this.prepareRequestOptions();
    request.post(postUrl, reqOptions, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      try {
        let tokenResponse = JSON.parse(body);
        if (!tokenResponse.token_type) {
          throw new Error(`Invalid token response, did not find token_type. Response body is: ${body}`);
        } else if (!tokenResponse.access_token) {
          throw new Error(`Invalid token response, did not find access_token. Response body is: ${body}`);
        }

        return callback(null, tokenResponse);
      } catch (error) {
        return callback(error);
      }
    });
  }

  prepareRequestOptions() {
    const resource = encodeURIComponent(this.resource);
    const forwardSlash = encodeURIComponent('/');
    let reqOptions = {
      headers: {},
      body: ''
    };

    reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    reqOptions.headers['Metadata'] = 'true';
    reqOptions.body = `resource=${resource}`;

    return reqOptions;
  }

  /**
  * Signs a request with the Authentication header.
  *
  * @param {webResource} The WebResource to be signed.
  * @param {function(error)}  callback  The callback function.
  * @return {undefined}
  */
  signRequest(webResource, callback) {
    this.getToken(function (err, result) {
      if (err) return callback(err);
      webResource.headers[Constants.HeaderConstants.AUTHORIZATION] = `${result.token_type} ${result.access_token}`;
      return callback(null);
    });
  }
}

module.exports = MSITokenCredentials;