// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// Module dependencies.
var util = require('util');

var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var validate = azureCommon.validate;
var StorageServiceClient = azureCommon.StorageServiceClient;
var BatchServiceClient = require('./batchserviceclient');
var SharedKeyTable = require('./internal/sharedkeytable');
var TableQuery = require('./tablequery');
var WebResource = azureCommon.WebResource;
var Constants = azureCommon.Constants;
var QueryStringConstants = Constants.QueryStringConstants;
var HeaderConstants = Constants.HeaderConstants;
var TableConstants = Constants.TableConstants;

// Models requires
var tableResult = require('./models/tableresult');
var tableQueryResult = require('./models/listresult')(tableResult);
var entityResult = require('./models/entityresult');
var entityQueryResult = require('./models/listresult')(entityResult);
var servicePropertiesResult = require('./models/servicepropertiesresult');
var QueryTablesResultContinuation = require('./models/querytablesresultcontinuation');
var QueryEntitiesResultContinuation = require('./models/queryentitiesresultcontinuation');

/**
* Creates a new TableService object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
* @class
* The TableService object allows you to peform management operations with the Microsoft Azure Table Service.
* The Table Service stores data in rows of key-value pairs. A table is composed of multiple rows, and each row
* contains key-value pairs. There is no schema, so each row in a table may store a different set of keys.
*
* For more information on the Table Service, as well as task focused information on using it from a Node.js application, see
* [How to Use the Table Service from Node.js](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/table-services/).
* @constructor
* @extends {ServiceClient}
*
* @param {string} [storageAccountOrConnectionString]  The storage account or the connection string.
* @param {string} [storageAccessKey]                  The storage access key.
* @param {string} [host]                              The host address.
* @param {object} [authenticationProvider]            The authentication provider.
*/
function TableService(storageAccountOrConnectionString, storageAccessKey, host, authenticationProvider) {
  var storageServiceSettings = StorageServiceClient.getStorageSettings(storageAccountOrConnectionString, storageAccessKey, host);

  TableService['super_'].call(this,
    storageServiceSettings._name,
    storageServiceSettings._key,
    storageServiceSettings._tableEndpointUri,
    storageServiceSettings._usePathStyleUri,
    authenticationProvider);

  if (!this.authenticationProvider) {
    this.authenticationProvider = new SharedKeyTable(this.storageAccount, this.storageAccessKey, this.usePathStyleUri);
  }
}

util.inherits(TableService, BatchServiceClient);

// Module constants.
TableService.incorrectPartitionErr = 'PartitionKey and RowKey must be specified as strings in the entity object';

/**
* Retrieves the entity path from the table name and an entity descriptor.
* @ignore
*
* @param {string}   table         The table name.
* @param {object}   entity        The entity descriptor.
* @return {string} The entity path.
*/
function getEntityPath(tableName, partitionKey, rowKey) {
  var path = '/' + tableName;

  if (typeof(partitionKey) === 'string' && typeof(rowKey) === 'string') {
    path = path + '(PartitionKey=\'' + encodeURIComponent(partitionKey.toString('utf8')) + '\',RowKey=\'' + encodeURIComponent(rowKey.toString('utf8')) + '\')';
  } else {
    throw new Error(TableService.incorrectPartitionErr);
  }

  return path;
}

