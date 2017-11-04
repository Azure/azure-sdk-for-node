// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

/**
 * Creates a new ApiKeyCredentials object.
 *
 * @constructor
 * @param {object} options   Specifies the options to be provided for auth. Either header or query needs to be provided.
 * @param {object} [inHeader]  A key value pair of the header parameters that need to be applied to the request.
 * @param {object} [inQuery]   A key value pair of the query parameters that need to be applied to the request.
 */
class ApiKeyCredentials {
  constructor(options) {
    if (!options || (options && !options.inHeader && !options.inQuery)) {
      throw new Error (`options cannot be null or undefined. Either "inHeader" or "inQuery" property of the options object needs to be provided.`);
    }
    this.inHeader = options.inHeader;
    this.inQuery = options.inQuery;
  }

  /**
   * Signs a request with the values provided in the inHeader and inQuery parameter.
   *
   * @param {WebResource} The WebResource to be signed.
   * @param {function(error)}  callback  The callback function.
   * @return {undefined}
   */
  signRequest(webResource, callback) {
    if (!webResource) {
      return callback(new Error(`webResource cannot be null or undefined and must be of type "object".`));
    }

    if (this.inHeader) {
      if (!webResource.headers) {
        webResource.headers = {};
      }
      for (let key in this.inHeader) {
        webResource.headers[key] = this.inHeader[key];
      }
    }

    if (this.inQuery) {
      if (!webResource.url) {
        return callback (new Error(`url cannot be null in the request object.`));
      }
      if (webResource.url.indexOf('?') < 0) {
        webResource.url += '?';
      }
      for (let key in this.inQuery) {
        if (!webResource.url.endsWith('?')) {
          webResource.url += '&';
        }
        webResource.url += `${key}=${this.inQuery[key]}`;
      }
    }

    return callback(null);
  }
}

module.exports = ApiKeyCredentials;