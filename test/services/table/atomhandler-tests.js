/**
* Copyright 2011 Microsoft Corporation
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

var testCase = require('nodeunit').testCase;

var AtomHandler = require('../../../lib/services/table/atomhandler');

var fs = require('fs');

module.exports = testCase({
  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    // clean up.
    callback();
  },

  testSerialize: function (test) {
    var atomHandler = new AtomHandler('m', 'd');

    var entity = {
      PartitionKey: 'part1',
      RowKey: 'row1',
      intValue: 10,
      stringValue: 'my string'
    };

    var res = atomHandler.serialize(entity);

    test.ok(res.indexOf(
    "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>"
  + "<entry xmlns=\"http://www.w3.org/2005/Atom\" "
  + "xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" "
  + "xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\">"
  + "<title/>"
  + "<updated>") !== -1);

    test.ok(res.indexOf(
    "</updated>"
  + "<author>"
  + "<name/>"
  + "</author>"
  + "<id/>"
  + "<content type=\"application/xml\">"
  + "<m:properties>"
  + "<d:PartitionKey>part1</d:PartitionKey>"
  + "<d:RowKey>row1</d:RowKey>"
  + "<d:intValue>10</d:intValue>"
  + "<d:stringValue>my string</d:stringValue>"
  + "</m:properties>"
  + "</content>"
  + "</entry>") !== -1);

    test.done();
  }
});
