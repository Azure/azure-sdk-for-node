/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var azureutil = require('../../util/util');

exports = module.exports = ExponentialRetryPolicyFilter;

/**
* Represents the default client retry interval, in milliseconds.
*/
ExponentialRetryPolicyFilter.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;

/**
* Represents the default client retry count.
*/
ExponentialRetryPolicyFilter.DEFAULT_CLIENT_RETRY_COUNT = 3;

/**
* Represents the default maximum retry interval, in milliseconds.
*/
ExponentialRetryPolicyFilter.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;

/**
* Represents the default minimum retry interval, in milliseconds.
*/
ExponentialRetryPolicyFilter.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;

/**
* Creates a new 'ExponentialRetryPolicyFilter' instance.
*
* @constructor
* @param {number} retryCount        The client retry count.
* @param {number} retryInterval     The client retry interval, in milliseconds.
* @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
* @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
*/
function ExponentialRetryPolicyFilter(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
  this.retryCount = retryCount ? retryCount : ExponentialRetryPolicyFilter.DEFAULT_CLIENT_RETRY_COUNT;
  this.retryInterval = retryInterval ? retryInterval : ExponentialRetryPolicyFilter.DEFAULT_CLIENT_RETRY_INTERVAL;
  this.minRetryInterval = minRetryInterval ? minRetryInterval : ExponentialRetryPolicyFilter.DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
  this.maxRetryInterval = maxRetryInterval ? maxRetryInterval : ExponentialRetryPolicyFilter.DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
}

/**
 * Determines if the operation should be retried and how long to wait until the next retry.
 *
 * @param {number} statusCode The HTTP status code.
 * @param {object} retryData  The retry data.
 * @return {bool} True if the operation qualifies for a retry; false otherwise.
 */
ExponentialRetryPolicyFilter.prototype.shouldRetry = function (statusCode, retryData) {
  if (statusCode >= 400 && statusCode < 500) {
    return false;
  }

  var currentCount = (retryData && retryData.retryCount) ? retryData.retryCount : 0;

  return (currentCount < this.retryCount);
};

/**
 * Updates the retry data for the next attempt.
 *
 * @param {object} retryData  The retry data.
 * @param {object} err        The operation's error, if any.
 * @return {undefined}
 */
ExponentialRetryPolicyFilter.prototype.updateRetryData = function (retryData, err) {
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
  var boundedRandDelta = this.retryInterval * 0.8 + Math.floor(Math.random() * (this.retryInterval * 1.2 - this.retryInterval * 0.8));
  incrementDelta *= boundedRandDelta;

  retryData.retryInterval = Math.min(this.minRetryInterval + incrementDelta, this.maxRetryInterval);

  return retryData;
};

/**
* Handles an operation with an exponential retry policy.
*
* @param {Object}   requestOptions The original request options.
* @param {function} next           The next filter to be handled.
* @return {undefined}
*/
ExponentialRetryPolicyFilter.prototype.handle = function (requestOptions, next) {
  var self = this;
  var retryData = null;

  var operation = function() {
    // retry policies dont really do anything to the request options
    // so move on to next
    if (next) {
      next(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
        // Previous operation ended so update the retry data
        retryData = self.updateRetryData(retryData, returnObject.error);

        if (returnObject.error &&
            !azureutil.objectIsNull(returnObject.response) &&
            self.shouldRetry(returnObject.response.statusCode, retryData)) {

          // If previous operation ended with an error and the policy allows a retry, do that
          setTimeout(function() {
            operation();
          }, retryData.retryInterval);
        } else {
          if (!azureutil.objectIsNull(returnObject.error)) {
            // If the operation failed in the end, return all errors instead of just the last one
            returnObject.error = retryData.error;
          }

          if (nextPostCallback) {
            nextPostCallback(returnObject);
          } else if (finalCallback) {
            finalCallback(returnObject);
          }
        }
      });
    }
  };

  operation();
};