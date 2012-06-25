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

var path = require('path');
var uuid = require('node-uuid');
var util = require('util');
var nconf = require('nconf');
var _ = require('underscore');

var azure = require('azure');

// Table service 'constants'
var TABLE_NAME = 'roles';
var DEFAULT_PARTITION = 'roles';

// Blob service 'constants'
var CONTAINER_NAME = 'roles';

var initialized = false;

nconf.file({ file: 'config.json' });

var tableClient = azure.createTableService(nconf.get('AZURE_STORAGE_ACCOUNT'), nconf.get('AZURE_STORAGE_ACCESS_KEY'));
var blobClient = azure.createBlobService(nconf.get('AZURE_STORAGE_ACCOUNT'), nconf.get('AZURE_STORAGE_ACCESS_KEY'));

if (!process.env['WaRuntimeEndpoint']) {
  process.env['WaRuntimeEndpoint'] = nconf.get('WaRuntimeEndpoint');
}

function initialize (callback) {
  var self = this;

  var createContainer = function () {
    // create blob container if it doesnt exist
    blobClient.createContainerIfNotExists(CONTAINER_NAME, function (createContainerError, created) {
      if (createContainerError) {
        callback(createContainerError);
      } else if (created) {
        blobClient.setContainerAcl(CONTAINER_NAME,
          azure.Constants.BlobConstants.BlobContainerPublicAccessType.BLOB,
          callback);
      } else {
        callback();
      }
    });
  };

  // create table if it doesnt exist
  tableClient.createTableIfNotExists(TABLE_NAME, function (createTableError) {
    if (createTableError) {
      callback(createTableError);
    } else {
      createContainer();
    }
  });
};

exports.getRoles = function (callback) {
  azure.RoleEnvironment.getRoles(function (error, roles) {
    if (error) {
      callback(error);
    } else {
      exports._getRolesData(function (errorData, rolesData) {
        if (errorData) {
          callback(errorData);
        } else {
          for (var currentRole in rolesData) {
            var currentRoleData = rolesData[currentRole];
            if (roles[currentRoleData.name]) {
              roles[currentRoleData.name] = _.extend(roles[currentRoleData.name], currentRoleData);
            }
          }

          callback(undefined, roles);
        }
      });
    }
  });
};

exports.getRole = function (roleName, callback) {
  azure.RoleEnvironment.getRoles(function (error, roles) {
    if (!roles[roleName]) {
      callback('wrong role');
    } else {
      var role = roles[roleName];

      exports._getRoleData(roleName, function (error2, roleData) {
        if (error2) {
          callback(error2);
        } else {
          if (roleData) {
            roleData.instances = role.instances;
            role = roleData;
          }

          callback(undefined, role);
        }
      });
    }
  });
};

exports._getRoleData = function (roleName, callback) {
  var tableQuery = azure.TableQuery
    .select()
    .from(TABLE_NAME)
    .where('name eq ?', roleName);

  tableClient.queryEntities(tableQuery, function (error, entities) {
    callback(error, _.first(entities));
  });
};

exports._getRolesData = function (callback) {
  var tableQuery = azure.TableQuery
    .select()
    .from(TABLE_NAME);

  tableClient.queryEntities(tableQuery, callback);
};

exports.createOrEditRole = function (roleData, roleImage, callback) {
  var self = this;
  var rowKey = uuid();

  function createBlob() {
    if (roleImage) {
      blobClient.createBlockBlobFromFile(CONTAINER_NAME, rowKey, roleImage.path, insertOrUpdateEntity);
    } else {
      insertOrUpdateEntity();
    }
  }

  function insertOrUpdateEntity(error, role) {
    if (role) {
      roleData.imageUrl = blobClient.getBlobUrl(role.container, role.blob).url();
    }

    if (!_.isUndefined(roleData.RowKey) && !_.isUndefined(roleData.PartitionKey)) {
      tableClient.updateEntity(TABLE_NAME, roleData, callback);
    } else {
      roleData.RowKey = rowKey;
      roleData.PartitionKey = DEFAULT_PARTITION;

      tableClient.insertEntity(TABLE_NAME, roleData, callback);
    }
  };

  if (initialized) {
    createBlob();
  } else {
    initialize(function (error) {
      if (error) {
        callback(error);
      } else {
        initialized = true;
        createBlob();
      }
    });
  }
};