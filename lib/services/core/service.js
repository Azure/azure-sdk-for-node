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

var requestPipeline = require('../../http/request-pipeline');
var ErrorHandlingFilter = require('../core/filters/errorhandlingfilter');
var UserAgentFilter = require('../core/filters/useragentfilter');

function Service(filters) {
  if (!filters) {
    filters = [];
  }

  filters.push(UserAgentFilter.create());
  filters.push(ErrorHandlingFilter.create());

  this.pipeline = requestPipeline.create.apply(requestPipeline, filters);
}

/**
* Associate a filtering operation with this ServiceClient. Filtering operations
* can include logging, automatically retrying, etc. Filter operations are functions
* the signature:
*
*     "function (requestOptions, next, callback)".
*
* After doing its preprocessing on the request options, the method needs to call
* "next" passing the current options and a callback with the following signature:
*
*     "function (error, result, response, body)"
*
* In this callback, and after processing the result or response, the callback needs
* invoke the original passed in callback to continue processing other filters and
* finish up the service invocation.
*
* @param {function (requestOptins, next, callback)} filter The new filter object.
* @return {QueueService} A new service client with the filter applied.
*/
Service.prototype.withFilter = function (newFilter) {
  if (!newFilter) {
    throw new Error('No filter passed');
  }
  if (!(newFilter instanceof Function && newFilter.length === 3)) {
    throw new Error('newFilter must be a function taking three parameters');
  }

  this.pipeline = requestPipeline.createWithSink(this.pipeline, newFilter);
  return this;
};

module.exports = Service;