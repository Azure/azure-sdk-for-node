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
var util = require('util');

// Test includes
var testutil = require('../../util/util');

// Lib includes
var TableQuery = testutil.libRequire('services/table/tablequery');
var azureutil = testutil.libRequire('util/util');
var Constants = testutil.libRequire('util/constants');
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
    assert.equal(azureutil.encodeUri('Name eq \'Person\''), tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithParameterArray', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ? or Name eq ?', 'Person1', 'Person2');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal(azureutil.encodeUri('Name eq \'Person1\' or Name eq \'Person2\''), tableQuery.toQueryObject()['$filter']);
    done();
  });

  test('QueryWithAnd', function (done) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'Person')
      .and('Visible eq true');

    assert.equal('Table()', tableQuery.toPath());
    assert.equal(azureutil.encodeUri('Name eq \'Person\' and Visible eq true'), tableQuery.toQueryObject()['$filter']);
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
    var encodedComplexPartitionKey = 'aHR0cDovL2ZlZWRzLmZlZWRidXJuZXIuY29tL2ppbXdhbmdzYmxvZw%3D%3D';

    var tableQuery = TableQuery.select()
      .where('PartitionKey == ?', complexPartitionKey);

    var queryObject = tableQuery.toQueryObject();
    assert.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(encodedComplexPartitionKey), -1);

    tableQuery = TableQuery.select()
      .where("PartitionKey == '" + complexPartitionKey + "'");

    queryObject = tableQuery.toQueryObject();
    assert.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(encodedComplexPartitionKey), -1);

    done();
  });
});