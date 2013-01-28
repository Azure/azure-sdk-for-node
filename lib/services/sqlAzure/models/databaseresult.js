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
var AtomHandler = require('../../../util/atomhandler');
var ISO8061Date = require('../../../util/iso8061date');
var Constants = require('../../../util/constants');
var ServiceBusConstants = Constants.ServiceBusConstants;
var HeaderConstants = Constants.HeaderConstants;

// Expose 'DatabaseResult'.
exports = module.exports = DatabaseResult;

function DatabaseResult() { }

DatabaseResult.serialize = function (databaseName, collation, edition, maxSizeInGB) {
  var databaseDescription = { };

  if (collation) {
    databaseDescription['d:CollationName'] = collation;
  } else {
    databaseDescription['d:CollationName'] = { '$': { 'm:null': 'true' } };
  }

  databaseDescription['d:CreationDate'] = { '$': { 'm:type': 'Edm.DateTime' }, '_': '0001-01-01T00:00:00' };

  if (edition) {
    databaseDescription['d:Edition'] = edition;
  } else {
    databaseDescription['d:Edition'] = { '$': { 'm:null': 'true' } };
  }

  databaseDescription['d:Id'] = { '$': { 'm:type': 'Edm.Int32' }, '_': '0' };
  databaseDescription['d:IsFederationRoot'] = { '$': { 'm:type': 'Edm.Boolean', 'm:null': 'true' } };
  databaseDescription['d:IsReadonly'] = { '$': { 'm:type': 'Edm.Boolean' }, '_': 'false' };
  databaseDescription['d:IsRecursiveTriggersOn'] = { '$': { 'm:type': 'Edm.Boolean', 'm:null': 'true' } };
  databaseDescription['d:IsSystemObject'] = { '$': { 'm:type': 'Edm.Boolean' }, '_': 'false' };

  if (maxSizeInGB) {
    databaseDescription['d:MaxSizeGB'] = { '$': { 'm:type': 'Edm.Int32' }, '_': maxSizeInGB };
  } else {
    databaseDescription['d:MaxSizeGB'] = { '$': { 'm:type': 'Edm.Int32', 'm:null': 'true' } };
  }

  if (databaseName) {
    databaseDescription['d:Name'] = databaseName;
  }

  databaseDescription['d:SizeMB'] = { '$': { 'm:type': 'Edm.Decimal' }, '_': '0' };
  databaseDescription['d:Status'] = { '$': { 'm:type': 'Edm.Int32' }, '_': '0' };

  var atom = {
    'title': '',
    'updated': ISO8061Date.format(new Date(), false, 7),
    'author': {
      name: ''
    },
    'id': '',
    'content': {
      '$': { type: 'application/xml' },
      'm:properties': databaseDescription
    }
  };

  var atomHandler = new AtomHandler();
  var xml = atomHandler.serialize(atom);

  return xml;
};
