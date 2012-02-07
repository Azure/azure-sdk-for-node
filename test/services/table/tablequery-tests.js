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

var TableQuery = require('../../../lib/services/table/tablequery');
var azureutil = require('../../../lib/util/util');
var Constants = require('../../../lib/util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var util = require('util');

module.exports = testCase(
{
  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    // clean up.
    callback();
  },

  testSelect: function (test) {
    var tableQuery = TableQuery.select('field1', 'field2')
      .from('Table');

    test.equal('field1,field2', tableQuery.toQueryObject()['$select']);
    test.done();
  },

  testQueryWithSingle: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .whereKeys('test', '123');

    test.equal('Table(PartitionKey=\'test\', RowKey=\'123\')', tableQuery.toPath());
    test.done();
  },

  testQueryWithTop: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .top(10);

    test.equal('Table()', tableQuery.toPath());
    test.equal(10, tableQuery.toQueryObject()['$top']);
    test.done();
  },

  testQueryWithOrderBy: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .orderBy('Name', 'asc');

    test.equal('Table()', tableQuery.toPath());
    test.equal(azureutil.encodeUri('Name asc'), tableQuery.toQueryObject()['$orderby']);
    test.done();
  },

  testOrderByMultipleQuery: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .orderBy('Name', 'asc')
      .orderBy('Visible', 'desc');

    test.equal('Table()', tableQuery.toPath());
    test.equal(azureutil.encodeUri('Name asc') + ',' + azureutil.encodeUri('Visible desc'), tableQuery.toQueryObject()['$orderby']);
    test.done();
  },

  testQueryWithWhere: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'Person');

    test.equal('Table()', tableQuery.toPath());
    test.equal(azureutil.encodeUri('Name eq \'Person\''), tableQuery.toQueryObject()['$filter']);
    test.done();
  },

  testQueryWithParameterArray: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ? or Name eq ?', 'Person1', 'Person2');

    test.equal('Table()', tableQuery.toPath());
    test.equal(azureutil.encodeUri('Name eq \'Person1\' or Name eq \'Person2\''), tableQuery.toQueryObject()['$filter']);
    test.done();
  },

  testQueryWithAnd: function (test) {
    var tableQuery = TableQuery.select()
      .from('Table')
      .where('Name eq ?', 'Person')
      .and('Visible eq true');

    test.equal('Table()', tableQuery.toPath());
    test.equal(azureutil.encodeUri('Name eq \'Person\' and Visible eq true'), tableQuery.toQueryObject()['$filter']);
    test.done();
  },

  testReplaceOperators: function (test) {
    var tableQuery = TableQuery.select();

    test.equal(tableQuery._replaceOperators(' ==  == '), ' eq  eq ');
    test.equal(tableQuery._replaceOperators(' >  > '), ' gt  gt ');
    test.equal(tableQuery._replaceOperators(' <  < '), ' lt  lt ');
    test.equal(tableQuery._replaceOperators(' >=  >= '), ' ge  ge ');
    test.equal(tableQuery._replaceOperators(' <=  <= '), ' le  le ');
    test.equal(tableQuery._replaceOperators(' !=  != '), ' ne  ne ');
    test.equal(tableQuery._replaceOperators(' &&  && '), ' and  and ');
    test.equal(tableQuery._replaceOperators(' ||  || '), ' or  or ');
    test.equal(tableQuery._replaceOperators('! !'), 'not not');

    test.done();
  },

  testComplexPartitionKey: function (test) {
    var complexPartitionKey = 'aHR0cDovL2ZlZWRzLmZlZWRidXJuZXIuY29tL2ppbXdhbmdzYmxvZw==';
    var encodedComplexPartitionKey = 'aHR0cDovL2ZlZWRzLmZlZWRidXJuZXIuY29tL2ppbXdhbmdzYmxvZw%3D%3D';

    var tableQuery = TableQuery.select()
      .where('PartitionKey == ?', complexPartitionKey);

    var queryObject = tableQuery.toQueryObject();
    test.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(encodedComplexPartitionKey), -1);

    tableQuery = TableQuery.select()
      .where("PartitionKey == '" + complexPartitionKey + "'");

    queryObject = tableQuery.toQueryObject();
    test.notEqual(queryObject[QueryStringConstants.FILTER].indexOf(encodedComplexPartitionKey), -1);

    test.done();
  }
});