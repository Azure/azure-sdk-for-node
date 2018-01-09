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

/** Class representing an MSIAppServiceTokenCredentials. */
class MSIAppServiceTokenCredentials extends MSITokenCredentials {
  /**
   * Creates an instance of MSIAppServiceTokenCredentials.
   * @param {string} [options.msiEndpoint] - The local URL from which your app can request tokens.
   * Either provide this parameter or set the environment varaible `MSI_ENDPOINT`.
   * For example: `MSI_ENDPOINT="http://127.0.0.1:41741/MSI/token/"`
   * @param {string} [options.msiSecret] - The secret used in communication between your code and the local MSI agent.
   * Either provide this parameter or set the environment varaible `MSI_SECRET`.
   * For example: `MSI_SECRET="69418689F1E342DD946CB82994CDA3CB"`
   * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
   * For e.g. it can be:
   * - resourcemanagement endpoint "https://management.azure.com"(default) 
   * - management endpoint "https://management.core.windows.net/"
   * @param {string} [options.msiApiVersion] - The api-version of the local MSI agent. Default value is "2017-09-01".
   */
  constructor(options) {
    if (!options) options = {};
    super(options);
    options.msiEndpoint = options.msiEndpoint || process.env['MSI_ENDPOINT'];
    options.msiSecret = options.msiSecret || process.env['MSI_SECRET'];
    if (!options.msiEndpoint || (options.msiEndpoint && typeof options.msiEndpoint.valueOf() !== 'string')) {
      throw new Error('Either provide "msiEndpoint" as a property of the "options" object ' + 
      'or set the environment variable "MSI_ENDPOINT" and it must be of type "string".');
    }
    
    if (!options.msiSecret || (options.msiSecret && typeof options.msiSecret.valueOf() !== 'string')) {
      throw new Error('Either provide "msiSecret" as a property of the "options" object ' + 
      'or set the environment variable "MSI_SECRET" and it must be of type "string".');
    }

    if (!options.msiApiVersion) {
      options.msiApiVersion = '2017-09-01';
    } else if (typeof options.msiApiVersion.valueOf() !== 'string') {
      throw new Error('msiApiVersion must be a uri.');
    }
    
    this.msiEndpoint = options.msiEndpoint;
    this.msiSecret = options.msiSecret;
    this.msiApiVersion = options.msiApiVersion;
  }

  /**
   * Prepares and sends a POST request to a service endpoint hosted on the Azure VM, which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (tokenType and accessToken are the two important properties). 
   */
  getToken(callback) {
    const endpoint = this.msiEndpoint.endsWith('/') ? this.msiEndpoint : `${this.msiEndpoint}/`;
    const getUrl = `${endpoint}?resource=${this.resource}&api-version=${this.msiApiVersion}`;
    const reqOptions = this.prepareRequestOptions();
    request.get(getUrl, reqOptions, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      try {
        if (body.indexOf('ExceptionMessage') !== -1) {
          throw new Error(`MSI: Failed to retrieve a token from "${getUrl}" with an error: ${body}`);
        }
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
      headers: {
        'secret': this.msiSecret
      }
    };

    return reqOptions;
  }
}

module.exports = MSIAppServiceTokenCredentials;