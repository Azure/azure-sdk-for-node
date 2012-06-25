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

var Constants = require('../../../util/constants');
var TableConstants = Constants.TableConstants;

// Expose 'QueryEntitiesResultContinuation'.
exports = module.exports = QueryEntitiesResultContinuation;

function QueryEntitiesResultContinuation(tableService, tableQuery, nextPartitionKey, nextRowKey) {
  if (tableService) {
    this.tableService = tableService;
  }

  if (tableQuery) {
    this.tableQuery = tableQuery;
  }

  if (nextPartitionKey) {
    this.nextPartitionKey = nextPartitionKey;
  }

  if (nextRowKey) {
    this.nextRowKey = nextRowKey;
  }
}

QueryEntitiesResultContinuation.parse = function (tableService, tableQuery, response) {
  var queryEntitiesResultContinuation = new QueryEntitiesResultContinuation(tableService, tableQuery);

  if (response.headers[TableConstants.CONTINUATION_NEXT_PARTITION] &&
      !azureutil.objectIsEmpty(response.headers[TableConstants.CONTINUATION_NEXT_PARTITION])) {
    queryEntitiesResultContinuation.nextPartitionKey = response.headers[TableConstants.CONTINUATION_NEXT_PARTITION];
  }

  if (response.headers[TableConstants.CONTINUATION_NEXT_ROW_KEY] &&
      !azureutil.objectIsEmpty(response.headers[TableConstants.CONTINUATION_NEXT_ROW_KEY])) {
    queryEntitiesResultContinuation.nextRowKey = response.headers[TableConstants.CONTINUATION_NEXT_ROW_KEY];
  }

  return queryEntitiesResultContinuation;
};

QueryEntitiesResultContinuation.prototype.getNextPage = function (callback) {
  if (!azureutil.objectIsNull(this.nextPartitionKey)) {
    var nextTableQuery = this.tableQuery
      .whereNextKeys(this.nextPartitionKey, this.nextRowKey);

    this.tableService.queryEntities(nextTableQuery, callback);
  } else {
    callback(new Error('No next page'));
  }
};

QueryEntitiesResultContinuation.prototype.hasNextPage = function () {
  return !azureutil.objectIsNull(this.nextPartitionKey);
};