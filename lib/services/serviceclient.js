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

// Module dependencies.
var http = require('http');
var url = require('url');
var util = require('util');
var qs = require('qs');
var crypto = require('crypto');
var xml2js = require('xml2js');

var azureutil = require('../util/util');

var Constants = require('../util/constants');
var HeaderConstants = Constants.HeaderConstants;
var HttpConstants = Constants.HttpConstants;
var Logger = require('../diagnostics/logger');

// Expose 'ServiceClient'.
exports = module.exports = ServiceClient;

/*
* Used environment variables.
* @enum {string}
*/
ServiceClient.EnvironmentVariables = {
  AZURE_STORAGE_ACCOUNT: 'AZURE_STORAGE_ACCOUNT',
  AZURE_STORAGE_ACCESS_KEY: 'AZURE_STORAGE_ACCESS_KEY',
  HTTP_PROXY: 'HTTP_PROXY',
  HTTPS_PROXY: 'HTTPS_PROXY',
  ALL_PROXY: 'ALL_PROXY',
  EMULATED: 'EMULATED'
};

/**
* Default credentials.
*/
ServiceClient.DEVSTORE_STORAGE_ACCOUNT = 'devstoreaccount1';
ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==';

/**
* Development ServiceClient URLs.
*/
ServiceClient.DEVSTORE_BLOB_HOST = '127.0.0.1:10000';
ServiceClient.DEVSTORE_QUEUE_HOST = '127.0.0.1:10001';
ServiceClient.DEVSTORE_TABLE_HOST = '127.0.0.1:10002';

/**
* Live ServiceClient URLs.
*/
ServiceClient.CLOUD_BLOB_HOST = 'blob.core.windows.net';
ServiceClient.CLOUD_QUEUE_HOST = 'queue.core.windows.net';
ServiceClient.CLOUD_TABLE_HOST = 'table.core.windows.net';

/**
* The default protocol.
*/
ServiceClient.DEFAULT_PROTOCOL = Constants.HTTP + '://';

/**
* The port.
*/
ServiceClient.DEFAULT_PORT = 80;

// Validation error messages
ServiceClient.incorrectStorageAccountErr = 'Account name must be a non empty string. Set AZURE_STORAGE_ACCOUNT';
ServiceClient.incorrectStorageAccessKeyErr = 'AccessKey must be a non empty string. Set AZURE_STORAGE_ACCESS_KEY';

/**
* Creates a new ServiceClient object.
*
* @constructor
* @param {string} host                    The host for the service.
* @param {string} storageAccount          The storage account.
* @param {string} storageAccessKey        The storage access key.
* @param {object} authenticationProvider  The authentication provider object (e.g. sharedkey / sharedkeytable / sharedaccesssignature).
*/
function ServiceClient(host, storageAccount, storageAccessKey, authenticationProvider) {
  this._setAccountCredentials(storageAccount, storageAccessKey);
  this._initDefaultFilter();

  if (host) {
    var parsedHost = this._parseHost(host);
    this.host = parsedHost.hostname;
    this.port = parsedHost.port;
    this.protocol = parsedHost.protocol + '//';
  }
  else {
    this.protocol = ServiceClient.DEFAULT_PROTOCOL;
  }

  this.apiVersion = HeaderConstants.TARGET_STORAGE_VERSION;
  this.useProxy = false;
  this.proxyUrl = '';
  this.proxyPort = 80;
  this.usePathStyleUri = ServiceClient.isEmulated(host);
  this.authenticationProvider = authenticationProvider;
  this.logger = new Logger(Logger.LogLevels.NOTICE);
}

/**
* Performs a REST service request through HTTP expecting an input stream.
*
* @param {WebResource} webResource                      The webresource on which to perform the request.
* @param {string}      outputData                       The outgoing request data as a raw string.
* @param {object}      [options]                        The request options.
* @param {int}         [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function}    callback                         The response callback function.
*/
ServiceClient.prototype.performRequest = function (webResource, outputData, options, callback) {
  this._performRequest(webResource, { outputData: outputData }, options, callback);
};

/**
* Performs a REST service request through HTTP expecting an input stream.
*
* @param {WebResource} webResource                      The webresource on which to perform the request.
* @param {Stream}      outputStream                     The outgoing request data as a stream.
* @param {object}      [options]                        The request options.
* @param {int}         [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function}    callback                         The response callback function.
*/
ServiceClient.prototype.performRequestOutputStream = function (webResource, outputStream, options, callback) {
  this._performRequest(webResource, { outputStream: outputStream }, options, callback);
};

