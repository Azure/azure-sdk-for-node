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
var _ = require('underscore');
var azureutil = require('../../util/util');
var edmType = require('../../util/edmtype');

var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;

/**
 * Creates a new TableQuery object.
 *
 * @constructor
 */
function TableQuery() {
  this._fields = null;
  this._from = '';
  this._where = [];
  this._top = null;
  this._partitionKey = null;
  this._nextPartitionKey = null;
  this._rowKey = null;
  this._nextRowKey = null;
}

/**
* Constructs a TableQuery specifying the select clause.
*
* @param {array} fields The fields to be selected.
* @return {TableQuery} A table query object with the select clause.
*/
TableQuery.select = function () {
  var tableQuery = new TableQuery();

  if (arguments) {
    tableQuery._fields = [];
    _.each(arguments, function (argument) {
      tableQuery._fields.push(argument);
    });
  }

  return tableQuery;
};

/**
 * Specifies the from clause.
 *
 * @param {string} name The table from where to select the entitites from.
 * @return {TableQuery} A table query object with the from clause.
 */
TableQuery.prototype.from = function (name) {
  this._from = name;
  return this;
};

/**
 * Specifies the partition and row keys.
 *
 * @param {string} partitionKey The partition key for the entities to query.
 * @param {string} rowKey       The row key for the entities to query.
 * @return {TableQuery} A table query object with the where clause.
 */
TableQuery.prototype.whereKeys = function (partitionKey, rowKey) {
  this._partitionKey = partitionKey;
  this._rowKey = rowKey;
  return this;
};

/**
 * Specifies the next keys.
 *
 * @param {string} nextPartitionKey The next partition key for the entities to start querying from.
 * @param {string} nextRowKey       The next row key for the entities to start querying from.
 * @return {TableQuery} A table query object with the where clause.
 */
TableQuery.prototype.whereNextKeys = function (nextPartitionKey, nextRowKey) {
  this._nextPartitionKey = nextPartitionKey;
  this._nextRowKey = nextRowKey;
  return this;
};

/**
 * Specifies the where clause.
 *
 * @param {string}       condition   The condition string.
 * @param {string|array} value       Value(s) to insert in question mark (?) parameters.
 * @return {TableQuery} A table query object with the where clause.
 */
TableQuery.prototype.where = function (condition) {
  condition = this._replaceOperators(condition);
  if (arguments.length > 1) {
    var quotedArguments = [arguments[0]];
    for (var i = 1; i < arguments.length; i++) {
      quotedArguments.push(edmType.serializeQueryValue(arguments[i]));
    }

    condition = azureutil.stringFormat.apply(this, quotedArguments);
  }

  this._where.push(condition);
  return this;
};

/**
 * Specifies an AND where condition.
 *
 * @param {string}       condition   The condition string.
 * @param {array}        arguments   Any number of arguments to be replaced in the condition by the question mark (?).
 * @return {TableQuery} A table query object with the and clause.
 */
TableQuery.prototype.and = function (condition) {
  if (this._where.length === 0) {
    throw new Error('And operator needs to be used after where');
  }

  condition = this._replaceOperators(condition);
  if (arguments.length > 1) {
    var quotedArguments = [arguments[0]];
    for (var i = 1; i < arguments.length; i++) {
      quotedArguments.push(edmType.serializeQueryValue(arguments[i]));
    }

    condition = azureutil.stringFormat.apply(this, quotedArguments);
  }

  this._where.push(' and ' + condition);
  return this;
};

/**
 * Specifies an OR where condition.
 *
 * @param {string}       condition   The condition.
 * @param {array}        arguments   Any number of arguments to be replaced in the condition by the question mark (?).
 * @return {TableQuery} A table query object with the or clause.
 */
TableQuery.prototype.or = function (condition) {
  if (this._where.length === 0) {
    throw new Error('Or operator needs to be used after where');
  }

  condition = this._replaceOperators(condition);
  if (arguments.length > 1) {
    var quotedArguments = [arguments[0]];
    for (var i = 1; i < arguments.length; i++) {
      quotedArguments.push(edmType.serializeQueryValue(arguments[i]));
    }

    condition = azureutil.stringFormat.apply(this, quotedArguments);
  }

  var binaryOperation = ' or ';

  this._where.push(binaryOperation + condition);
  return this;
};

/**
 * Specifies the top clause.
 *
 * @param {int} top The number of items to fetch.
 * @return {TableQuery} A table query object with the top clause.
 */
TableQuery.prototype.top = function (top) {
  this._top = top;
  return this;
};

/**
 * Returns the query string object for the query.
 *
 * @return {object} JSON object representing the query string arguments for the query.
 */
TableQuery.prototype.toQueryObject = function () {
  var query = {};
  if (this._fields && this._fields.length > 0) {
    for (var field in this._fields) {
      if (this._fields.hasOwnProperty(field)) {
        this._fields[field] = this._fields[field];
      }
    }

    query[QueryStringConstants.SELECT] = this._fields.join(',');
  }

  if (this._where.length > 0 ||
     (this._partitionKey && !this._rowKey)) {

    var filter = this._where.join('');
    if (this._partitionKey && !this._rowKey) {
      if (this._where.length > 0) {
        filter += ' and ';
      }

      filter += 'PartitionKey eq \'' + this._partitionKey + '\'';
    }

    query[QueryStringConstants.FILTER] = filter;
  }

  if (this._top) {
    query[QueryStringConstants.TOP] = this._top;
  }

  if (this._nextPartitionKey) {
    query[QueryStringConstants.NEXT_PARTITION_KEY] = this._nextPartitionKey;
  }

  if (this._nextRowKey) {
    query[QueryStringConstants.NEXT_ROW_KEY] = this._nextRowKey;
  }

  return query;
};

/**
* Returns the URL path.
*
* @return {string} The path string.
*/
TableQuery.prototype.toPath = function () {
  var path = '';

  if (this._partitionKey && this._rowKey) {
    path += 'PartitionKey=\'' + this._partitionKey + '\'';
    path += ', RowKey=\'' + this._rowKey + '\'';
  }

  return (this._from + '(' + path + ')');
};

// Functions

/**
 * Replace operators.
 *
 * @param {string} whereClause The text where to replace the operators.
 * @return {string} The string with the replaced operators.
 */
TableQuery.prototype._replaceOperators = function (whereClause) {
  whereClause = whereClause.replace(/ == /g, ' eq ');
  whereClause = whereClause.replace(/ != /g, ' ne ');
  whereClause = whereClause.replace(/ >= /g, ' ge ');
  whereClause = whereClause.replace(/ > /g, ' gt ');
  whereClause = whereClause.replace(/ <= /g, ' le ');
  whereClause = whereClause.replace(/ < /g, ' lt ');
  whereClause = whereClause.replace(/ \&\& /g, ' and ');
  whereClause = whereClause.replace(/ \|\| /g, ' or ');
  whereClause = whereClause.replace(/!/g, 'not');

  return whereClause;
};

module.exports = TableQuery;