/**
* Gets the properties of a storage account’s Table service, including Microsoft Azure Storage Analytics.
*
* @this {TableService}
* @param {object}             [options]                        The request options.
* @param {int}                [options.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, servicePropertiesResult, response)}  callback  `error` will contain information
*                                                              if an error occurs; otherwise `servicePropetiesResult` will contain
*                                                              the propeties.
*                                                              `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.getServiceProperties = function (optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getServiceProperties', function (v) {
    v.callback(callback);
  });

  var webResource = WebResource.get()
    .withQueryOption(QueryStringConstants.RESTYPE, 'service')
    .withQueryOption(QueryStringConstants.COMP, 'properties');

  var processResponseCallback = function (responseObject, next) {
    responseObject.servicePropertiesResult = null;
    if (!responseObject.error) {
      responseObject.servicePropertiesResult = servicePropertiesResult.parse(responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.servicePropertiesResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Sets the properties of a storage account’s Table service, including Microsoft Azure Storage Analytics.
* You can also use this operation to set the default request version for all incoming requests that do not have a version specified.
*
* @this {TableService}
* @param {object}             serviceProperties              The service properties.
* @param {object}             [options]                      The request options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, response)}  callback               `error` will contain information
*                                                            if an error occurs; otherwise `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.setServiceProperties = function (serviceProperties, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getServiceProperties', function (v) {
    v.object(serviceProperties, 'serviceProperties');
    v.callback(callback);
  });

  var servicePropertiesXml = servicePropertiesResult.serialize(serviceProperties);

  var webResource = WebResource.put()
    .withQueryOption(QueryStringConstants.COMP, 'properties')
    .withQueryOption(QueryStringConstants.RESTYPE, 'service')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(servicePropertiesXml, 'utf8'))
    .withBody(servicePropertiesXml);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
};

/**
* Gets a table properties.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             [options]                      The get options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, tableResult, response)}  callback  `error` will contain information
*                                                            if an error occurs; otherwise `tableResult` will contain
*                                                            the table information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.getTable = function (table, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('getTable', function (v) {
    v.string(table, 'table');
    v.tableNameIsValid(table);
    v.callback(callback);
  });

  var webResource = WebResource.get('Tables(\'' + table + '\')')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var processResponseCallback = function (responseObject, next) {
    responseObject.tableResponse = null;
    if (!responseObject.error) {
      responseObject.tableResponse = tableResult.parse(responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.tableResponse, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Creates a new table within a storage account.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             [options]                      The create options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, tableResult, response)}  callback  `error` will contain information
*                                                            if an error occurs; otherwise tableResult` will contain
*                                                            the new table information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.createTable = function (table, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('createTable', function (v) {
    v.string(table, 'table');
    v.tableNameIsValid(table);
    v.callback(callback);
  });

  var xmlTableDescriptor = tableResult.serialize(table);

  var webResource = WebResource.post('Tables')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(xmlTableDescriptor, 'utf8'))
    .withBody(xmlTableDescriptor);

  var processResponseCallback = function (responseObject, next) {
    responseObject.tableResponse = null;
    if (!responseObject.error) {
      responseObject.tableResponse = tableResult.parse(responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.tableResponse, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
};

/**
* Creates a new table within a storage account if it doesnt exists.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             [options]                      The create options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, created, response)}  callback      `error` will contain information
*                                                            if an error occurs; otherwise `created` will contain
*                                                            the table information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*
* @example
* var azure = require('azure');
* var tableService = azure.createTableService();
* tableService.createTableIfNotExists('tasktable', function(error) {
*   if(!error) { 
*     // Table created or exists
*   }
* });
*/
TableService.prototype.createTableIfNotExists = function (table, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  this.createTable(table, options, function (error, responseTable, response) {
    if (error && error.code === Constants.TableErrorCodeStrings.TABLE_ALREADY_EXISTS) {
      // If it was created before, there was no actual error.
      error = null;
    }

    callback(error, (responseTable !== null), response);
  });
};

