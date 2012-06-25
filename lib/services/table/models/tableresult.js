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

// Expose 'TableResult'.
exports = module.exports = TableResult;

function TableResult() { }

TableResult.serialize = function (tableName) {
  var atomTable = {
    'title': '',
    'updated': ISO8061Date.format(new Date()),
    'author': {
      name: ''
    },
    'id': '',
    'content': {
      '@': { type: 'application/xml' },
      'm:properties': {
        'd:TableName': tableName
      }
    }
  };

  var atomHandler = new AtomHandler();
  var xml = atomHandler.serialize(atomTable);

  return xml;
};

TableResult.parse = function (tableXml) {
  var atomHandler = new AtomHandler();
  var table = atomHandler.parse(tableXml);
  return table;
};