/**
* Performs a REST service request through HTTP expecting an input stream.
*
* @param {WebResource} webResource                      The webresource on which to perform the request.
* @param {string}      outputData                       The outgoing request data as a raw string.
* @param {Stream}      inputStream                      The ingoing response data as a stream.
* @param {object}      [options]                        The request options.
* @param {int}         [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function}    callback                         The response callback function.
*/
ServiceClient.prototype.performRequestInputStream = function (webResource, outputData, inputStream, options, callback) {
  this._performRequest(webResource, { outputData: outputData, inputStream: inputStream }, options, callback);
};

/**
* Performs a REST service request through HTTP.
*
* @param {WebResource} webResource                      The webresource on which to perform the request.
* @param {object}      body                             The request body.
* @param {string}      [body.outputData]                The outgoing request data as a raw string.
* @param {Stream}      [body.outputStream]              The outgoing request data as a stream.
* @param {Stream}      [body.inputStream]               The ingoing response data as a stream.
* @param {object}      [options]                        The request options.
* @param {int}         [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function}    callback                         The response callback function.
*/
ServiceClient.prototype._performRequest = function (webResource, body, options, callback) {
  var requestOptions = this._buildRequestOptions(webResource, options);
  this.logger.log(Logger.LogLevels.DEBUG, "REQUEST OPTIONS:\n" + util.inspect(requestOptions));

  var calculateMD5 = !(options && options.disableContentMD5);

  var self = this;
  var operation = function (finalRequestOptions, operationCallback, next) {
    self.logger.log(Logger.LogLevels.DEBUG, "FINAL REQUEST OPTIONS:\n" + util.inspect(finalRequestOptions));
    var request = http.request(finalRequestOptions, function (response) {
      var responseBody = '';

      var digest = null;
      if (calculateMD5) {
        digest = crypto.createHash('md5');
      }

      // Receiving response data.
      response.on('data', function (chunk) {
        if ((body && !body.inputStream) || (response.statusCode && !webResource.validResponse(response.statusCode))) {
          responseBody += chunk;
        } else if (body && !body.inputStream.write(chunk, 'binary')) {
          response.pause();
        }

        if (calculateMD5) {
          digest.update(chunk);
        }
      });

      if (body && body.inputStream) {
        body.inputStream.on('drain', function () {
          response.resume();
        });
      }

      response.on('error', function () {
        if (body.inputStream) {
          body.inputStream.end();
        }
      });

      // End receiving the response.
      response.on('end', function () {
        if (body && body.inputStream) {
          body.inputStream.end();
        }

        var md5 = null;
        if (calculateMD5) {
          md5 = digest.digest('base64');
        }

        if (operationCallback) {
          response.body = responseBody;
          response.md5 = md5;
          var responseObject = self._processResponse(webResource, response);
          operationCallback(responseObject, next);
        }
      });
    });

    // Pipe request body
    if (body && body.outputData) {
      request.end(body.outputData);
    } else if (body && body.outputStream) {
      body.outputStream.pipe(request);
    } else {
      request.end();
    }
  };

  // The filter will do what it needs to the requestOptions and will provide a
  // function to be handled after the reply
  this.filter(requestOptions, function (postFiltersRequestOptions, nextPostCallback) {
    // If there is a filter, flow is:
    // filter -> operation -> process response -> next filter
    operation(postFiltersRequestOptions, callback, nextPostCallback);
  });
};

/**
* Process the response.
*
* @param {WebResource} webResource  The web resource that made the request.
* @param {Response}    response     The response object.
* @return The normalized responseObject.
*/
ServiceClient.prototype._processResponse = function (webResource, response) {
  var rsp;
  var responseObject;

  if (webResource.validResponse(response.statusCode)) {
    rsp = this._buildResponse(true, response.body, response.headers, response.statusCode, response.md5);

    if (webResource.rawResponse) {
      responseObject = { error: null, response: rsp };
    } else {
      responseObject = { error: null, response: this._parseResponse(rsp) };
    }
  } else {
    rsp = this._parseResponse(this._buildResponse(false, response.body, response.headers, response.statusCode, response.md5));

    if (response.statusCode < 400 || response.statusCode >= 500) {
      this.logger.log(Logger.LogLevels.ERROR, util.inspect(rsp.body));
    }

    var normalizedError = this._normalizeError(rsp.body);
    responseObject = { error: normalizedError, response: rsp };
  }

  this.logger.log(Logger.LogLevels.DEBUG, "RESPONSE:\n" + util.inspect(responseObject));

  return responseObject;
};

