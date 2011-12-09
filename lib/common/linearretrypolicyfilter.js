/**
* Copyright 2011 Microsoft Corporation
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

var azureutil = require('../util/util');

exports = module.exports = LinearRetryPolicyFilter;

/**
* Represents the default client retry interval, in milliseconds.
*/
LinearRetryPolicyFilter.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;

/**
* Represents the default client retry count.
*/
LinearRetryPolicyFilter.DEFAULT_CLIENT_RETRY_COUNT = 3;

/**
* Creates a new RetryLinearRetry instance.
*
* @constructor
*/
function LinearRetryPolicyFilter(retryCount, retryInterval) {
  this.retryCount = retryCount ? retryCount : LinearRetryPolicyFilter.DEFAULT_CLIENT_RETRY_COUNT;
  this.retryInterval = retryInterval ? retryInterval : LinearRetryPolicyFilter.DEFAULT_CLIENT_RETRY_INTERVAL;
}

/**
* Determines if the operation should be retried and how long to wait until the next retry.
*/
LinearRetryPolicyFilter.prototype.shouldRetry = function (statusCode, retryData) {
  if (statusCode >= 400 && statusCode < 500) {
    return false;
  }

  var currentCount = (retryData && retryData.retryCount) ? retryData.retryCount : 0;

  return (currentCount < this.retryCount);
};

/**
* Updates the retry data for the next attempt.
*/
LinearRetryPolicyFilter.prototype.updateRetryData = function (retryData, err) {
  if (!retryData) {
    retryData = {
      retryCount: 0,
      retryInterval: this.retryInterval,
      error: null
    };
  }

  if (err) {
    if (retryData.error) {
      err.innerError = retryData.error;
    }

    retryData.error = err;
  }

  retryData.retryCount++;
  return retryData;
};

/**
* Handles an operation with a linear retry policy.
*
* @param {Object}   requestOptions The original request options.
* @param {function} next           The next filter to be handled.
*/
LinearRetryPolicyFilter.prototype.handle = function (requestOptions, next) {
  var self = this;
  var retryData = null;

  var operation = function () {
    // retry policies dont really do anything to the request options
    // so move on to next
    if (next) {
      next(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
        // Previous operation ended so update the retry data
        retryData = self.updateRetryData(retryData, returnObject.error);

        if (returnObject.error && self.shouldRetry(returnObject.response.statusCode, retryData)) {
          // If previous operation ended with an error and the policy allows a retry, do that
          setTimeout(function () {
            operation();
          }, retryData.retryInterval);
        } else {
          if (!azureutil.isNull(returnObject.error)) {
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