// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';
const request = require('request');
const Constants = require('ms-rest').Constants;

class MSITokenCredentials {
  constructor(domain, options) {

    if (!Boolean(domain) || typeof domain.valueOf() !== 'string') {
      throw new Error('domain must be a non empty string.');
    }

    if (!options) {
      options = {};
    }

    if (!options.port) {
      options.port = 50342; // default port where token service runs.
    } else if (typeof options.port.valueOf() !== 'number') {
      throw new Error('port must be a number.');
    }

    if (!options.resource) {
      options.resource = "https://management.azure.com";
    } else if (typeof options.resource.valueOf() !== 'string') {
      throw new Error('resource must be a uri.');
    }

    this.domain = domain;
    this.port = options.port;
    this.resource = options.resource;
    this.aad_endpoint = "https://login.microsoftonline.com";
  }

  /**
   * Tries to get the token from cache initially. If that is unsuccessfull then it tries to get the token from ADAL.
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
    const aad_endpoint = encodeURIComponent(this.aad_endpoint);
    const forward_slash = encodeURIComponent("/");
    let reqOptions = {
      headers: {},
      body: ""
    };

    reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    reqOptions.headers['Metadata'] = 'true';
    reqOptions.body = `authority=${aad_endpoint}${forward_slash}${this.domain}&resource=${resource}`;

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
