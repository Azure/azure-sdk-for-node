/*
* @copyright
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

// Module dependencies.
var request = require('request');
var url = require('url');
var util = require('util');
var xml2js = require('xml2js');
var events = require('events');
var _ = require('underscore');

var azureutil = require('../../util/util');

var ServiceSettings = require('./servicesettings');
var Constants = require('../../util/constants');
var ServiceClientConstants = require('./serviceclientconstants');

var HeaderConstants = Constants.HeaderConstants;
var HttpResponseCodes = Constants.HttpConstants.HttpResponseCodes;
var Logger = require('../../diagnostics/logger');

var moduleVersion = require('../../../package.json').version;

/**
* Creates a new ServiceClient object.
* @ignore
* @constructor
* @param {string} host                    The host for the service.
* @param {object} authenticationProvider  The authentication provider object (e.g. sharedkey / sharedkeytable / sharedaccesssignature).
*/
function ServiceClient(host, authenticationProvider) {
  ServiceClient['super_'].call(this);

  this._initDefaultFilter();

  if (host) {
    this.setHost(host);
  } else if (!this.protocol) {
    this.protocol = ServiceSettings.DEFAULT_PROTOCOL;
  }

  this.useProxy = false;
  this.proxyUrl = '';
  this.proxyPort = 80;
  this.proxyProtocol = Constants.HTTP;
  this.authenticationProvider = authenticationProvider;
  this.logger = new Logger(Logger.LogLevels.INFO);

  if (process.env.AZURE_ENABLE_STRICT_SSL !== undefined) {
    this.strictSSL = process.env.AZURE_ENABLE_STRICT_SSL === 'true';
  } else {
    var nodeVersion = azureutil.getNodeVersion();

    if (nodeVersion.major > 0 || nodeVersion.minor > 8 || (nodeVersion.minor === 8 && nodeVersion.patch >= 18)) {
      this.strictSSL = true;
    } else {
      this.strictSSL = false;
    }
  }

  this.xml2jsSettings = _.clone(xml2js.defaults['0.2']);
  this.xml2jsSettings.normalize = false;
  this.xml2jsSettings.trim = false;
  this.xml2jsSettings.attrkey = Constants.XML_METADATA_MARKER;
  this.xml2jsSettings.charkey = Constants.XML_VALUE_MARKER;
  this.xml2jsSettings.explicitArray = false;
}

util.inherits(ServiceClient, events.EventEmitter);

/**
* Sets a host for the service.
* @ignore
* @param {string}     host                              The host for the service.
*/
ServiceClient.prototype.setHost = function (host) {
  var parsedHost = ServiceSettings.parseHost(host);
  this.host = parsedHost.hostname;

  if (parsedHost.port) {
    this.port = parsedHost.port;
  } else if (parsedHost.protocol === Constants.HTTPS) {
    this.port = 443;
  } else {
    this.port = 80;
  }

  if (!this.protocol) {
    this.protocol = parsedHost.protocol;
  }
};