/**
* Deletes a table from a storage account.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             [options]                      The delete options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, successful, response)}  callback   `error` will contain information
*                                                            if an error occurs; otherwise `successful` will be `true` if the operation was successful.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.deleteTable = function (table, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('deleteTable', function (v) {
    v.string(table, 'table');
    v.tableNameIsValid(table);
    v.callback(callback);
  });

  var webResource = WebResource.del('Tables(\'' + table + '\')')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response.isSuccessful, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Enumerates the tables in a storage account.
*
* @this {TableService}
* @param {object}             [options]                                                 The create options or callback function.
* @param {string}             [options.prefix]                                          Prefix of tables to query
* @param {string}             [options.nextTableName]                                   The next table name marker.
* @param {int}                [options.timeoutIntervalInMs]                             The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, queryTablesResult, resultContinuation, response)}  callback   `error` will contain information
*                                                                                        if an error occurs; otherwise `queryTablesResult` will contain
*                                                                                        the list of tables. If more tables exist, and could not be returned,
*                                                                                        `resultContinuation` will contain a continuation token that can be used
*                                                                                        to retrieve the next set of results.
*                                                                                        `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.queryTables = function (optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('queryTables', function (v) {
    v.callback(callback);
  });

  var webResource = WebResource.get('Tables')
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0);

  if (options.prefix) {
    var query = TableQuery.select()
      .where('TableName >= ?', options.prefix)
      .and('TableName < ?', options.prefix + '{');
    webResource.withQueryOption(QueryStringConstants.FILTER, query.toQueryObject().$filter);
  }

  if (options.nextTableName) {
    webResource.withQueryOption(TableConstants.NEXT_TABLE_NAME, options.nextTableName);
  }

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.queryTablesResult = null;
    responseObject.queryTablesResultContinuation = null;

    if (!responseObject.error) {
      responseObject.queryTablesResult = tableQueryResult.parse(responseObject.response);
      responseObject.queryTablesResultContinuation = QueryTablesResultContinuation.parse(self, responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queryTablesResult, returnObject.queryTablesResultContinuation, returnObject.response);
    };

    next(responseObject, finalCallback);
  };
  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Queries an entity in a table.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {string}             partitionKey                   The partition key.
* @param {string}             rowKey                         The row key.
* @param {object}             [options]                      The options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will be the matching entity.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*
* @example
* var azure = require('azure');
* var tableService = azure.createTableService();
* tableService.queryEntity('tasktable', 'tasksSeattle', '1', function(error, serverEntity) {
*   if(!error) {
*     // Entity available in serverEntity variable
*   }
* }); 
*/
TableService.prototype.queryEntity = function (table, partitionKey, rowKey, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('queryEntity', function (v) {
    v.string(table, 'table');
    v.string(partitionKey, 'partitionKey');
    v.string(rowKey, 'rowKey');
    v.tableNameIsValid(table);
    v.callback(callback);
  });

  var tableQuery = TableQuery.select()
    .from(table)
    .whereKeys(partitionKey, rowKey);

  this.queryEntities(tableQuery, options, function (error, tableEntities, tableEntitiesContinuation, response) {
    var tableResult = null;
    if (!error) {
      if (tableEntities && tableEntities.length > 0) {
        tableResult = tableEntities[0];
      }
    }

    callback(error, tableResult, response);
  });
};

/**
* Queries data in a table.
*
* @this {TableService}
* @param {TableQuery}         tableQuery                                    The query to perform.
* @param {object}             [options]                                     The create options.
* @param {int}                [options.timeoutIntervalInMs]                 The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entities, queryResultContinuation, response)} callback    `error` will contain information
*                                                                                        if an error occurs; otherwise `entities` will contain
*                                                                                        the entities returned by the query. If more matching entities exist, and could not be returned,
*                                                                                        `queryResultContinuation` will contain a continuation token that can be used
*                                                                                        to retrieve the next set of results.
*                                                                                        `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.queryEntities = function (tableQuery, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  validate.validateArgs('queryEntities', function (v) {
    v.object(tableQuery, 'tableQuery');
    v.callback(callback);
  });

  var path;
  var queryString = null;
  if (tableQuery._partitionKey && tableQuery._rowKey) {
    path = getEntityPath(tableQuery._from, tableQuery._partitionKey, tableQuery._rowKey);
  } else {
    queryString = tableQuery.toQueryObject();
    path = tableQuery.toPath();
  }

  var webResource = WebResource.get(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0);

  if (queryString) {
    if (queryString[QueryStringConstants.SELECT]) {
      // For requests using the $select query option, the request must be made using version 2011-08-18 or newer.
      // In addition, the DataServiceVersion and MaxDataServiceVersion headers must be set to 2.0
      webResource.withHeader(HeaderConstants.DATA_SERVICE_VERSION, '2.0;NetFx');
      webResource.withHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
    }

    Object.keys(queryString).forEach(function (queryStringName) {
      webResource.withQueryOption(queryStringName, queryString[queryStringName]);
    });
  }

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.queryEntitiesResult = null;
    responseObject.queryEntitiesResultContinuation = null;
    if (!responseObject.error) {
      // Entities
      responseObject.queryEntitiesResult = entityQueryResult.parse(responseObject.response);

      // Continuation iterator
      responseObject.queryEntitiesResultContinuation = QueryEntitiesResultContinuation.parse(self, tableQuery, responseObject.response);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.queryEntitiesResult, returnObject.queryEntitiesResultContinuation, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Inserts a new entity into a table.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object}             [options]                      The options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will contain
*                                                            the new entity information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*
* @example
* var azure = require('azure');
* var tableService = azure.createTableService();
* var task1 = {
*   PartitionKey : 'tasksSeattle',
*   RowKey: '1',
*   Description: 'Take out the trash',
*   DueDate: new Date(2011, 12, 14, 12)
* };
* tableService.insertEntity('tasktable', task1, function(error) {
*   if(!error) {
*     // Entity inserted
*   }
* }); 
*/
TableService.prototype.insertEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('insertEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var entityXmlDescriptor = entityResult.serialize(entityDescriptor);

  var webResource = WebResource.post(table)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'))
    .withBody(entityXmlDescriptor);

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.insertResponse = null;
      if (!responseObject.error) {
        responseObject.insertResponse = entityResult.parse(responseObject.response);
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.insertResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
  }
};

