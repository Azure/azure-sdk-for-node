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
var azureCommon = require('azure-common');
var Constants = azureCommon.Constants;
var HeaderConstants = Constants.HeaderConstants;
var OdataHandler = azureCommon.OdataHandler;

exports = module.exports;

exports.serialize = function (entity) {
  var odataHandler = new OdataHandler();
  return odataHandler.serialize(entity);
};

exports.parse = function (response) {
  var result = {};
  if (response.body) {
    var odataHandler = new OdataHandler();
    result = odataHandler.parse(response.body);
  }

  if (response.headers && response.headers[HeaderConstants.ETAG.toLowerCase()]) {
    if (!result[Constants.ATOM_METADATA_MARKER]) {
      result[Constants.ATOM_METADATA_MARKER] = {};
    }

    result[Constants.ATOM_METADATA_MARKER].etag = response.headers[HeaderConstants.ETAG.toLowerCase()];
  }

  return result;
};

exports.getEtag = function (entity, defaultValue) {
  var etag = defaultValue || null;

  if (entity && entity[Constants.ATOM_METADATA_MARKER] && entity[Constants.ATOM_METADATA_MARKER].etag) {
    etag = entity[Constants.ATOM_METADATA_MARKER].etag;
  } else {
    throw new Error('Entity contains no etag');
  }

  return etag;
};