/**
* Performs a REST service request through HTTP expecting an input stream.
* @ignore
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
* @ignore
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
* @ignore
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
* @ignore
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
  var self = this;
  self._buildRequestOptions(webResource, options, function (err, requestOptions) {
    if (err) {
      callback({ error: err, response: null }, function (requestOptions, finalCallback) {
        finalCallback(requestOptions);
      });
    } else {
      self._tagRequest(requestOptions);

      self.logger.log(Logger.LogLevels.DEBUG, 'REQUEST OPTIONS:\n' + util.inspect(requestOptions));

      var operation = function (finalRequestOptions, operationCallback, next) {
        self.logger.log(Logger.LogLevels.DEBUG, 'FINAL REQUEST OPTIONS:\n' + util.inspect(finalRequestOptions));

        var processResponseCallback = function (error, response) {
          var responseObject;

          if (error) {
            responseObject = { error: error, response: null };
          } else {
            responseObject = self._processResponse(webResource, response);
          }

          operationCallback(responseObject, next);
        };

        if (body && body.outputData) {
          finalRequestOptions.body = body.outputData;
        }

        var buildRequest = function (headersOnly) {
          // Build request (if body was set before, request will process immediately, if not it'll wait for the piping to happen)
          var requestStream;
          if (headersOnly) {
            requestStream = request(finalRequestOptions);
            requestStream.on('error', processResponseCallback);
            requestStream.on('response', function (response) {
              response.on('end', function () {
                processResponseCallback(null, response);
              });
            });
          } else {
            requestStream = request(finalRequestOptions, processResponseCallback);
          }

          // Workaround to avoid request from potentially setting unwanted (rejected) headers by the service
          var oldEnd = requestStream.end;
          requestStream.end = function () {
            if (finalRequestOptions.headers['content-length']) {
              requestStream.headers['content-length'] = finalRequestOptions.headers['content-length'];
            } else if (requestStream.headers['content-length']) {
              delete requestStream.headers['content-length'];
            }

            oldEnd.call(requestStream);
          };

          // Bubble events up
          requestStream.on('response', function (response) {
            self.emit('response', response);
          });

          return requestStream;
        };

        // Pipe any input / output streams
        if (body && body.inputStream) {
          buildRequest(true).pipe(body.inputStream);
        } else if (body && body.outputStream) {
          var sendUnchunked = function () {
            var size = finalRequestOptions.headers['content-length'] ?
              finalRequestOptions.headers['content-length'] :
              Constants.BlobConstants.MAX_SINGLE_UPLOAD_BLOB_SIZE_IN_BYTES;

            var concatBuf = new Buffer(size);
            var index = 0;

            body.outputStream.on('data', function (d) {
              d.copy(concatBuf, index, 0, d.length);
              index += d.length;
            }).on('end', function () {
              var requestStream = buildRequest();
              requestStream.write(concatBuf);
              requestStream.end();
            });
          };

          var sendStream = function () {
            // NOTE: workaround for an unexpected EPIPE exception when piping streams larger than 29 MB
            if (finalRequestOptions.headers['content-length'] && finalRequestOptions.headers['content-length'] < 29 * 1024 * 1024) {
              body.outputStream.pipe(buildRequest());
            } else {
              sendUnchunked();
            }
          };

          if (!body.outputStream.readable) {
            // This will wait until we know the readable stream is actually valid before piping
            body.outputStream.on('open', function () {
              sendStream();
            });
          } else {
            sendStream();
          }

          // This catches any errors that happen while creating the readable stream (usually invalid names)
          body.outputStream.on('error', function (error) {
            processResponseCallback(error);
          });
        } else {
          buildRequest();
        }
      };

      // The filter will do what it needs to the requestOptions and will provide a
      // function to be handled after the reply
      self.filter(requestOptions, function (postFiltersRequestOptions, nextPostCallback) {
        // If there is a filter, flow is:
        // filter -> operation -> process response -> next filter
        operation(postFiltersRequestOptions, callback, nextPostCallback);
      });
    }
  });
};

ServiceClient.prototype._tagRequest = function (requestOptions) {
  if (!this.userAgent) {
    this.userAgent = util.format('Azure-SDK-For-Node.js/%s', moduleVersion);
  }

  requestOptions.headers[HeaderConstants.USER_AGENT] = this.userAgent;
};

/**
* Process the response.
* @ignore
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
      this.logger.log(Logger.LogLevels.DEBUG,
          'ERROR code = ' + response.statusCode + ' :\n' + util.inspect(rsp.body));
    }

    var errorBody = rsp.body;
    if (!errorBody) {
      var code = Object.keys(HttpResponseCodes).filter(function (name) {
        if (HttpResponseCodes[name] === rsp.statusCode) {
          return name;
        }
      });

      errorBody = { code: code[0] };
    }

    var normalizedError = this._normalizeError(errorBody);
    responseObject = { error: normalizedError, response: rsp };
  }

  this.logger.log(Logger.LogLevels.DEBUG, 'RESPONSE:\n' + util.inspect(responseObject));

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
  if (azureutil.objectIsNull(newFilter) || !newFilter.handle) {
    throw new Error('Incorrect filter object.');
  }

  // Create a new object with the same members as the current service
  var derived = _.clone(this);

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

/*
* Sets the proxy settings for the request if a proxy is defined.
* @ignore
*
*/
ServiceClient.prototype._setRequestOptionsProxy = function (requestOptions) {
  this._loadEnvironmentProxy();

  if (this.useProxy) {
    requestOptions.proxy = url.format({
      protocol: this.proxyProtocol,
      hostname: this.proxyUrl,
      port: this.proxyPort
    });
  }

  return requestOptions;
};

