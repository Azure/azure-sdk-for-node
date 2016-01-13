﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';

var util = require('util');
var msRest = require('ms-rest');
var LroStates = require('./constants').LongRunningOperationStates;

/**
 * @class
 * Initializes a new instance of the PollingState class.
 * @constructor
 * @param {object} [response] - The response object to extract long
 * running operation status.
 * 
 * @param {number} retryTimeout - The timeout in seconds to retry on
 * intermediate operation results.
 */
function PollingState(resultOfInitialRequest, retryTimeout) {
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
    var deserializationError = new Error(util.format('Error "%s" occurred in parsing the responseBody ' + 
      'while creating the PollingState for Long Running Operation- "%s"', error, resultOfInitialRequest.body));
    deserializationError.request = resultOfInitialRequest.request;
    deserializationError.response = resultOfInitialRequest.response;
    throw deserializationError;
  }
  
  if (this.resource && this.resource.properties && this.resource.properties.provisioningState) {
    this.status = this.resource.properties.provisioningState;
  } else {
    switch (this.response.statusCode) {
      case 202:
        this.status = LroStates.InProgress;
        break;

      case 204:
      case 201:
      case 200:
        this.status = LroStates.Succeeded;
        break;

      default:
        this.status = LroStates.Failed;
        break;
    }
  }
}

/**
 * Gets timeout in milliseconds. 
 * @returns {number} timeout
 */
PollingState.prototype.getTimeout = function () {
  if (this._retryTimeout || this._retryTimeout === 0) {
    return this._retryTimeout * 1000;
  }
  if (this.response && this.response.headers['retry-after']) {
    return parseInt(this.response.headers['retry-after']) * 1000;
  }
  return 30 * 1000;
};

/**
 * Update cached data using the provided response object
 * @param {object} [response] - provider response object.
 */
PollingState.prototype.updateResponse = function (response) {
  this.response = response;
  if (response && response.headers) {
    if (response.headers['azure-asyncoperation']) {
      this.azureAsyncOperationHeaderLink = response.headers['azure-asyncoperation'];
    }
    
    if (response.headers['location']) {
      this.locationHeaderLink = response.headers['location'];
    }
  }
};

/**
 * Returns long running operation result.
 * @returns {object} HttpOperationResponse
 */
PollingState.prototype.getOperationResponse = function () {
  var result = new msRest.HttpOperationResponse();
  result.request = this.request;
  result.response = this.response;
  if (this.resource && typeof this.resource.valueOf() === 'string') {
    result.body = this.resource;
  } else {
    result.body = JSON.stringify(this.resource);
  }
  return result;
};

/**
 * Returns an Error on operation failure.
 * @returns {object} Error
 */
PollingState.prototype.getCloudError = function (err) {
  var errMsg;
  if (err && err.message) {
    errMsg = util.format('Long running operation failed with error: \'%s\'.', err.message);  
  } else {
    errMsg = util.format('Long running operation failed with status: \'%s\'.', this.status);
  }
  
  var error = new Error(errMsg);
  error.body = this.response.body;
  error.request = this.request;
  error.response = this.response;
  return error;
};

module.exports = PollingState;