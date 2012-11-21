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
var util = require('util');
var url = require('url');
var xmlbuilder = require('xmlbuilder');

var azureutil = require('../../util/util');

var StorageServiceClient = require('../core/storageserviceclient');
var BatchServiceClient = require('./batchserviceclient');
var SharedKeyTable = require('./sharedkeytable');
var TableQuery = require('./tablequery');
var AtomHandler = require('../../util/atomhandler');
var ServiceClient = require('../core/serviceclient');
var WebResource = require('../../http/webresource');
var Constants = require('../../util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HeaderConstants = Constants.HeaderConstants;
var TableConstants = Constants.TableConstants;
var HttpConstants = Constants.HttpConstants;

// Models requires
var TableResult = require('./models/tableresult');
var EntityResult = require('./models/entityresult');
var ServicePropertiesResult = require('./models/servicepropertiesresult');
var QueryTablesResultContinuation = require('./models/querytablesresultcontinuation');
var QueryEntitiesResultContinuation = require('./models/queryentitiesresultcontinuation');

// Expose 'TableService'.
exports = module.exports = TableService;

// Module constants.
TableService.incorrectTableNameErr = 'Table name must be a non empty string.';
TableService.incorrectCallbackErr = 'Callback must be specified.';
TableService.incorrectTableQuery = 'Incorrect table query.';
TableService.incorrectPartitionErr = 'PartitionKey and RowKey must be specified as strings in the entity object';

/**
* Creates a new TableService object.
* If no storageaccount or storageaccesskey are provided, the AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables will be used.
*
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

  TableService.super_.call(this,
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

/**
* Gets the properties of a storage account’s Table service, including Windows Azure Storage Analytics.
*
* @this {BlobService}
* @param {object|function}    [optionsOrCallback]                        The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]    The timeout interval, in milliseconds, to use for the request.
* @param {function(error, servicePropertiesResult, response)}  callback  The callback function.
* @return {undefined}
*/
TableService.prototype.getServiceProperties = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get();
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');

  var processResponseCallback = function (responseObject, next) {
    responseObject.servicePropertiesResult = null;
    if (!responseObject.error) {
      responseObject.servicePropertiesResult = ServicePropertiesResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.servicePropertiesResult, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, null, options, processResponseCallback);
};

/**
* Sets the properties of a storage account’s Table service, including Windows Azure Storage Analytics.
* You can also use this operation to set the default request version for all incoming requests that do not have a version specified.
*
* @this {BlobService}
* @param {object}             serviceProperties                        The service properties.
* @param {object|function}    [optionsOrCallback]                      The request options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, response)}  callback                         The callback function.
* @return {undefined}
*/
TableService.prototype.setServiceProperties = function (serviceProperties, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var servicePropertiesXml = ServicePropertiesResult.serialize(serviceProperties);

  var webResource = WebResource.put().withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE);
  webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
  webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(servicePropertiesXml, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, servicePropertiesXml, options, processResponseCallback);
};

/**
* Gets a table properties.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object|function}    [optionsOrCallback]                      The get options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, tableResult, response)}  callback            The callback function.
* @return {undefined}
*/
TableService.prototype.getTable = function (table, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  validateCallback(callback);

  var webResource = WebResource.get("Tables('" + table + "')");
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var processResponseCallback = function (responseObject, next) {
    responseObject.tableResponse = null;
    if (!responseObject.error) {
      responseObject.tableResponse = TableResult.parse(responseObject.response.body);
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
* @param {string}             table                                    The table name.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, tableResult, response)}  callback            The callback function.
* @return {undefined}
*/
TableService.prototype.createTable = function (table, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  validateCallback(callback);

  var xmlTableDescriptor = TableResult.serialize(table);

  var webResource = WebResource.post('Tables');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(xmlTableDescriptor, 'utf8'));

  var processResponseCallback = function (responseObject, next) {
    responseObject.tableResponse = null;
    if (!responseObject.error) {
      responseObject.tableResponse = TableResult.parse(responseObject.response.body);
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.tableResponse, returnObject.response);
    };

    next(responseObject, finalCallback);
  };

  this._performRequestExtended(webResource, xmlTableDescriptor, options, processResponseCallback);
};

