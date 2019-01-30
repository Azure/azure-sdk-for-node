// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

// jshint ignore: start
// Note that this file is jshint clean except for properties inside token response
// which are not camel cased and they are issued by the MSI service,
// we do not control the shape of the response object.

'use strict';

const request = require('request');
const MSITokenCredentials = require('./msiTokenCredentials');

class MSIVmTokenCredentials extends MSITokenCredentials {
  constructor(options) {
    if (!options) options = {};
    super(options);

    if (!options.msiEndpoint) {
      options.msiEndpoint = "http://169.254.169.254/metadata/identity/oauth2/token"; // Azure Instance Metadata Service identity endpoint.
    } else if (typeof options.msiEndpoint.valueOf() !== 'string') {
      throw new Error('msiEndpoint must be a string.');
    }

    if (!options.apiVersion) {
      options.apiVersion = "2018-02-01";
    } else if (typeof options.apiVersion.valueOf() !== 'string') {
      throw new Error('apiVersion must be a string.');
    }

    this.msiEndpoint = options.msiEndpoint;
    this.apiVersion = options.apiVersion;
  }

  /**
   * Prepares and sends a POST request to a service endpoint hosted on the Azure VM, which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (tokenType and accessToken are the two important properties).
   */
  getToken(callback) {
    const getUrl = `${this.msiEndpoint}?api-version=${this.apiVersion}&resource=${encodeURIComponent(this.resource)}`;
    const reqOptions = this.prepareRequestOptions();
    request.get(getUrl, reqOptions, (err, response, body) => {
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
    let reqOptions = {
      headers: {},
    };

    reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    reqOptions.headers['Metadata'] = 'true';

    return reqOptions;
  }
}

module.exports = MSIVmTokenCredentials;
