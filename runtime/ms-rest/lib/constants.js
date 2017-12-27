// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const Constants = {
  /**
   * Specifies HTTP.
   *
   * @const
   * @type {string}
   */
  HTTP: 'http:',

  /**
   * Specifies HTTPS.
   *
   * @const
   * @type {string}
   */
  HTTPS: 'https:',

  /**
   * Specifies HTTP Proxy.
   *
   * @const
   * @type {string}
   */
  HTTP_PROXY: 'HTTP_PROXY',

  /**
   * Specifies HTTPS Proxy.
   *
   * @const
   * @type {string}
   */
  HTTPS_PROXY: 'HTTPS_PROXY',

  HttpConstants: {
    /**
     * Http Verbs
     *
     * @const
     * @enum {string}
     */
    HttpVerbs: {
      PUT: 'PUT',
      GET: 'GET',
      DELETE: 'DELETE',
      POST: 'POST',
      MERGE: 'MERGE',
      HEAD: 'HEAD',
      PATCH: 'PATCH'
    },
  },

  /**
   * Defines constants for use with HTTP headers.
   */
  HeaderConstants: {
    /**
     * The Authorization header.
     *
     * @const
     * @type {string}
     */
    AUTHORIZATION: 'authorization',

    /**
     * The Authorization scheme.
     *
     * @const
     * @type {string}
     */
    AUTHORIZATION_SCHEME: 'Bearer',

    /**
     * The UserAgent header.
     *
     * @const
     * @type {string}
     */
    USER_AGENT: 'user-agent',

    /**
     * The 'application/x-www-form-urlencoded' Content-Type header.
     *
     * @const
     * @type {string}
     */
    FORM_URL_ENCODED: 'application/x-www-form-urlencoded',

  }
};

exports = module.exports = Constants;
