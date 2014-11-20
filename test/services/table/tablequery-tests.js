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
var util = require('util');

// Test includes
var testutil = require('../../util/util');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');

var TableQuery = storage.TableQuery;
var azureutil = common.util;
var Constants = common.Constants;
var QueryStringConstants = Constants.QueryStringConstants;

suite('tablequery-tests', function () {
  test('Select', function (done) {
    var tableQuery = TableQuery.select('field1', 'field2')
      .from('Table');

    assert.equal('field1,field2', tableQuery.toQueryObject()['$select']);
    done();
  });

  test('QueryWithSingle', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .whereKeys('test', '123');

    assert.equal('Table(PartitionKey=\'test\', RowKey=\'123\')', tableQuery.toPath());
    done();
  });

  test('QueryWithTop', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .top(10);

    assert.equal('Table()', tableQuery.toPath());
    assert.equal(10, tableQuery.toQueryObject()['$top']);
    done();
  });

  test('QueryWithWhere', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'Person');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal('Name eq \'Person\'', tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithWhereDateTime', function (done) {
    var date = new Date(Date.UTC(2001, 1, 3, 4, 5, 6));

    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Date eq ?', date);

    assert.equal('Table()', tableQuery.toPath());
    assert.equal('Date eq datetime\'2001-02-03T04:05:06.000Z\'', tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithWhereSingleQuoteString', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'o\'right');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal('Name eq \'o\'\'right\'', tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithParameterArray', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ? or Name eq ?', 'Person1', 'Person2');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal('Name eq \'Person1\' or Name eq \'Person2\'', tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithAnd', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'Person')
      .and('Visible eq true');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal('Name eq \'Person\' and Visible eq true', tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('ReplaceOperators', function (done) {
    var tableQuery = TableQuery.select();

    assert.equal(tableQuery._replaceOperators(' ==  == '), ' eq  eq ');
    assert.equal(tableQuery._replaceOperators(' >  > '), ' gt  gt ');
    assert.equal(tableQuery._replaceOperators(' <  < '), ' lt  lt ');
    assert.equal(tableQuery._replaceOperators(' >=  >= '), ' ge  ge ');
    assert.equal(tableQuery._replaceOperators(' <=  <= '), ' le  le ');
    assert.equal(tableQuery._replaceOperators(' !=  != '), ' ne  ne ');
    assert.equal(tableQuery._replaceOperators(' &&  && '), ' and  and ');
    assert.equal(tableQuery._replaceOperators(' ||  || '), ' or  or ');
    assert.equal(tableQuery._replaceOperators('! !'), 'not not');

    done();
  });

  test('ComplexPartitionKey', function (done) {
    var complexPartitionKey = 'aHR0cDovL2ZlZWRzLmZlZWRidXJuZXIuY29tL2ppbXdhbmdzYmxvZw==';

    var tableQuery = TableQuery.select()
      .where('PartitionKey == ?', complexPartitionKey);

    var queryObject = tableQuery.toQueryObject();
    assert.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(complexPartitionKey), -1);

    tableQuery = TableQuery.select()
      .where("PartitionKey == '" + complexPartitionKey + "'");

    queryObject = tableQuery.toQueryObject();
    assert.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(complexPartitionKey), -1);

    done();
  });
});