/**
* Creates a new table within a storage account if it doesnt exists.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, created, response)}  callback                The callback function.
* @return {undefined}
*/
TableService.prototype.createTableIfNotExists = function (table, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

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
* @param {string}             table                                    The table name.
* @param {object|function}    [optionsOrCallback]                      The delete options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, successful, response)}  callback             The callback function.
* @return {undefined}
*/
TableService.prototype.deleteTable = function (table, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  validateCallback(callback);

  var webResource = WebResource.del("Tables('" + table + "')");
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);

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
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {string}             [optionsOrCallback.nextTableName]        The next table name marker.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queryTablesResult, response)}  callback      The callback function.
* @return {undefined}
*/
TableService.prototype.queryTables = function (optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateCallback(callback);

  var webResource = WebResource.get('Tables');

  if (options && options.nextTableName) {
    webResource.addOptionalQueryParam(TableConstants.NEXT_TABLE_NAME, options.nextTableName);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.queryTablesResult = null;
    responseObject.queryTablesResultContinuation = null;

    if (!responseObject.error) {
      responseObject.queryTablesResult = [];

      var tables = [];
      if (responseObject.response.body.entry) {
        tables = responseObject.response.body.entry;

        if (!Array.isArray(tables)) {
          tables = [tables];
        }
      }

      tables.forEach(function (currentTable) {
        var parsedCurrentTable = TableResult.parse(currentTable);
        responseObject.queryTablesResult.push(parsedCurrentTable);
      });

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
* @param {string}             table                                    The table name.
* @param {string}             partitionKey                             The partition key.
* @param {string}             rowKey                                   The row key.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, successful, response)}  callback             The callback function.
* @return {undefined}
*/
TableService.prototype.queryEntity = function (table, partitionKey, rowKey, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  validateCallback(callback);

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
* @param {TableQuery}         tableQuery                                              The query to perform.
* @param {object|function}    [optionsOrCallback]                                     The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]                 The timeout interval, in milliseconds, to use for the request.
* @param {function(error, queryEntitiesResult, response)} callback                    The callback function.
* @return {undefined}
*/
TableService.prototype.queryEntities = function (tableQuery, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableQuery(tableQuery);
  validateCallback(callback);

  var path;
  var queryString = null;
  if (tableQuery._partitionKey && tableQuery._rowKey) {
    path = getEntityPath(tableQuery._from, tableQuery._partitionKey, tableQuery._rowKey);
  } else {
    queryString = tableQuery.toQueryObject();
    path = tableQuery.toPath();
  }

  var webResource = WebResource.get(path);

  if (queryString && queryString[QueryStringConstants.SELECT]) {
    // For requests using the $select query option, the request must be made using version 2011-08-18 or newer.
    // In addition, the DataServiceVersion and MaxDataServiceVersion headers must be set to 2.0
    webResource.addOptionalHeader(HeaderConstants.DATA_SERVICE_VERSION, '2.0;NetFx');
    webResource.addOptionalHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
  }

  for (var queryStringName in queryString) {
    webResource.addOptionalQueryParam(queryStringName, queryString[queryStringName]);
  }

  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);

  var self = this;
  var processResponseCallback = function (responseObject, next) {
    responseObject.queryEntitiesResult = null;
    responseObject.queryEntitiesResultContinuation = null;
    if (!responseObject.error) {
      // Entities
      responseObject.queryEntitiesResult = [];

      var entries = [];
      if (responseObject.response.body.entry) {
        entries = responseObject.response.body.entry;
        if (!Array.isArray(entries)) {
          entries = [entries];
        }
      } else if (responseObject.response.body.content && responseObject.response.body.content['m:properties']) {
        entries = [responseObject.response.body];
      }

      entries.forEach(function (currentEntry) {
        var tableEntry = EntityResult.parse(currentEntry);
        responseObject.queryEntitiesResult.push(tableEntry);
      });

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
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.insertEntity = function (tableName, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(tableName);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var entityXmlDescriptor = EntityResult.serialize(entityDescriptor);

  var webResource = WebResource.post(tableName);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'));

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.insertResponse = null;
      if (!responseObject.error) {
        responseObject.insertResponse = EntityResult.parse(responseObject.response.body);
        responseObject.insertResponse.etag = responseObject.response.headers[HeaderConstants.ETAG.toLowerCase()];
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.insertResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, entityXmlDescriptor, options, processResponseCallback);
  }
};

/**
* Inserts or updates a new entity into a table.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.insertOrReplaceEntity = function (tableName, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(tableName);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var entityXmlDescriptor = EntityResult.serialize(entityDescriptor);

  var path = getEntityPath(tableName, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var webResource = WebResource.put(path)
    .withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'));

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.insertResponse = null;
      if (!responseObject.error) {
        responseObject.insertResponse = EntityResult.parse(responseObject.response.body);
        responseObject.insertResponse.etag = responseObject.response.headers[HeaderConstants.ETAG.toLowerCase()];
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.insertResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, entityXmlDescriptor, options, processResponseCallback);
  }
};

/**
* Updates an existing entity within a table by replacing it.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {boolean}            [optionsOrCallback.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.updateEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = EntityResult.serialize(entityDescriptor);

  var webResource = WebResource.put(path).withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'));
  webResource.addOptionalHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityDescriptor.etag : '*'));

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        entityDescriptor.etag = responseObject.response.headers[HeaderConstants.ETAG.toLowerCase()];
        responseObject.entityResponse = entityDescriptor;
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, entityXmlDescriptor, options, processResponseCallback);
  }
};

/**
* Updates an existing entity within a table by merging new property values into the entity.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {boolean}            [optionsOrCallback.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.mergeEntity = function (tableName, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(tableName);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var path = getEntityPath(tableName, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = EntityResult.serialize(entityDescriptor);

  var webResource = WebResource.merge(path).withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'));
  webResource.addOptionalHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityDescriptor.etag : '*'));

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        entityDescriptor.etag = responseObject.response.headers[HeaderConstants.ETAG.toLowerCase()];
        responseObject.entityResponse = entityDescriptor;
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, entityXmlDescriptor, options, processResponseCallback);
  }
};

/**
* Inserts or updates an existing entity within a table by merging new property values into the entity.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.insertOrMergeEntity = function (tableName, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(tableName);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var path = getEntityPath(tableName, entityDescriptor.PartitionKey, entityDescriptor.RowKey);
  var entityXmlDescriptor = EntityResult.serialize(entityDescriptor);

  var webResource = WebResource.merge(path).withOkCode(HttpConstants.HttpResponseCodes.NO_CONTENT_CODE);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(entityXmlDescriptor, 'utf8'));

  if (this.isInBatch()) {
    this.addOperation(webResource, entityXmlDescriptor, options);
    if (callback !== undefined && callback !== null) {
      callback(null, null, { statusCode: BatchServiceClient.BATCH_CODE, isSuccessful: true });
    }
  } else {
    var processResponseCallback = function (responseObject, next) {
      responseObject.entityResponse = null;
      if (!responseObject.error) {
        entityDescriptor.etag = responseObject.response.headers[HeaderConstants.ETAG.toLowerCase()];
        responseObject.entityResponse = entityDescriptor;
      }

      var finalCallback = function (returnObject) {
        callback(returnObject.error, returnObject.entityResponse, returnObject.response);
      };

      next(responseObject, finalCallback);
    };

    this._performRequestExtended(webResource, entityXmlDescriptor, options, processResponseCallback);
  }
};

/**
* Deletes an entity within a table.
*
* @this {TableService}
* @param {string}             table                                    The table name.
* @param {object}             entityDescriptor                         The entity descriptor.
* @param {object|function}    [optionsOrCallback]                      The create options or callback function.
* @param {boolean}            [optionsOrCallback.checkEtag]            Boolean value indicating weather the etag should be matched or not.
* @param {int}                [optionsOrCallback.timeoutIntervalInMs]  The timeout interval, in milliseconds, to use for the request.
* @param {function(error, entity, response)}  callback                 The callback function.
* @return {undefined}
*/
TableService.prototype.deleteEntity = function (table, entityDescriptor, optionsOrCallback, callback) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  validateTableName(table);
  if (!this.isInBatch()) {
    validateCallback(callback);
  }

  var path = getEntityPath(table, entityDescriptor.PartitionKey, entityDescriptor.RowKey);

  var webResource = WebResource.del(path);
  webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');
  webResource.addOptionalHeader(HeaderConstants.CONTENT_LENGTH, 0);
  webResource.addOptionalHeader(HeaderConstants.IF_MATCH, (options && options.checkEtag === true ? entityDescriptor.etag : '*'));

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
    webResource.addOptionalHeader(HeaderConstants.DATA_SERVICE_VERSION, '1.0;NetFx');
  }

  if (!webResource.headers || !webResource.headers[HeaderConstants.MAX_DATA_SERVICE_VERSION]) {
    webResource.addOptionalHeader(HeaderConstants.MAX_DATA_SERVICE_VERSION, '2.0;NetFx');
  }

  this.performRequest(webResource, rawData, options, callback);
};

/**
* Retrieves the entity path from the table name and an entity descriptor.
*
* @param {string}   table         The table name.
* @param {object}   entity        The entity descriptor.
* @return {string} The entity path.
*/
function getEntityPath(tableName, partitionKey, rowKey) {
  var path = '/' + tableName;

  if (typeof(partitionKey) === 'string' && typeof(rowKey) === 'string') {
    path = path + "(PartitionKey='" + partitionKey + "',RowKey='" + rowKey + "')";
  } else {
    throw new Error(TableService.incorrectPartitionErr);
  }

  return path;
}

/**
* Validates a table name.
*
* @param {string} table  The table name.
* @return {undefined}
*/
function validateTableName(table) {
  if (!azureutil.objectIsString(table) || azureutil.stringIsEmpty(table)) {
    throw new Error(TableService.incorrectTableNameErr);
  }
}

/**
* Validates a callback function.
*
* @param {string} callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error(TableService.incorrectCallbackErr);
  }
}

/**
* Validates the tableQuery.
*
* @param {string} tableQuery The table query.
* @return {undefined}
*/
function validateTableQuery(tableQuery) {
  if (!tableQuery) {
    throw new Error(TableService.incorrectTableQuery);
  }
}