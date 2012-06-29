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

var assert = require('assert');

// Test includes
var testutil = require('./util');

// Lib includes
var AtomHandler = testutil.libRequire('util/atomhandler');
var ISO8061Date = testutil.libRequire('util/iso8061date');

var fs = require('fs');

suite('atomhandler-tests', function () {
  test('Serialize', function (done) {
    var atomHandler = new AtomHandler('m', 'd');

    var dateTime = ISO8061Date.format(new Date());

    var entity = {
      title: '',
      updated: dateTime,
      author: {
        name: ''
      },
      id: '',
      content: {
        '@': {
          type: 'application/xml'
        },
        'm:properties': {
          'd:PartitionKey': 'part1',
          'd:RowKey': 'row1',
          'd:intValue': 10,
          'd:stringValue': 'my string',
          'd:nullValue': null
        }
      }
    };

    var res = atomHandler.serialize(entity);

    assert.equal(res,
      '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
      '<entry xmlns="http://www.w3.org/2005/Atom" ' +
      'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" ' +
      'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices">' +
      '<title/>' +
      '<updated>' + dateTime + '</updated>' +
      '<author>' +
      '<name/>' +
      '</author>' +
      '<id/>' +
      '<content type="application/xml">' +
      '<m:properties>' +
      '<d:PartitionKey>part1</d:PartitionKey>' +
      '<d:RowKey>row1</d:RowKey>' +
      '<d:intValue>10</d:intValue>' +
      '<d:stringValue>my string</d:stringValue>' +
      '<d:nullValue m:null="true"/>' +
      '</m:properties>' +
      '</content>' +
      '</entry>'
    );

    done();
  });

  test('SerializeDataTypes', function (done) {
    var atomHandler = new AtomHandler('m', 'd');

    var dateTime = ISO8061Date.format(new Date());

    var entity = {
      title: '',
      updated: dateTime,
      author: {
        name: ''
      },
      id: '',
      content: {
        '@': {
          type: 'application/xml'
        },
        'm:properties': {
          'd:PartitionKey': {
            '#': 'part1',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:RowKey': {
            '#': 'row1',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:intValue':  {
            '#': 10,
            '@': { 'm:type': 'Edm.Int32' }
          },
          'd:stringValue':  {
            '#': 'my string',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:nullValue': null
        }
      }
    };

    var res = atomHandler.serialize(entity);

    assert.equal(res,
      '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
      '<entry xmlns="http://www.w3.org/2005/Atom" ' +
      'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" ' +
      'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices">' +
      '<title/>' +
      '<updated>' + dateTime + '</updated>' +
      '<author>' +
      '<name/>' +
      '</author>' +
      '<id/>' +
      '<content type="application/xml">' +
      '<m:properties>' +
      '<d:PartitionKey m:type="Edm.String">part1</d:PartitionKey>' +
      '<d:RowKey m:type="Edm.String">row1</d:RowKey>' +
      '<d:intValue m:type="Edm.Int32">10</d:intValue>' +
      '<d:stringValue m:type="Edm.String">my string</d:stringValue>' +
      '<d:nullValue m:null="true"/>' +
      '</m:properties>' +
      '</content>' +
      '</entry>'
    );

    done();
  });

  test('Parse', function (done) {
    var atomHandler = new AtomHandler('m', 'd');

    var entityXmlJs = {
      title: '',
      updated: '',
      author: {
        name: ''
      },
      id: '',
      content: {
        '@': {
          type: 'application/xml'
        },
        'm:properties': {
          'd:PartitionKey': 'part1',
          'd:RowKey': 'row1',
          'd:intValue': '10',
          'd:stringValue': 'my string',
          'd:nullValue': '',
          'd:nullValue2': null
        }
      }
    };

    var entityResult = atomHandler.parse(entityXmlJs);

    var entity = {
      'PartitionKey': 'part1',
      'RowKey': 'row1',
      'intValue': '10',
      'stringValue': 'my string',
      'nullValue': '',
      'nullValue2': ''
    };

    assert.deepEqual(entityResult, entity);

    done();
  });

  test('ParseDataTypes', function (done) {
    var atomHandler = new AtomHandler('m', 'd');

    var entityXmlJs = {
      title: '',
      updated: '',
      author: {
        name: ''
      },
      id: '',
      content: {
        '@': {
          type: 'application/xml'
        },
        'm:properties': {
          'd:PartitionKey': {
            '#': 'part1',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:RowKey': {
            '#': 'row1',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:intValue': {
            '#': '10',
            '@': { 'm:type': 'Edm.Int32' }
          },
          'd:stringValue': {
            '#': 'my string',
            '@': { 'm:type': 'Edm.String' }
          },
          'd:nullValue': {
            '#': '',
            '@': { 'm:null': 'true' }
          },
          'd:nullValue2': {
            '@': { 'm:null': 'true' }
          }
        }
      }
    };

    var entityResult = atomHandler.parse(entityXmlJs);

    var entity = {
      'PartitionKey': 'part1',
      'RowKey': 'row1',
      'intValue': 10,
      'stringValue': 'my string',
      'nullValue': null,
      'nullValue2': null
    };

    assert.deepEqual(entityResult, entity);

    done();
  });
});