/**
* Inserts or updates a new entity into a table.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             entityDescriptor               The entity descriptor.
* @param {object}             [options]                      The options.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will contain
*                                                            the entity information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.insertOrReplaceEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('insertOrReplaceEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var entityXmlDescriptor = entityResult.serialize(entityDescriptor);

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var webResource = WebResource.put(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'))
    .withBody(entityXmlDescriptor);

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        responseObject.entityResponse = entityResult.parse(responseObject.response);
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
  }
};

/**
* Updates an existing entity within a table by replacing it.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             entityDescriptor               The entity descriptor.
* @param {object}             [options]                      The options.
* @param {boolean}            [options.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will contain
*                                                            the entity information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.updateEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('updateEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = entityResult.serialize(entityDescriptor);

  var webResource = WebResource.put(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'))
    .withHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityResult.getEtag(entityDescriptor) : '*'))
    .withBody(entityXmlDescriptor);

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        responseObject.entityResponse = entityResult.parse(responseObject.response);
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
  }
};

/**
* Updates an existing entity within a table by merging new property values into the entity.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object}             [options]                      The options.
* @param {boolean}            [options.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will contain
*                                                            the entity information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.mergeEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('mergeEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = entityResult.serialize(entityDescriptor);

  var webResource = WebResource.merge(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'))
    .withHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityResult.getEtag(entityDescriptor) : '*'))
    .withBody(entityXmlDescriptor);

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        responseObject.entityResponse = entityResult.parse(responseObject.response);
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
  }
};

/**
* Inserts or updates an existing entity within a table by merging new property values into the entity.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object}             [options]                      The create options or callback function.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, entity, response)}  callback       `error` will contain information
*                                                            if an error occurs; otherwise `entity` will contain
*                                                            the entity information.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.insertOrMergeEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('insertOrMergeEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = entityResult.serialize(entityDescriptor);

  var webResource = WebResource.merge(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'))
    .withBody(entityXmlDescriptor);

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        responseObject.entityResponse = entityResult.parse(responseObject.response);
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, webResource.body, options, processResponseCallback);
  }
};

/**
* Deletes an entity within a table.
*
* @this {TableService}
* @param {string}             table                          The table name.
* @param {object}             entityDescriptor               The entity descriptor.
* @param {object}             [options]                      The options.
* @param {boolean}            [options.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [options.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {Function(error, successful, response)}  callback   `error` will contain information
*                                                            if an error occurs; otherwise `successful` will be 
*                                                            `true` if the operation was successful.
*                                                            `response` will contain information related to this operation.
* @return {undefined}
*/
TableService.prototype.deleteEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options;
  azureutil.normalizeArgs(optionsOrCallback, callback, function (o, c) { options = o; callback = c; });

  var self = this;
  validate.validateArgs('deleteEntity', function (v) {
    v.string(table, 'table');
    v.object(entityDescriptor, 'entityDescriptor');
    v.tableNameIsValid(table);

    if (!self.isInBatch()) {
      v.callback(callback);
    }
  });

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);

  var webResource = WebResource.del(path)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"')
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0)
    .withHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityResult.getEtag(entityDescriptor) : '*'));

  if (this.isInBatch()) {
    this.addOperation(webResource, null, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.response.isSuccessful, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, null, options, processResponseCallback);
  }
};

TableService.prototype._performRequestExtended = function (webResource, rawData, options, callback) {
  if (!webResource.headers || !webResource.headers[HeaderConstants.DATA_SERVICE_VERSION]) {
    webResource.withHeader(HeaderConstants.DATA_SERVICE_VERSION, '1.0;NetFx');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.MAX_DATA_SERVICE_VERSION]) {
    webResource.withHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
  }

  this.performRequest(webResource, rawData, options, callback);
};

module.exports = TableService;