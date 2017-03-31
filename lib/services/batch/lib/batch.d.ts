/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import * as msRest from 'ms-rest';
import BatchServiceClient = require('./batchServiceClient');

/**
 * @class
 * Creates a new BatchSharedKeyCredentials object.
 * @constructor
 * @param {string} accountName The batch account name. 
 * @param {string} accountKey The batch account key.
 */
declare class SharedKeyCredentials {
  constructor(accountName: string, accountKey: string);
  /**
   * Signs a request with the Authentication header.
   *
   * @param {webResource} The WebResource to be signed.
   * @param {function(error)}  callback  The callback function.
   * @return {undefined}
   */
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

export { BatchServiceClient as ServiceClient, SharedKeyCredentials }