/**
* Associate a filtering operation with this ServiceClient. Filtering operations
* can include logging, automatically retrying, etc. Filter operations are objects
* that implement a method with the signature:
*
*     "function handle (requestOptions, next)".
*
* After doing its preprocessing on the request options, the method needs to call
* "next" passing a callback with the following signature:
* signature:
*
*     "function (returnObject, finalCallback, next)"
*
* In this callback, and after processing the returnObject (the response from the
* request to the server), the callback needs to either invoke next if it exists to
* continue processing other filters or simply invoke finalCallback otherwise to end
* up the service invocation.
*
* @param {Object} filter The new filter object.
* @return {ServiceClient} A new service client with the filter applied.
*/
ServiceClient.prototype.withFilter = function (newFilter) {
  if (azureutil.isNull(newFilter) || !newFilter.handle) {
    throw new Error('Incorrect filter object.');
  }

  // Create a new object with the same members as the current service
  var derived = {};
  for (var property in this) {
    derived[property] = this[property];
  }

  // If the current service has a filter, merge it with the new filter
  // (allowing us to effectively pipeline a series of filters)
  var parentFilter = this.filter;
  var mergedFilter = newFilter;
  if (parentFilter !== undefined) {
    // The parentFilterNext is either the operation or the nextPipe function generated on a previous merge
    // Ordering is [f3 pre] -> [f2 pre] -> [f1 pre] -> operation -> [f1 post] -> [f2 post] -> [f3 post]
    mergedFilter = function (originalRequestOptions, parentFilterNext) {
      newFilter.handle(originalRequestOptions, function (postRequestOptions, newFilterCallback) {
        // handle parent filter pre and get Parent filter post
        var next = function (postPostRequestOptions, parentFilterCallback) {
          // The parentFilterNext is the filter next to the merged filter. 
          // For 2 filters, that'd be the actual operation.
          parentFilterNext(postPostRequestOptions, function (responseObject, responseCallback, finalCallback) {
            parentFilterCallback(responseObject, finalCallback, function (postResponseObject) {
              newFilterCallback(postResponseObject, responseCallback, finalCallback);
            });
          });
        };

        parentFilter(postRequestOptions, next);
      });
    };
  }

  // Store the filter so it can be applied in performRequest
  derived.filter = mergedFilter;
  return derived;
};

/**
* Builds the request options to be passed to the http.request method.
*
* @param {WebResource} webResource The webresource where to build the options from.
* @param {object}      options     The request options.
* @return {object} A request options object.
*/
ServiceClient.prototype._buildRequestOptions = function (webResource, options) {
  if (!webResource.headers || !webResource.headers[HeaderConstants.CONTENT_TYPE]) {
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, '');
  }

  webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, this.apiVersion);
  webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, new Date().toUTCString());
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_HEADER, 'application/atom+xml,application/xml');
  webResource.addOptionalHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');

  webResource.addOptionalHeader(HeaderConstants.HOST_HEADER, this.getHostname() + ':' + this.port);

  if (options) {
    if (options.timeoutIntervalInMs) {
      webResource.addOptionalQueryParam(QueryStringConstants.TIMEOUT, options.timeoutIntervalInMs);
    }

    if (options.accessConditions) {
      webResource.addOptionalAccessContitionHeader(options.accessConditions);
    }

    if (options.sourceAccessConditions) {
      webResource.addOptionalSourceAccessContitionHeader(options.sourceAccessConditions);
    }
  }

  // Sets the request url in the web resource.
  this._setRequestUrl(webResource);

  // Now that the web request is finalized, sign it
  this.authenticationProvider.signRequest(webResource);

  var requestOptions = {
    method: webResource.httpVerb,
    path: webResource.requestUrl,
    host: this.getRequestHost(),
    port: this.getRequestPort(),
    headers: webResource.headers
  };

  return requestOptions;
};

/**
* Retrieves the normalized path to be used in a request.
* This takes into consideration the usePathStyleUri object field
* which specifies if the request is against the emulator or against
* the live service. It also adds a leading "/" to the path in case
* it's not there before.
*
* @param {string} path The path to be normalized.
* @return {string} The normalized path.
*/
ServiceClient.prototype.getPath = function (path) {
  if (path === null || path === undefined) {
    path = '/';
  } else if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  if (this.usePathStyleUri) {
    path = '/' + this.storageAccount + path;
  }

  return path;
};

/*
* Returns the host name to be used on the outgoing request.
* This takes into consideration any proxy settings defined on the object or through
* the environment variables ALL_PROXY, HTTPS_PROXY or HTTP_PROXY.
*
* @return {string} The host name to be used.
*/
ServiceClient.prototype.getRequestHost = function () {
  this._loadEnvironmentProxy();

  if (this.useProxy) {
    return this.proxyUrl;
  }

  return this.getHostname();
};

