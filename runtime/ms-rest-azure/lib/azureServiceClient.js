// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const async = require('async');
const msRest = require('ms-rest');
const PollingState = require('./pollingState');
const LroStates = require('./constants').LongRunningOperationStates;
const WebResource = msRest.WebResource;
const packageJson = require('../package.json');
const moduleName = packageJson.name;
const moduleVersion = packageJson.version;
const RpRegistrationFilter = require('./filters/rpRegistrationFilter');

function _sendLongRunningRequest(options, callback) {
  /* jshint validthis: true */
  let self = this;

  return self.sendRequest(options, (err, result, request, response) => {
    if (err) {
      return callback(err);
    }
    let initialResult = new msRest.HttpOperationResponse();
    initialResult.request = request;
    initialResult.response = response;
    initialResult.body = response.body;
    self.getLongRunningOperationResult(initialResult, options, (err, pollingResult) => {
      if (err) return callback(err);
      // Create Result
      let result = null;
      request = pollingResult.request;
      response = pollingResult.response;
      let responseBody = pollingResult.body;
      if (responseBody === '') responseBody = null;

      // Deserialize Response
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseBody);
        result = JSON.parse(responseBody);
        if (parsedResponse !== null && parsedResponse !== undefined && options.deserializationMapperForTerminalResponse) {
          result = msRest.deserialize(options.deserializationMapperForTerminalResponse, parsedResponse, 'result');
        }
      } catch (error) {
        let deserializationError = new Error(`Error "${JSON.stringify(error, null, 2)}" occurred in deserializing the responseBody - "${responseBody}".`);
        deserializationError.request = msRest.stripRequest(request);
        deserializationError.response = msRest.stripResponse(response);
        return callback(deserializationError);
      }
      return callback(null, result, request, response);
    });
  });
}

