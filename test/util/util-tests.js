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

var util = require('../../lib/util/util');

module.exports = testCase(
{
  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testObjectIsEmpty: function (test) {
    test.equal(util.objectIsEmpty(null), true);
    test.equal(util.objectIsEmpty({}), true);
    test.equal(util.objectIsEmpty({ a: '1' }), false);
    test.equal(util.objectIsEmpty({ a: '1', b: '2' }), false);

    test.done();
  },

  testObjectIsString: function (test) {
    test.equal(util.objectIsString(''), true);
    test.equal(util.objectIsString('hi'), true);
    test.equal(util.objectIsString(null), false);
    test.equal(util.objectIsString({}), false);
    test.equal(util.objectIsString({ a: '1' }), false);

    test.done();
  },

  testStringIsEmpty: function (test) {
    test.equal(util.stringIsEmpty(''), true);
    test.equal(util.stringIsEmpty(null), true);
    test.equal(util.stringIsEmpty(undefined), true);
    test.equal(util.stringIsEmpty('a'), false);
    test.equal(util.stringIsEmpty(' '), false);

    test.done();
  },

  testStringStartsWith: function (test) {
    test.equal(util.stringStartsWith('test', 't'), true);
    test.equal(util.stringStartsWith('test', 'e'), false);
    test.equal(util.stringStartsWith('test', ''), true);
    test.equal(util.stringStartsWith('test', null), true);
    test.equal(util.stringStartsWith('test', 'T'), false);

    test.done();
  },

  testStringEndsWith: function (test) {
    test.equal(util.stringEndsWith('test', 't'), true);
    test.equal(util.stringEndsWith('test', 'e'), false);
    test.equal(util.stringEndsWith('test', ''), true);
    test.equal(util.stringEndsWith('test', null), true);
    test.equal(util.stringEndsWith('test', 'T'), false);

    test.done();
  },

  testStringIsInt: function (test) {
    // positives
    test.equal(util.stringIsInt('1'), true);
    test.equal(util.stringIsInt('1asd'), false);
    test.equal(util.stringIsInt('asd1'), false);
    test.equal(util.stringIsInt('1.23'), false);

    // negatives
    test.equal(util.stringIsInt('-1'), true);
    test.equal(util.stringIsInt('-1asd'), false);
    test.equal(util.stringIsInt('-asd1'), false);
    test.equal(util.stringIsInt('-1.23'), false);

    // nulls
    test.equal(util.stringIsInt(null), false);
    test.equal(util.stringIsInt(), false);

    test.done();
  },

  testStringIsFloat: function (test) {
    // positives
    test.equal(util.stringIsFloat('1'), false);
    test.equal(util.stringIsFloat('1.'), false);
    test.equal(util.stringIsFloat('1.0'), false);
    test.equal(util.stringIsFloat('1.1'), true);
    test.equal(util.stringIsFloat('1.0a'), false);
    test.equal(util.stringIsFloat('1a'), false);

    // negatives
    test.equal(util.stringIsFloat('-1'), false);
    test.equal(util.stringIsFloat('-1.'), false);
    test.equal(util.stringIsFloat('-1.0'), false);
    test.equal(util.stringIsFloat('-1.1'), true);
    test.equal(util.stringIsFloat('-1.0a'), false);
    test.equal(util.stringIsFloat('-1a'), false);

    // nulls
    test.equal(util.stringIsFloat(null), false);
    test.equal(util.stringIsFloat(), false);

    test.done();
  },

  testStringIsNumber: function (test) {
    // int positives
    test.equal(util.stringIsNumber('1'), true);
    test.equal(util.stringIsNumber('1asd'), false);
    test.equal(util.stringIsNumber('asd1'), false);

    // int negatives
    test.equal(util.stringIsNumber('-1'), true);
    test.equal(util.stringIsNumber('-1asd'), false);
    test.equal(util.stringIsNumber('-asd1'), false);

    // float positives
    test.equal(util.stringIsNumber('1.'), true);
    test.equal(util.stringIsNumber('1.0'), true);
    test.equal(util.stringIsNumber('1.1'), true);
    test.equal(util.stringIsNumber('1.0a'), false);
    test.equal(util.stringIsNumber('1a'), false);

    // float negatives
    test.equal(util.stringIsNumber('-1.'), true);
    test.equal(util.stringIsNumber('-1.0'), true);
    test.equal(util.stringIsNumber('-1.1'), true);
    test.equal(util.stringIsNumber('-1.0a'), false);
    test.equal(util.stringIsNumber('-1a'), false);

    // nulls
    test.equal(util.stringIsFloat(null), false);
    test.equal(util.stringIsFloat(), false);

    test.done();
  }
});