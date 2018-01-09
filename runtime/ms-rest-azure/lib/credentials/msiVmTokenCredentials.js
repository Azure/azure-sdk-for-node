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

const MSITokenCredentials = require('./msiTokenCredentials');

class MSIVmTokenCredentials extends MSITokenCredentials {
  constructor(options) {
    if (!options) options = {};
    super(options);
    if (!options.port) {
      options.port = 50342; // default port where token service runs.
    } else if (typeof options.port.valueOf() !== 'number') {
      throw new Error('port must be a number.');
    }
    
    this.port = options.port;
  }

  /**
   * Prepares and sends a POST request to a service endpoint hosted on the Azure VM, which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (tokenType and accessToken are the two important properties). 
   */
  getToken(callback) {
    const postUrl = `http://localhost:${this.port}/oauth2/token`;
    const reqOptions = this.prepareRequestOptions();
    request.post(postUrl, reqOptions, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      try {
        let tokenResponse = this.parseTokenResponse(body);
        if (!tokenResponse.tokenType) {
          throw new Error(`Invalid token response, did not find tokenType. Response body is: ${body}`);
        } else if (!tokenResponse.accessToken) {
          throw new Error(`Invalid token response, did not find accessToken. Response body is: ${body}`);
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
}

module.exports = MSIVmTokenCredentials;