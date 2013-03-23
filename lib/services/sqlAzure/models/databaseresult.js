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
var OdataHandler = require('../../../util/odatahandler');

exports = module.exports;

exports.serialize = function (databaseName, collation, edition, maxSizeInGB) {
  var databaseDescription = { };

  databaseDescription['CollationName'] = { '$': { 'type': 'Edm.String' }, '_': collation };
  databaseDescription['CreationDate'] = { '$': { 'type': 'Edm.DateTime' }, '_': '0001-01-01T00:00:00' };
  databaseDescription['Edition'] = { '$': { 'type': 'Edm.String' }, '_': edition };
  databaseDescription['Id'] = { '$': { 'type': 'Edm.Int32' }, '_': 0 };
  databaseDescription['IsFederationRoot'] = { '$': { 'type': 'Edm.Boolean' }, '_': null };
  databaseDescription['IsReadonly'] = { '$': { 'type': 'Edm.Boolean' }, '_': false };
  databaseDescription['IsRecursiveTriggersOn'] = { '$': { 'type': 'Edm.Boolean' }, '_': null };
  databaseDescription['IsSystemObject'] = { '$': { 'type': 'Edm.Boolean' }, '_': false };
  databaseDescription['MaxSizeGB'] = { '$': { 'type': 'Edm.Int32' }, '_': maxSizeInGB };
  databaseDescription['Name'] = { '$': { 'type': 'Edm.String' }, '_': databaseName };
  databaseDescription['SizeMB'] = { '$': { 'type': 'Edm.Decimal' }, '_': 0 };
  databaseDescription['Status'] = { '$': { 'type': 'Edm.Int32' }, '_': 0 };

  var odataHandler = new OdataHandler();
  return odataHandler.serialize(databaseDescription);
};