function _checkResponseStatusCodeFailed(initialRequest) {
  let statusCode = initialRequest.response.statusCode;
  let method = initialRequest.request.method;
  if (statusCode === 200 || statusCode === 202 ||
    (statusCode === 201 && method === 'PUT') ||
    (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {
    return false;
  } else {
    return true;
  }
}

/**
 * Poll Azure long running PUT, PATCH, POST or DELETE operations.
 * @param {object} [resultOfInitialRequest] - result of the initial request.
 * @param {object} [options]
 * @param {object} [options.customHeaders] headers that will be added to request
 */
function _getLongRunningOperationResult(resultOfInitialRequest, options, callback) {
  /* jshint validthis: true */
  let self = this;

  if (!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('Missing callback');
  }

  if (!resultOfInitialRequest) {
    return callback(new Error('Missing resultOfInitialRequest parameter'));
  }

  if (!resultOfInitialRequest.response) {
    return callback(new Error('Missing resultOfInitialRequest.response'));
  }

  if (!resultOfInitialRequest.request) {
    return callback(new Error('Missing resultOfInitialRequest.request'));
  }

  if (!resultOfInitialRequest.request.method) {
    return callback(new Error('Missing resultOfInitialRequest.request.method'));
  }

  let initialRequestMethod = resultOfInitialRequest.request.method;

  if (self._checkResponseStatusCodeFailed(resultOfInitialRequest)) {
    return callback(new Error(`Unexpected polling status code from long running operation ` +
      `"${resultOfInitialRequest.response.statusCode}" for method "${initialRequestMethod}"`));
  }

  let pollingState = null;

  try {
    pollingState = new PollingState(resultOfInitialRequest, self.longRunningOperationRetryTimeout);
  } catch (error) {
    callback(error);
  }
  let resourceUrl = resultOfInitialRequest.request.url;
  self._options = options;

  async.whilst(
    function () {
      let finished = [LroStates.Succeeded, LroStates.Failed, LroStates.Canceled].some(function (e) {
        return e === pollingState.status;
      });
      return !finished;
    },
    function (callback) {
      setTimeout(function () {
        if (pollingState.azureAsyncOperationHeaderLink) {
          self._updateStateFromAzureAsyncOperationHeader(pollingState, true, function (err) {
            return callback(err);
          });
        } else if (pollingState.locationHeaderLink) {
          self._updateStateFromLocationHeader(initialRequestMethod, pollingState, function (err) {
            return callback(err);
          });
        } else if (initialRequestMethod === 'PUT') {
          self._updateStateFromGetResourceOperation(resourceUrl, pollingState, function (err) {
            return callback(err);
          });
        } else {
          return callback(new Error('Location header is missing from long running operation.'));
        }
      }, pollingState.getTimeout());
    },
    //when done
    function (err) {
      if (pollingState.status === LroStates.Succeeded) {
        if ((pollingState.azureAsyncOperationHeaderLink || !pollingState.resource) &&
          (initialRequestMethod === 'PUT' || initialRequestMethod === 'PATCH')) {
          self._updateStateFromGetResourceOperation(resourceUrl, pollingState, (err) => {
            return callback(err, pollingState.getOperationResponse());
          });
        } else {
          return callback(null, pollingState.getOperationResponse());
        }
      } else {
        return callback(pollingState.getCloudError(err));
      }
    });
}

/**
 * Retrieve operation status by polling from 'azure-asyncoperation' header.
 * @param {object} [pollingState] - The object to persist current operation state.
 * @param {boolean} [inPostOrDelete] - Invoked by Post Or Delete operation.
 */
function _updateStateFromAzureAsyncOperationHeader(pollingState, inPostOrDelete, callback) {
  /* jshint validthis: true */
  this._getStatus(pollingState.azureAsyncOperationHeaderLink, (err, result) => {
    if (err) return callback(err);

    if (!result.body || !result.body.status) {
      return callback(new Error('The response from long running operation does not contain a body.'));
    }

    pollingState.status = result.body.status;
    pollingState.error = result.body.error;
    pollingState.response = result.response;
    pollingState.request = result.request;
    pollingState.resource = null;
    if (inPostOrDelete) {
      pollingState.resource = result.body;
    }
    callback(null);
  });
}

/**
 * Retrieve PUT operation status by polling from 'location' header.
 * @param {string} method - The HTTP method.
 * @param {object} pollingState - The object to persist current operation state.
 */
function _updateStateFromLocationHeader(method, pollingState, callback) {
  /* jshint validthis: true */
  this._getStatus(pollingState.locationHeaderLink, (err, result) => {
    if (err) return callback(err);

    pollingState.updateResponse(result.response);
    pollingState.request = result.request;

    let statusCode = result.response.statusCode;
    if (statusCode === 202) {
      pollingState.status = LroStates.InProgress;
    } else if (statusCode === 200 ||
      (statusCode === 201 && (method === 'PUT' || method === 'PATCH')) ||
      (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {

      pollingState.status = LroStates.Succeeded;

      pollingState.error = {
        code: pollingState.Status,
        message: `Long running operation failed with status "${pollingState.status}".`
      };
      pollingState.resource = result.body;
    } else {
      return callback(new Error('The response from long running operation does not have a valid status code.'));
    }
    callback(null);
  });
}

/**
 * Polling for resource status.
 * @param {function} resourceUrl - The url of resource.
 * @param {object} pollingState - The object to persist current operation state.
 */
function _updateStateFromGetResourceOperation(resourceUrl, pollingState, callback) {
  /* jshint validthis: true */
  this._getStatus(resourceUrl, function (err, result) {
    if (err) return callback(err);
    if (!result.body) {
      return callback(new Error('The response from long running operation does not contain a body.'));
    }

    if (result.body.properties && result.body.properties.provisioningState) {
      pollingState.status = result.body.properties.provisioningState;
    } else {
      pollingState.status = LroStates.Succeeded;
    }

    //we might not throw an error, but initialize here just in case.
    pollingState.error = {
      code: pollingState.status,
      message: `Long running operation failed with status "${pollingState.status}".`
    };

    pollingState.updateResponse(result.response);
    pollingState.request = result.request;
    pollingState.resource = result.body;

    //nothing to return, the 'pollingState' has all the info we care.
    callback(null);
  });
}

/**
 * Retrieve operation status by querying the operation URL.
 * @param {string} operationUrl - URL used to poll operation result.
 */
function _getStatus(operationUrl, callback) {
  /* jshint validthis: true */
  let self = this;
  if (!operationUrl) {
    return callback(new Error('operationUrl cannot be null.'));
  }

  // Construct URL
  let requestUrl = operationUrl.replace(' ', '%20');

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'GET';
  httpRequest.headers = {};
  httpRequest.url = requestUrl;
  if (self._options) {
    for (let headerName in self._options['customHeaders']) {
      if (self._options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = self._options['customHeaders'][headerName];
      }
    }
  }
  // Send Request
  return self.pipeline(httpRequest, function (err, response, responseBody) {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200 && statusCode !== 201 && statusCode !== 202 && statusCode !== 204) {
      let error = new Error(`Invalid status code with response body "${responseBody}" occurred ` +
        `when polling for operation status.`);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      try {
        error.body = JSON.parse(responseBody);

      } catch (badResponse) {
        error.message += ` Could not deserialize error response body - "${responseBody}".`;
        error.body = responseBody;
      }

      return callback(error);
    }
    // Create Result
    let result = new msRest.HttpOperationResponse();
    result.request = httpRequest;
    result.response = response;
    if (responseBody === '') responseBody = null;
    if (statusCode === 200 || statusCode === 201 || statusCode === 202) {
      try {
        result.body = JSON.parse(responseBody);
      } catch (deserializationError) {
        let parseError = new Error(`Error "${deserializationError}" occurred in deserializing the response body - "${responseBody}" -` +
          ` when polling for operation status.`);
        parseError.request = msRest.stripRequest(httpRequest);
        parseError.response = msRest.stripResponse(response);
        parseError.body = responseBody;
        return callback(parseError);
      }
    }
    return callback(null, result);
  });
}

/**
 * @class
 * Initializes a new instance of the AzureServiceClient class.
 * @constructor
 * @param {object} credentials - ApplicationTokenCredentials or 
 * UserTokenCredentials object used for authentication.  
 * 
 * @param {object} options - The parameter options used by ServiceClient
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response. 
 * Default value is: 'en-US'.
 *  
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value 
 * is generated and included in each request. Default is true.
 * 
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for 
 * Long Running Operations. Default value is 30.
 * 
 * @param {number} [options.rpRegistrationRetryTimeout] - Gets or sets the retry timeout in seconds for 
 * AutomaticRPRegistration. Default value is 30.
 *
 */
class AzureServiceClient extends msRest.ServiceClient {
  constructor(credentials, options) {
    if (!credentials) {
      throw new Error('Azure clients require credentials.');
    }

    if (!options) options = {};
    if (!options.filters) options.filters = [];
    options.filters.push(RpRegistrationFilter.create(options.rpRegistrationRetryTimeout));

    super(credentials, options);

    this.acceptLanguage = 'en-US';
    this.generateClientRequestId = true;
    this.longRunningOperationRetryTimeout = 30;

    if (options.acceptLanguage !== null && options.acceptLanguage !== undefined) {
      this.acceptLanguage = options.acceptLanguage;
    }

    if (options.generateClientRequestId !== null && options.generateClientRequestId !== undefined) {
      this.generateClientRequestId = options.generateClientRequestId;
    }

    if (options.longRunningOperationRetryTimeout !== null && options.longRunningOperationRetryTimeout !== undefined) {
      this.longRunningOperationRetryTimeout = options.longRunningOperationRetryTimeout;
    }

    this.addUserAgentInfo(`${moduleName}/${moduleVersion}`);
    this._getLongRunningOperationResult = _getLongRunningOperationResult;
    this._sendLongRunningRequest = _sendLongRunningRequest;
    this._checkResponseStatusCodeFailed = _checkResponseStatusCodeFailed;
    this._getStatus = _getStatus;
    this._updateStateFromGetResourceOperation = _updateStateFromGetResourceOperation;
    this._updateStateFromLocationHeader = _updateStateFromLocationHeader;
    this._updateStateFromAzureAsyncOperationHeader = _updateStateFromAzureAsyncOperationHeader;

  }

  /**
   * Poll Azure long running PUT or PATCH operation. (Deprecated, new version of the code-gen will generate code to call getLongRunningOperationResult)
   * @param {object} [resultOfInitialRequest] - Response of the initial request for the long running operation.
   * @param {object} [options]
   * @param {object} [options.customHeaders] headers that will be added to request
   */
  getPutOrPatchOperationResult(resultOfInitialRequest, options, callback) {
    return this.getLongRunningOperationResult(resultOfInitialRequest, options, callback);
  }

  /**
   * Poll Azure long running POST or DELETE operations. (Deprecated, new version of the code-gen will generate code to call getLongRunningOperationResult)
   * @param {object} [resultOfInitialRequest] - result of the initial request.
   * @param {object} [options]
   * @param {object} [options.customHeaders] headers that will be added to request
   */
  getPostOrDeleteOperationResult(resultOfInitialRequest, options, callback) {
    return this.getLongRunningOperationResult(resultOfInitialRequest, options, callback);
  }


  /**
   * Poll Azure long running PUT, PATCH, POST or DELETE operations.
   * @param {object} [resultOfInitialRequest] - result of the initial request.
   * @param {object} [options]
   * @param {object} [options.customHeaders] headers that will be added to request
   */
  getLongRunningOperationResult(resultOfInitialRequest, options, optionalCallback) {
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._getLongRunningOperationResult(resultOfInitialRequest, options, (err, result) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._getLongRunningOperationResult(resultOfInitialRequest, options, optionalCallback);
    }
  }

  /**
   * Sends the request and returns the response.
   *
   * @param {object|WebResource} options The request options that should be provided to send a request successfully. 
   * It can either be an options object (a simple json object) or the WebResource object with all the required properties set to make a request.
   *
   * @param {string} options.method The HTTP request method. Valid values are 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'.
   *
   * @param {string} [options.url] The request url. It may or may not have query parameters in it. 
   * Either provide the 'url' or provide the 'pathTemplate' in the options object. Both the options are mutually exclusive.
   *
   * @param {object} [options.queryParameters] A dictionary of query parameters to be appended to the url, where 
   * the 'key' is the 'query-parameter-name' and the 'value' is the 'query-parameter-value'. 
   * The 'query-parameter-value' can be of type 'string' or it can be of type 'object'. 
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'query-parameter-value'.
   * Example: 
   *    - query-parameter-value in 'object' format: { 'query-parameter-name': { value: 'query-parameter-value', skipUrlEncoding: true } }
   *    - query-parameter-value in 'string' format: { 'query-parameter-name': 'query-parameter-value'}.
   * Note: 'If options.url already has some query parameters, then the value provided in options.queryParameters will be appended to the url.
   *
   * @param {string} [options.pathTemplate] The path template of the request url. Either provide the 'url' or provide the 'pathTemplate' 
   * in the options object. Both the options are mutually exclusive.
   * Example: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}'
   *
   * @param {string} [options.baseUrl] The base url of the request. Default value is: 'https://management.azure.com'. This is applicable only with 
   * options.pathTemplate. If you are providing options.url then it is expected that you provide the complete url.
   *
   * @param {object} [options.pathParameters] A dictionary of path parameters that need to be replaced with actual values in the pathTemplate.
   * Here the key is the 'path-parameter-name' and the value is the 'path-parameter-value'. 
   * The 'path-parameter-value' can be of type 'string'  or it can be of type 'object'.
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'path-parameter-value'.
   * Example: 
   *    - path-parameter-value in 'object' format: { 'path-parameter-name': { value: 'path-parameter-value', skipUrlEncoding: true } }
   *    - path-parameter-value in 'string' format: { 'path-parameter-name': 'path-parameter-value' }.
   *
   * @param {object} [options.headers] A dictionary of request headers that need to be applied to the request.
   * Here the key is the 'header-name' and the value is the 'header-value'. The header-value MUST be of type string.
   *  - ContentType must be provided with the key name as 'Content-Type'. Default value 'application/json; charset=utf-8'.
   *  - 'Transfer-Encoding' is set to 'chunked' by default if 'options.bodyIsStream' is set to true.
   *  - 'Content-Type' is set to 'application/octet-stream' by default if 'options.bodyIsStream' is set to true.
   *  - 'accept-language' by default is set to 'en-US'
   *  - 'x-ms-client-request-id' by default is set to a new Guid. To not generate a guid for the request, please set options.disableClientRequestId to true
   *
   * @param {boolean} [options.disableClientRequestId] When set to true, instructs the client to not set 'x-ms-client-request-id' header to a new Guid().
   *
   * @param {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
   *
   * @param {object} [options.serializationMapper] - Provides information on how to serialize the request body.
   * 
   * @param {object} [options.deserializationMapper] - Provides information on how to deserialize the response body.
   * 
   * @param {object} [options.deserializationMapperforTerminalResponse] - Provides information on how to deserialize the response body for terminal response.
   * 
   * @param {boolean} [options.disableJsonStringifyOnBody] - When set to true, this method will not apply `JSON.stringify()` to the request body. Default value: false.
   *
   * @param {boolean} [options.bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
   *
   * @param {function} [optionalCallback] The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
   * 
   *     {function} optionalCallback(err, result, request, response)
   *
   *                  {Error}  err      - The Error object if an error occurred, null otherwise.
   *
   *                  {object} result   - The parsed (JSON.parse()) responseBody
   *
   *                  {object} request  - The HTTP Request object.
   * 
   *                  {stream} response - The raw HTTP Response stream.
   * 
   *     {Promise} A promise is returned.
   *        @resolve {result} - The parsed (JSON.parse()) responseBody.
   *        @reject  {Error}  - The error object.
   */
  sendLongRunningRequest(options, optionalCallback) {
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = {};
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._sendLongRunningRequest(options, (err, result) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._sendLongRunningRequest(options, optionalCallback);
    }
  }

  /**
   * Sends the request and returns the response.
   *
   * @param {object|WebResource} options The request options that should be provided to send a request successfully. 
   * It can either be an options object (a simple json object) or the WebResource object with all the required properties set to make a request.
   *
   * @param {string} options.method The HTTP request method. Valid values are 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'.
   *
   * @param {string} [options.url] The request url. It may or may not have query parameters in it. 
   * Either provide the 'url' or provide the 'pathTemplate' in the options object. Both the options are mutually exclusive.
   *
   * @param {object} [options.queryParameters] A dictionary of query parameters to be appended to the url, where 
   * the 'key' is the 'query-parameter-name' and the 'value' is the 'query-parameter-value'. 
   * The 'query-parameter-value' can be of type 'string' or it can be of type 'object'. 
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'query-parameter-value'.
   * Example: 
   *    - query-parameter-value in 'object' format: { 'query-parameter-name': { value: 'query-parameter-value', skipUrlEncoding: true } }
   *    - query-parameter-value in 'string' format: { 'query-parameter-name': 'query-parameter-value'}.
   * Note: 'If options.url already has some query parameters, then the value provided in options.queryParameters will be appended to the url.
   *
   * @param {string} [options.pathTemplate] The path template of the request url. Either provide the 'url' or provide the 'pathTemplate' 
   * in the options object. Both the options are mutually exclusive.
   * Example: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}'
   *
   * @param {string} [options.baseUrl] The base url of the request. Default value is: 'https://management.azure.com'. This is applicable only with 
   * options.pathTemplate. If you are providing options.url then it is expected that you provide the complete url.
   *
   * @param {object} [options.pathParameters] A dictionary of path parameters that need to be replaced with actual values in the pathTemplate.
   * Here the key is the 'path-parameter-name' and the value is the 'path-parameter-value'. 
   * The 'path-parameter-value' can be of type 'string'  or it can be of type 'object'.
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'path-parameter-value'.
   * Example: 
   *    - path-parameter-value in 'object' format: { 'path-parameter-name': { value: 'path-parameter-value', skipUrlEncoding: true } }
   *    - path-parameter-value in 'string' format: { 'path-parameter-name': 'path-parameter-value' }.
   *
   * @param {object} [options.headers] A dictionary of request headers that need to be applied to the request.
   * Here the key is the 'header-name' and the value is the 'header-value'. The header-value MUST be of type string.
   *  - ContentType must be provided with the key name as 'Content-Type'. Default value 'application/json; charset=utf-8'.
   *  - 'Transfer-Encoding' is set to 'chunked' by default if 'options.bodyIsStream' is set to true.
   *  - 'Content-Type' is set to 'application/octet-stream' by default if 'options.bodyIsStream' is set to true.
   *  - 'accept-language' by default is set to 'en-US'
   *  - 'x-ms-client-request-id' by default is set to a new Guid. To not generate a guid for the request, please set options.disableClientRequestId to true
   *
   * @param {boolean} [options.disableClientRequestId] When set to true, instructs the client to not set 'x-ms-client-request-id' header to a new Guid().
   *
   * @param {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
   *
   * @param {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
   *
   * @param {object} [options.serializationMapper] - Provides information on how to serialize the request body.
   * 
   * @param {object} [options.deserializationMapper] - Provides information on how to deserialize the response body.
   * 
   * @param {object} [options.deserializationMapperForTerminalResponse] - Provides information on how to deserialize the response body for terminal response.
   * 
   * @param {boolean} [options.disableJsonStringifyOnBody] - When set to true, this method will not apply `JSON.stringify()` to the request body. Default value: false.
   *
   * @param {boolean} [options.bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
   *
   * @param {function} [optionalCallback] The optional callback.
   *
   * @returns {Promise} A promise is returned.
   * @resolve {HttpOperationResponse<T>} - The HttpOperationResponse which contains the raw request, response and the parsed (JSON.parse) response body
   * @reject  {Error}  - The error object.
   */
  sendLongRunningRequestWithHttpOperationResponse(options) {
    let self = this;
    return new Promise((resolve, reject) => {
      self._sendLongRunningRequest(options, (err, result, request, response) => {
        let httpRes = new msRest.HttpOperationResponse(request, response);
        httpRes.body = result;
        if (err) { reject(err); }
        else { resolve(httpRes); }
        return;
      });
    });
  }
}

module.exports = AzureServiceClient;