/*
* Returns the port number to be used on the outgoing request.
* This takes into consideration any proxy settings defined on the object or through
* the environment variables ALL_PROXY, HTTPS_PROXY or HTTP_PROXY.
*
* @return {int} The port number to be used.
*/
ServiceClient.prototype.getRequestPort = function () {
  this._loadEnvironmentProxy();

  if (this.useProxy) {
    return this.proxyPort;
  }

  return this.port;
};

/**
* Retrives the hostname taking into consideration the usePathStyleUri flag which indicates whether the account
* should be a prefix for it or not.
*
* @return {string} The hostname.
*/
ServiceClient.prototype.getHostname = function () {
  if (this.usePathStyleUri) {
    return this.host;
  }

  return this.storageAccount + '.' + this.host;
};

/*
* Returns a parsed host from a full host name.
*
* @param {string} host The full host to be parsed.
* @return {object} THe parsed host as returned by the method "url.parse".
*/
ServiceClient.prototype._parseHost = function (host) {
  var fullHost = host;
  if (fullHost.indexOf(Constants.HTTP) === -1) {
    fullHost = ServiceClient.DEFAULT_PROTOCOL + fullHost;
  }

  var parsedUrl = url.parse(fullHost);
  if (!parsedUrl.port) {
    parsedUrl.port = ServiceClient.DEFAULT_PORT;
  }

  return parsedUrl;
};

/*
* Loads the fields "useProxy" and respective protocol, port and url
* from the environment values ALL_PROXY, HTTPS_PROXY and HTTP_PROXY
* in case those are set.
*
* @return {Void}
*/
ServiceClient.prototype._loadEnvironmentProxy = function() {
  var proxyUrl = null;
  if (process.env[ServiceClient.EnvironmentVariables.ALL_PROXY]) {
    proxyUrl = process.env[ServiceClient.EnvironmentVariables.ALL_PROXY];
  } else if (process.env[ServiceClient.EnvironmentVariables.HTTPS_PROXY]) {
    proxyUrl = process.env[ServiceClient.EnvironmentVariables.HTTPS_PROXY];
  } else if (process.env[ServiceClient.EnvironmentVariables.HTTP_PROXY]) {
    proxyUrl = process.env[ServiceClient.EnvironmentVariables.HTTP_PROXY];
  }

  if (proxyUrl) {
    this.useProxy = true;

    var parsedUrl = url.parse(proxyUrl);
    this.protocol = parsedUrl.protocol + '//';
    this.proxyPort = parsedUrl.port;
    this.proxyUrl = parsedUrl.hostname;
  }
};

/**
* Sets the account credentials taking into consideration the isEmulated value and the environment variables:
* AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
*
* @return {Void}
*/
ServiceClient.prototype._setAccountCredentials = function (storageAccount, storageAccessKey) {
  if (azureutil.isNull(storageAccount)) {
    if (ServiceClient.isEmulated()) {
      storageAccount = ServiceClient.DEVSTORE_STORAGE_ACCOUNT;
    } else {
      storageAccount = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCOUNT];
    }
  }

  if (azureutil.isNull(storageAccessKey)) {
    if (ServiceClient.isEmulated()) {
      storageAccessKey = ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY;
    } else {
      storageAccessKey = process.env[ServiceClient.EnvironmentVariables.AZURE_STORAGE_ACCESS_KEY];
    }
  }

  if (typeof storageAccount !== 'string' || storageAccount.length === 0) {
    throw new Error(ServiceClient.incorrectStorageAccountErr);
  }

  if (typeof storageAccessKey !== 'string' || storageAccessKey.length === 0) {
    throw new Error(ServiceClient.incorrectStorageAccessKeyErr);
  }

  this.storageAccount = storageAccount;
  this.storageAccessKey = storageAccessKey;
};

/*
* Builds a response object with normalized key names.
*
* @param {Bool}     isSuccessful    Boolean value indicating if the request was successful
* @param {Object}   body            The response body.
* @param {Object}   headers         The response headers.
* @param {int}      statusCode      The response status code.
* @param {string}   md5             The response's content md5 hash.
* @return {Object} A response object.
*/
ServiceClient.prototype._buildResponse = function (isSuccessful, body, headers, statusCode, md5) {
  return {
    isSuccessful: isSuccessful,
    statusCode: statusCode,
    body: body,
    headers: headers,
    md5: md5
  };
};