/*
* Loads the fields "useProxy" and respective protocol, port and url
* from the environment values HTTPS_PROXY and HTTP_PROXY
* in case those are set.
* @ignore
*
* @return {string} or null
*/
ServiceClient.prototype._loadEnvironmentProxyValue = function () {
  var proxyUrl = null;
  if (process.env[ServiceClientConstants.EnvironmentVariables.HTTPS_PROXY]) {
    proxyUrl = process.env[ServiceClientConstants.EnvironmentVariables.HTTPS_PROXY];
  } else if (process.env[ServiceClientConstants.EnvironmentVariables.HTTPS_PROXY.toLowerCase()]) {
    proxyUrl = process.env[ServiceClientConstants.EnvironmentVariables.HTTPS_PROXY.toLowerCase()];
  } else if (process.env[ServiceClientConstants.EnvironmentVariables.HTTP_PROXY]) {
    proxyUrl = process.env[ServiceClientConstants.EnvironmentVariables.HTTP_PROXY];
  } else if (process.env[ServiceClientConstants.EnvironmentVariables.HTTP_PROXY.toLowerCase()]) {
    proxyUrl = process.env[ServiceClientConstants.EnvironmentVariables.HTTP_PROXY.toLowerCase()];
  }

  return proxyUrl;
};

/*
* Loads the fields "useProxy" and respective protocol, port and url
* from the environment values ALL_PROXY, HTTPS_PROXY and HTTP_PROXY
* in case those are set.
* @ignore
*
* @return {undefined}
*/
ServiceClient.prototype._loadEnvironmentProxy = function () {
  var proxyUrl = this._loadEnvironmentProxyValue();

  if (proxyUrl) {
    var parsedUrl = ServiceSettings.parseHost(proxyUrl);

    this.useProxy = true;
    this.proxyProtocol = parsedUrl.protocol;
    this.proxyPort = parsedUrl.port;
    this.proxyUrl = parsedUrl.hostname;
  }
};

/*
* Builds a response object with normalized key names.
* @ignore
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
* @ignore
*
* @param {object} response The response object with a property "body" with a XML string content.
* @return {object} The same response object with the body part as a JS object instead of a XML string.
*/
ServiceClient.prototype._parseResponse = function (response) {
  if (!azureutil.objectIsNull(response.body) && response.body.trim() !== '') {
    var parsedBody = null;

    if (response.headers['content-type'] &&
        response.headers['content-type'].indexOf('application/json') != -1) {

      try {
        parsedBody = JSON.parse(response.body);
      } catch (error) {
        parsedBody = { parsingError: error };
      }
    } else {
      var parser = new xml2js.Parser(this.xml2jsSettings);
      var parseError = null;
      parser.on('error', function (e) { parseError = e; });
      parser.parseString(response.body);

      if (parser.resultObject) {
        parsedBody = parser.resultObject;
      } else {
        // If it failed to parse, try to parse in string format
        if (response.body) {
          response.body = response.body.toLowerCase();

          var codeIndex = response.body.indexOf('code:');
          if (codeIndex !== -1) {
            var resultObject = { };

            var endIndex = response.body.indexOf(':', codeIndex);
            if (endIndex === -1) {
              endIndex = response.body.length - 1;
            }

            var codeMessage = response.body.substr(codeIndex + 5, endIndex - codeIndex - 1);
            resultObject.code = [ codeMessage ];

            var detailIndex = response.body.indexOf('detail:');
            if (detailIndex !== -1) {
              var detailMessage = response.body.substr(detailIndex + 7);
              resultObject.detail = [ detailMessage ];
            }

            parsedBody = { Error: resultObject };
          }
        }

        if (!parsedBody) {
          parsedBody = { parsingError: parseError };
        }
      }
    }

    if (!azureutil.objectIsNull(parsedBody.parsingError)) {
      response.isSuccessful = false;
      response.parsingError = parsedBody.parsingError;
    } else {
      response.body = parsedBody;
    }
  }

  return response;
};

