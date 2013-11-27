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

var assert = require('assert');

// Test includes
var testutil = require('./util');

// Lib includes
var OdataHandler = testutil.libRequire('common/lib/util/odatahandler');

var fs = require('fs');

suite('odatahandler-tests', function () {
  test('Serialize', function (done) {
    var odataHandler = new OdataHandler('m', 'd');

    var entity = {
      'PartitionKey': 'part1',
      'RowKey': 'row1',
      'intValue': 10,
      'stringValue': 'my string',
      'nullValue': null
    };

    var res = odataHandler.serialize(entity);
    assert.notEqual(res.indexOf(
      '<content type="application/xml">' +
      '<m:properties>' +
      '<d:PartitionKey m:type="Edm.String">part1</d:PartitionKey>' +
      '<d:RowKey m:type="Edm.String">row1</d:RowKey>' +
      '<d:intValue m:type="Edm.Int32">10</d:intValue>' +
      '<d:stringValue m:type="Edm.String">my string</d:stringValue>' +
      '<d:nullValue m:null="true"/>' +
      '</m:properties>' +
      '</content>'), -1);

    done();
  });

  test('SerializeDataTypes', function (done) {
    var odataHandler = new OdataHandler('m', 'd');

    var entity = {
      'PartitionKey': {
        '_': 'part1',
        '$': { 'type': 'Edm.String' }
      },
      'RowKey': {
        '_': 'row1',
        '$': { 'type': 'Edm.String' }
      },
      'intValue':  {
        '_': 10,
        '$': { 'type': 'Edm.Int32' }
      },
      'stringValue':  {
        '_': 'my string',
        '$': { 'type': 'Edm.String' }
      },
      'nullValue': null
    };

    var res = odataHandler.serialize(entity);

    assert.notEqual(res.indexOf(
      '<content type="application/xml">' +
      '<m:properties>' +
      '<d:PartitionKey m:type="Edm.String">part1</d:PartitionKey>' +
      '<d:RowKey m:type="Edm.String">row1</d:RowKey>' +
      '<d:intValue m:type="Edm.Int32">10</d:intValue>' +
      '<d:stringValue m:type="Edm.String">my string</d:stringValue>' +
      '<d:nullValue m:null="true"/>' +
      '</m:properties>' +
      '</content>'), -1);

    done();
  });

  test('Parse', function (done) {
    var odataHandler = new OdataHandler('m', 'd');

    var entityXmlJs = {
      entry: {
        title: '',
        updated: '',
        author: {
          name: ''
        },
        id: '',
        content: {
          '$': {
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
      }
    };

    var entityResult = odataHandler.parse(entityXmlJs);

    var entity = {
      '_': {
        'ContentRootElement': 'm:properties',
        'title': '',
        'updated': '',
        'author': {
          "name": ''
        },
        'id': ''
      },
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
    var odataHandler = new OdataHandler('m', 'd');

    var entityXmlJs = {
      entry: {
        title: '',
        updated: '',
        author: {
          name: ''
        },
        id: '',
        content: {
          '$': {
            type: 'application/xml'
          },
          'm:properties': {
            'd:PartitionKey': {
              '_': 'part1',
              '$': { 'm:type': 'Edm.String' }
            },
            'd:RowKey': {
              '_': 'row1',
              '$': { 'm:type': 'Edm.String' }
            },
            'd:intValue': {
              '_': '10',
              '$': { 'm:type': 'Edm.Int32' }
            },
            'd:stringValue': {
              '_': 'my string',
              '$': { 'm:type': 'Edm.String' }
            },
            'd:nullValue': {
              '_': '',
              '$': { 'm:null': 'true' }
            },
            'd:nullValue2': {
              '$': { 'm:null': 'true' }
            }
          }
        }
      }
    };

    var entityResult = odataHandler.parse(entityXmlJs);

    var entity = {
      '_': {
        'ContentRootElement': 'm:properties',
        'title': '',
        'updated': '',
        'author': {
          "name": ''
        },
        'id': ''
      },
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