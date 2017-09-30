// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

var request = require('request');
var utils = require('../utils');

exports.retryTimeout = 30;

/**
 * Mostly all the filters are in the generic runtime 'ms-rest'. However this one ends up here because
 * it is Azure specific. This filter is responsible for autoregistering an RP if the initial request failed.
 * After successful registration of the RP it retries the initial request. Other filters play with other aspects
 * of the request/response but the actual request on the wire is made from the sink. However, this filter 
 * makes actual requests on the wire. It does not depend on the sink. This is done because it is tasked to register
 * the RP, poll the registration status and the retry the initial request.
 */

/**
 * Creates a filter that verifies whether the request failed due to RP not being registered.
 * It tries to register the RP and after successful registration it retries the original request.
 * @param {number} retryTimeoutInSec The retry timeout in seconds. Default is 30 seconds.
 */
exports.create = function create(retryTimeoutInSec) {

  if (retryTimeoutInSec !== null && retryTimeoutInSec !== undefined) {
    exports.retryTimeout = retryTimeoutInSec;
  }
  return function handle(options, next, callback) {
    return next(options, function (err, response, body) {
      if (err) {
        return callback(err);
      }
      let rpName, urlPrefix;
      if (response.statusCode === 409) {
        rpName = exports.checkRPNotRegisteredError(body);
        if (rpName) {
          urlPrefix = exports.extractSubscriptionUrl(options.url);
          return exports.registerRP(urlPrefix, rpName, options, (registrationErr, result) => {
            if (registrationErr) {
              //Autoregistration of ${provider} failed for some reason. We will not return this error 
              //instead will return the initial response with 409 status code back to the user.
              return callback(err, response, body);
            }
            if (result) {
              //Retry the original request. We have to change the x-ms-client-request-id 
              //otherwise Azure endpoint will return the initial 409 (cached) response.
              options.headers['x-ms-client-request-id'] = utils.generateUuid();
              return request(options.url, options, (error, response) => {
                return callback(error, response, response.body);
              });
            } else {
              return callback(err, response, body);
            }
          });
        }
      }
      return callback(err, response, body);
    });
  };
};

/**
 * Reuses the headers of the original request and url (if specified).
 * @param {object} originalRequest The original request
 * @param {boolean} reuseUrlToo Should the url from the original request be reused as well. Default false.
 * @returns {object} reqOptions - A new request object with desired headers.
 */
function getRequestEssentials(originalRequest, reuseUrlToo) {
  let reqOptions = {
    headers: {}
  };
  if (reuseUrlToo) {
    reqOptions.url = originalRequest.url;
  }

  //Copy over the original request headers. This will get us the auth token and other useful stuff from
  //the original request header. Thus making it easier to make requests from this filter.
  for (let h in originalRequest.headers) {
    reqOptions.headers[h] = originalRequest.headers[h];
  }
  //We have to change the x-ms-client-request-id otherwise Azure endpoint 
  //will return the initial 409 (cached) response.
  reqOptions.headers['x-ms-client-request-id'] = utils.generateUuid();

  //Set content-type to application/json
  reqOptions.headers['Content-Type'] = 'application/json; charset=utf-8';

  return reqOptions;
}

/**
 * Validates the error code and message associated with 409 response status code. If it matches to that of 
 * RP not registered then it returns the name of the RP else returns undefined.
 * @param {string} body - The response body received after making the original request.
 * @returns {string} result The name of the RP if condition is satisfied else undefined.
 */
exports.checkRPNotRegisteredError = function checkRPNotRegisteredError(body) {
  let result, responseBody;
  if (body) {
    try {
      responseBody = JSON.parse(body);
    } catch (err) {
      //do nothing;
    }
    if (responseBody && responseBody.error && responseBody.error.message &&
      responseBody.error.code && responseBody.error.code === 'MissingSubscriptionRegistration') {
      let matchRes = responseBody.error.message.match(/.*'(.*)'/i);
      if (matchRes) {
        result = matchRes.pop();
      }
    }
  }
  return result;
};

/**
 * Extracts the first part of the URL, just after subscription: 
 * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
 * @param {string} url - The original request url
 * @returns {string} urlPrefix The url prefix as explained above.
 */
exports.extractSubscriptionUrl = function extractSubscriptionUrl(url) {
  let result;
  let matchRes = url.match(/.*\/subscriptions\/[a-f0-9-]+\//ig);
  if (matchRes && matchRes[0]) {
    result = matchRes[0];
  } else {
    throw new Error(`Unable to extract subscriptionId from the given url - ${url}.`);
  }
  return result;
};

/**
 * Registers the given provider.
 * @param {string} urlPrefix - https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
 * @param {string} provider - The provider name to be registered.
 * @param {object} originalRequest - The original request sent by the user that returned a 409 response
 * with a message that the provider is not registered.
 * @param {registrationCallback} callback - The callback that handles the RP registration
 */
exports.registerRP = function registerRP(urlPrefix, provider, originalRequest, callback) {
  let postUrl = `${urlPrefix}providers/${provider}/register?api-version=2016-02-01`;
  let getUrl = `${urlPrefix}providers/${provider}?api-version=2016-02-01`;
  let reqOptions = getRequestEssentials(originalRequest);
  return request.post(postUrl, reqOptions, (err, response) => {
    if (response.statusCode !== 200) {
      return callback(new Error(`Autoregistration of ${provider} failed. Please try registering manually.`));
    }
    return exports.getRegistrationStatus(getUrl, originalRequest, (err, result) => {
      if (err) {
        return callback(err, result);
      }
      return callback(null, result);
    });
  });
};

/**
 * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
 * Polling will happen till the registrationState property of the response body is 'Registered'.
 * @param {string} url - The request url for polling
 * @param {object} originalRequest - The original request sent by the user that returned a 409 response
 * with a message that the provider is not registered.
 * @param {registrationCallback} callback - The callback that handles the RP registration.
 */
exports.getRegistrationStatus = function getRegistrationStatus(url, originalRequest, callback) {
  let reqOptions = getRequestEssentials(originalRequest);
  return request.get(url, reqOptions, (err, response, body) => {
    if (err) return callback(err);
    let responseBody = {};
    try {
      responseBody = JSON.parse(body);
    } catch (error) {
      return callback(new Error(`An error occurred while parsing the response body for ` +
        `getting registration status ${url}. The response body was ${body}.`));
    }
    if (responseBody.registrationState && responseBody.registrationState === 'Registered') {
      return callback(null, true);
    } else {
      setTimeout(() => {
        return exports.getRegistrationStatus(url, originalRequest, callback);
      }, exports.retryTimeout * 1000);

    }
  });
};

/**
 * This callback handles the RP registration
 * @callback registrationCallback
 * @param {object} error - The Error object
 * @param {boolean} result - true - provider is registered;  false - provider is not registered.
 */