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

var fs = require('fs');
var azure;
try {
  fs.existsSync('./../../../lib/azure.js');
  azure = require('./../../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var uuid = require('uuid');
var _ = require('lodash');
var entityGenerator = azure.TableUtilities.entityGenerator;
// Table service 'constants'
var TABLE_NAME = 'pushpins';
var DEFAULT_PARTITION = 'pushpins';

// Blob service 'constants'
var CONTAINER_NAME = 'pushpins';

// Expose 'PushpinService'.
exports = module.exports = PushpinService;

function PushpinService(storageAccount, storageAccessKey) {
  this.tableClient = azure.createTableService(storageAccount, storageAccessKey);
  this.blobClient = azure.createBlobService(storageAccount, storageAccessKey);
}

PushpinService.prototype.initialize = function (callback) {

  var self = this;

  var createContainer = function () {
    // the pushpins blog urls should
    // be accessible for anonymous access
    var accessLevel = {
      publicAccessLevel: azure.Constants.BlobConstants.BlobContainerPublicAccessType.BLOB
    };
    // create blob container if it doesn't exist
    self.blobClient.createContainerIfNotExists(CONTAINER_NAME, accessLevel, function (error, result, response) {
      if (error) {
        callback(error);
      } else {
        callback();
      }
    });
  };

  // create table if it doesn't exist
  self.tableClient.createTableIfNotExists(TABLE_NAME, function (error, result, response) {
    if (error) {
      callback(error);
    } else {
      createContainer();
    }
  });
};

PushpinService.prototype.createPushpin = function (pushpinData, pushpinImage, callback) {
  var self = this;
  var rowKey = uuid.v4();
  function insertEntity(error, blob) {
    var entity = {
      PartitionKey: entityGenerator.String(DEFAULT_PARTITION),
      RowKey: entityGenerator.String(rowKey),
      title: entityGenerator.String(pushpinData.title),
      description: entityGenerator.String(pushpinData.description),
      latitude: entityGenerator.String(pushpinData.latitude),
      longitude: entityGenerator.String(pushpinData.longitude)
    };


    if (blob) {
      entity.imageUrl = entityGenerator.String(self.blobClient.getUrl(blob.container, blob.blob));
    }

    self.tableClient.insertEntity(TABLE_NAME, entity, callback);
  }
  // support only 'image/*' type as
  // hinted in upload file input
  if (pushpinImage &&
    pushpinImage.mimetype &&
    pushpinImage.mimetype.indexOf('image/') === 0) {
    var options = {
      metadata: {
        filename: pushpinImage.originalname
      },
      contentType: pushpinImage.mimetype
    };
    self.blobClient.createBlockBlobFromLocalFile(CONTAINER_NAME, rowKey, pushpinImage.path, options, insertEntity);
  } else {
    insertEntity();
  }
};

PushpinService.prototype.listPushpins = function (callback) {
  var self = this;
  var tableQuery = new azure.TableQuery()
    .select();
  self.tableClient.queryEntities(TABLE_NAME, tableQuery, null, callback);
};

PushpinService.prototype.removePushpin = function (pushpin, callback) {
  var self = this;
  var tableQuery = new azure.TableQuery()
    .select()
    .where('latitude == ? && longitude == ?', pushpin.latitude, pushpin.longitude);

  self.tableClient.queryEntities(TABLE_NAME, tableQuery, null, function (error, pushpins) {
    if (error) {
      callback(error);
    } else if (pushpins && pushpins.entries.length > 0) {
      var pushpin = pushpins.entries[0];
      var entity = {
        PartitionKey: { '_': pushpin.PartitionKey._ },
        RowKey: { '_': pushpin.RowKey._ }
      };
      self.tableClient.deleteEntity(TABLE_NAME, entity, callback);
    } else {
      callback();
    }
  });
};

PushpinService.prototype.clearPushpins = function (callback) {
  var self = this;
  var deleteEntities = function (entities) {
    if (entities && entities.entries.length > 0) {
      var currentEntity = entities.entries.pop();
      var entity = {
        PartitionKey: { '_': currentEntity.PartitionKey._ },
        RowKey: { '_': currentEntity.RowKey._ }
      };
      self.tableClient.deleteEntity(TABLE_NAME, entity, function (error) {
        if (error) {
          callback(error);
        } else if (currentEntity.imageUrl) {
          self.blobClient.deleteBlob(CONTAINER_NAME, currentEntity.RowKey._, function (deleteBlobError) {
            if (deleteBlobError) {
              callback(deleteBlobError);
            } else {
              deleteEntities(entities);
            }
          });
        } else {
          deleteEntities(entities);
        }
      });
    } else {
      callback();
    }
  };

  self.listPushpins(function (error, entities) {
    if (error) {
      callback(error);
    } else {
      deleteEntities(entities);
    }
  });
};

/**
 * Convert TableStorage entity into 
 * plain pushpin objects
 */
PushpinService.prototype.unwrapEntities = function (entities) {
  var updated = [];
  entities = entities || [];
  _(entities).forEach(function (entity) {
    updated.push(_.mapValues(entity, function (value, key, object) {
      if (_.has(value, '_')) return value._;
      return value;
    }));
  });
  return updated;
};