/**
* Sets the webResource's requestUrl based on the service client settings.
* @ignore
*
* @param {WebResource} webResource The web resource where to set the request url.
* @return {undefined}
*/
ServiceClient.prototype._setRequestUrl = function (webResource) {
  // Normalize the path
  webResource.path = this._getPath(webResource.path);

  // Build the full request url
  webResource.requestUrl = url.format({
    protocol: this.protocol,
    hostname: this.host,
    port: this.port,
    pathname: webResource.path,
    query: webResource.queryString
  });
};

/**
* Initializes the default filter.
* This filter is responsible for chaining the pre filters request into the operation and, after processing the response,
* pass it to the post processing filters. This method should only be invoked by the ServiceClient constructor.
* @ignore
*
* @return {undefined}
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
* @ignore
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
* Gets the value of the environment variable for is emulated.
*
* @return {bool} True if the service client is running on an emulated environment; false otherwise.
*/
ServiceClient.isEmulated = function () {
  return (!azureutil.objectIsNull(process.env[ServiceClientConstants.EnvironmentVariables.EMULATED]) &&
    process.env[ServiceClientConstants.EnvironmentVariables.EMULATED] !== 'false');
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
* @ignore
*
* @param {Object} error The error object as returned by the service and parsed to JSON by the xml2json.
* @return {Object} The normalized error object with all properties lower cased.
*/
ServiceClient.prototype._normalizeError = function (error) {
  if (azureutil.objectIsString(error)) {
    return new Error(error);
  } else if (error) {
    var normalizedError = {};

    var errorProperties = error.Error || error.error || error;
    for (var property in errorProperties) {
      if (property !== Constants.XML_METADATA_MARKER) {
        var value = null;
        if (errorProperties[property] && errorProperties[property][Constants.XML_VALUE_MARKER]) {
          value = errorProperties[property][Constants.XML_VALUE_MARKER];
        } else {
          value = errorProperties[property];
        }

        if (this.xml2jsSettings && this.xml2jsSettings.explicitArray) {
          value = value[0];
        }

        normalizedError[property.toLowerCase()] = value;
      }
    }

    var errorMessage = normalizedError.code;
    if (normalizedError.detail) {
      errorMessage += ' - ' + normalizedError.detail;
    }

    var errorObject = new Error(errorMessage);
    _.extend(errorObject, normalizedError);
    return errorObject;
  }

  return null;
};

/**
* Sets the service client proxy.
*
* @param {string} proxyUrl The url that will be used for the proxy.
* @param {string} proxyPort The port that will be used for the proxy.
* @return {undefined}
*/
ServiceClient.prototype.setProxy = function (proxyUrl, proxyPort) {
  this.proxyUrl = proxyUrl;
  this.proxyPort = proxyPort;

  this.useProxy = !azureutil.objectIsNull(this.proxyUrl);
};

/**
* Determines if the current protocol is https.
* @ignore
*
* @return {Bool} True if the protocol is https; false otherwise.
*/
ServiceClient.prototype._isHttps = function () {
  return (this.protocol.toLowerCase() === Constants.HTTPS);
};

module.exports = ServiceClient;