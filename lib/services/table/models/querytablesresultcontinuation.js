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

// Expose 'QueryTablesResultContinuation'.
exports = module.exports = QueryTablesResultContinuation;

/**
* Creates a new QueryTablesResultContinuation object.
*/
function QueryTablesResultContinuation(tableService, nextTableName) {
  if (tableService) {
    this.tableService = tableService;
  }

  if (nextTableName) {
    this.nextTableName = nextTableName;
  }
}

QueryTablesResultContinuation.parse = function (tableService, response) {
  var queryTablesResult = new QueryTablesResultContinuation(tableService);

  if (response.headers[TableConstants.CONTINUATION_NEXT_TABLE_NAME] &&
      !azureutil.objectIsEmpty(response.headers[TableConstants.CONTINUATION_NEXT_TABLE_NAME])) {
    queryTablesResult.nextTableName = response.headers[TableConstants.CONTINUATION_NEXT_TABLE_NAME];
  }

  return queryTablesResult;
};

QueryTablesResultContinuation.prototype.getNextPage = function (callback) {
  if (this.nextTableName) {
    this.tableService.queryTables({ nextTableName: this.nextTableName }, callback);
  } else {
    callback(new Error('No next page.'));
  }
};

QueryTablesResultContinuation.prototype.hasNextPage = function () {
  return (this.nextTableName !== undefined && this.nextTableName !== null);
};