/**
* Parses a server response body from XML into a JS object.
* This is done using the xml2js library.
*
* @param {object} response The response object with a property "body" with a XML string content.
* @return {object} The same response object with the body part as a JS object instead of a XML string.
*/
ServiceClient.prototype._parseResponse = function (response) {
  if (!azureutil.isNull(response.body) && response.body.trim() !== '') {
    var parser = new xml2js.Parser();
    var error = null;
    parser.on('error', function (e) { error = e; });
    parser.parseString(response.body);

    var parsedBody;
    if (parser.resultObject) {
      parsedBody = parser.resultObject;
    } else {
      parsedBody = { parsingError: error };
    }

    if (!azureutil.isNull(parsedBody.parsingError)) {
      response.isSuccessful = false;
      response.parsingError = parsedBody.parsingError;
    } else if (!azureutil.isNull(parsedBody)) {
      response.body = parsedBody;
    } else {
      response.isSuccessful = false;
    }
  }

  return response;
};

/**
* Sets the webResource's requestUrl based on the service client settings.
*
* @param {WebResource} webResource The web resource where to set the request url.
* @return {Void}
*/
ServiceClient.prototype._setRequestUrl = function (webResource) {
  // Normalize the path
  webResource.path = this.getPath(webResource.path);

  // Get the encoded query string
  var queryString = webResource.getQueryString(true);

  // Build the full request url
  webResource.requestUrl = this.protocol + this.getHostname() + ":" + this.port + webResource.path + queryString;
};

/**
* Initializes the default filter.
* This filter is responsible for chaining the pre filters request into the operation and, after processing the response,
* pass it to the post processing filters. This method should only be invoked by the ServiceClient constructor.
*
* @return {Void}
*/
ServiceClient.prototype._initDefaultFilter = function () {
  this.filter = function (requestOptions, nextPreCallback) {
    if (nextPreCallback) {
      // Handle the next pre callback and pass the function to be handled as post call back.
      nextPreCallback(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
        if (nextPostCallback) {
          nextPostCallback(returnObject);
        } else if (finalCallback) {
          finalCallback(returnObject);
        }
      });
    }
  };
};

/**
* Retrieves the metadata headers from the response headers.
*
* @param {object} headers The metadata headers.
* @return {object} An object with the metadata headers (without the "x-ms-" prefix).
*/
ServiceClient.prototype.parseMetadataHeaders = function (headers) {
  var metadata = {};

  if (!headers) {
    return metadata;
  }

  for (var header in headers) {
    if (header.indexOf(HeaderConstants.PREFIX_FOR_STORAGE_METADATA) === 0) {
      var key = header.substr(HeaderConstants.PREFIX_FOR_STORAGE_METADATA.length, header.length - HeaderConstants.PREFIX_FOR_STORAGE_METADATA.length);
      metadata[key] = headers[header];
    }
  }

  return metadata;
};

/**
* Determines if the service client is running on an emulated environment.
* This will be considered to be the case if the used url matches the address for the devstore
* (See DEVSTORE_BLOB_HOST, DEVSTORE_TABLE_HOST and DEVSTORE_QUEUE_HOST) or if the environment variable
* "EMULATED" is set.
*
* @param {string} host The used host.
* @return {bool} True if the service client is running on an emulated environment; false otherwise.
*/
ServiceClient.isEmulated = function (host) {
  if (host === ServiceClient.DEVSTORE_BLOB_HOST ||
      host === ServiceClient.DEVSTORE_TABLE_HOST ||
      host === ServiceClient.DEVSTORE_QUEUE_HOST) {

    return true;
  }

  return process.env[ServiceClient.EnvironmentVariables.EMULATED] ? true : false;
};

// Other functions

/**
* Processes the error body into a normalized error object with all the properties lowercased.
*
* Error information may be returned by a service call with additional debugging information:
* http://msdn.microsoft.com/en-us/library/windowsazure/dd179382.aspx
*
* Table services returns these properties lowercased, example, "code" instead of "Code". So that the user
* can always expect the same format, this method lower cases everything.
*
* @param {Object} error The error object as returned by the service and parsed to JSON by the xml2json.
* @return {Object} The normalized error object with all properties lower cased.
*/
ServiceClient.prototype._normalizeError = function (error) {
  var normalizedError = {};
  for (var property in error) {
    if (property !== '@') {
      if (error[property] && error[property]['#']) {
        normalizedError[property.toLowerCase()] = error[property]['#'];
      } else {
        normalizedError[property.toLowerCase()] = error[property];
      }
    }
  }

  return normalizedError;
};