// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const msRest = require('ms-rest');
const LroStates = require('./constants').LongRunningOperationStates;

/**
 * @class
 * Initializes a new instance of the PollingState class.
 * @constructor
 * @param {object} [response] - The response object to extract long
 * running operation status.
 * 
 * @param {number} retryTimeout - The timeout in seconds to retry on
 * intermediate operation results. Default Value is 30.
 */
class PollingState {
  constructor(resultOfInitialRequest, retryTimeout) {
    if (retryTimeout === null || retryTimeout === undefined) {
      retryTimeout = 30;
    }
    this._retryTimeout = retryTimeout;
    this.updateResponse(resultOfInitialRequest.response);
    this.request = resultOfInitialRequest.request;
    //Parse response.body & assign it as the resource
    try {
      if (resultOfInitialRequest.body &&
        typeof resultOfInitialRequest.body.valueOf() === 'string' &&
        resultOfInitialRequest.body.length > 0) {
        this.resource = JSON.parse(resultOfInitialRequest.body);
      } else {
        this.resource = resultOfInitialRequest.body;
      }
    } catch (error) {
      let deserializationError = new Error(`Error "${error}" occurred in parsing the responseBody ' +
        'while creating the PollingState for Long Running Operation- "${resultOfInitialRequest.body}"`);
      deserializationError.request = resultOfInitialRequest.request;
      deserializationError.response = resultOfInitialRequest.response;
      throw deserializationError;
    }

    switch (this.response.statusCode) {
      case 202:
        this.status = LroStates.InProgress;
        break;

      case 204:
        this.status = LroStates.Succeeded;
        break;
      case 201:
        if (this.resource && this.resource.properties && this.resource.properties.provisioningState) {
          this.status = this.resource.properties.provisioningState;
        } else {
          this.status = LroStates.InProgress;
        }
        break;
      case 200:
        if (this.resource && this.resource.properties && this.resource.properties.provisioningState) {
          this.status = this.resource.properties.provisioningState;
        } else {
          this.status = LroStates.Succeeded;
        }
        break;
      default:
        this.status = LroStates.Failed;
        break;
    }
  }

  /**
   * Gets timeout in milliseconds. 
   * @returns {number} timeout
   */
  getTimeout() {
    if (this._retryTimeout || this._retryTimeout === 0) {
      return this._retryTimeout * 1000;
    }
    if (this.response && this.response.headers['retry-after']) {
      return parseInt(this.response.headers['retry-after']) * 1000;
    }
    return 30 * 1000;
  }

  /**
   * Update cached data using the provided response object
   * @param {object} [response] - provider response object.
   */
  updateResponse(response) {
    this.response = response;
    if (response && response.headers) {
      if (response.headers['azure-asyncoperation']) {
        this.azureAsyncOperationHeaderLink = response.headers['azure-asyncoperation'];
      }

      if (response.headers['location']) {
        this.locationHeaderLink = response.headers['location'];
      }
    }
  }

  /**
   * Returns long running operation result.
   * @returns {object} HttpOperationResponse
   */
  getOperationResponse() {
    let result = new msRest.HttpOperationResponse();
    result.request = this.request;
    result.response = this.response;
    if (this.resource && typeof this.resource.valueOf() === 'string') {
      result.body = this.resource;
    } else {
      result.body = JSON.stringify(this.resource);
    }
    return result;
  }

  /**
   * Returns an Error on operation failure.
   * @returns {object} Error
   */
  getCloudError(err) {
    let errMsg;
    let errCode;

    let error = new Error();
    error.request = msRest.stripRequest(this.request);
    let parsedResponse = this.response.body;
    error.response = msRest.stripResponse(this.response);
    try {
      if (this.response.body && typeof this.response.body.valueOf() === 'string') {
        if (this.response.body === '') this.response.body = null;
        parsedResponse = JSON.parse(this.response.body);
      }
    } catch (err) {
      error.message = `Error "${err.message}" occurred while deserializing the error ` +
        `message "${this.response.body}" for long running operation.`;
      return error;
    }

    if (err && err.message) {
      errMsg = `Long running operation failed with error: "${err.message}".`;
    } else {
      errMsg = `Long running operation failed with status: "${this.status}".`;
    }

    if (parsedResponse) {
      if (parsedResponse.error && parsedResponse.error.message) {
        errMsg = `Long running operation failed with error: "${parsedResponse.error.message}".`;
      }
      if (parsedResponse.error && parsedResponse.error.code) {
        errCode = parsedResponse.error.code;
      }
    }

    error.message = errMsg;
    if (errCode) error.code = errCode;
    error.body = parsedResponse;
    return error;
  }
}

module.exports = PollingState;