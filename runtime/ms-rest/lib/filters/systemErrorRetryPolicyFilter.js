// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var utils = require('../utils');

/**
 * Determines if the operation should be retried and how long to wait until the next retry.
 *
 * @param {object} retryData  The retry data.
 * @return {bool} True if the operation qualifies for a retry; false otherwise.
 */
function shouldRetry(retryData) {
  var currentCount;
  if (!retryData) {
    throw new Error('retryData for the SystemErrorRetryPolicyFilter cannot be null.');
  } else {
    currentCount = (retryData && retryData.retryCount);
  }
  return (currentCount < this.retryCount);
}

/**
 * Updates the retry data for the next attempt.
 *
 * @param {object} retryData  The retry data.
 * @param {object} err        The operation's error, if any.
 */
function updateRetryData (retryData, err) {
  if (!retryData) {
    retryData = {
      retryCount: 0,
      error: null
    };
  }

  if (err) {
    if (retryData.error) {
      err.innerError = retryData.error;
    }

    retryData.error = err;
  }

  // Adjust retry count
  retryData.retryCount++;

  // Adjust retry interval
  var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
  var boundedRandDelta = this.retryInterval * 0.8 + 
    Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
  incrementDelta *= boundedRandDelta;

  retryData.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);

  return retryData;
}

/**
 * Creates a new 'SystemErrorRetryPolicyFilter' instance.
 *
 * @constructor
 * @param {number} retryCount        The client retry count.
 * @param {number} retryInterval     The client retry interval, in milliseconds.
 * @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
 * @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
 */
function SystemErrorRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
  function newFilter(options, next, callback) {
    var retryData = null;

    function retryCallback(err, response, body) {
      retryData = newFilter.updateRetryData(retryData, err);
      if (!utils.objectIsNull(err) && newFilter.shouldRetry(retryData, err) && 
          (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT' || err.code === 'ECONNREFUSED' || 
           err.code === 'ECONNRESET')) {
        // If previous operation ended with an error and the policy allows a retry, do that
        setTimeout(function () {
          next(options, retryCallback);
        }, retryData.retryInterval);
      } else {
        if (!utils.objectIsNull(err)) {
          // If the operation failed in the end, return all errors instead of just the last one
          err = retryData.error;
        }
        callback(err, response, body);
      }
    }
    return next(options, retryCallback);
  }
  
  newFilter.retryCount = isNaN(parseInt(retryCount)) ? SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_RETRY_COUNT : retryCount;
  newFilter.retryInterval =  isNaN(parseInt(retryInterval)) ? SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_RETRY_INTERVAL : retryInterval;
  newFilter.minRetryInterval =  isNaN(parseInt(minRetryInterval)) ? SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_MIN_RETRY_INTERVAL : minRetryInterval;
  newFilter.maxRetryInterval =  isNaN(parseInt(maxRetryInterval)) ? SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_MAX_RETRY_INTERVAL : maxRetryInterval;
  newFilter.shouldRetry = shouldRetry;
  newFilter.updateRetryData = updateRetryData;
  return newFilter;
}

/**
 * Represents the default client retry interval, in milliseconds.
 */
SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;

/**
 * Represents the default client retry count.
 */
SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_RETRY_COUNT = 3;

/**
 * Represents the default maximum retry interval, in milliseconds.
 */
SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;

/**
 * Represents the default minimum retry interval, in milliseconds.
 */
SystemErrorRetryPolicyFilter.prototype.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;

module.exports = SystemErrorRetryPolicyFilter;