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

// Module dependencies.
var azureutil = require('../../../util/util');

/**
* Creates a new ListQueuesResultContinuation object.
*/
function ListQueuesResultContinuation(queueService, options, nextMarker) {
  if (queueService) {
    this.queueService = queueService;
  }

  if (options) {
    this.options = options;
  }

  if (nextMarker &&
      !azureutil.objectIsEmpty(nextMarker)) {
    this.nextMarker = nextMarker;
  }
}

ListQueuesResultContinuation.prototype.getNextPage = function (callback) {
  if (this.nextMarker) {
    var options = this.options ? this.options : {};
    options.marker = this.nextMarker;
    this.queueService.listQueues(options, callback);
  } else {
    callback(new Error('No next page'));
  }
};

ListQueuesResultContinuation.prototype.hasNextPage = function () {
  return (this.nextMarker !== undefined && this.nextMarker !== null);
};

module.exports = ListQueuesResultContinuation;