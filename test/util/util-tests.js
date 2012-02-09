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

  testIsInt: function (test) {
    test.equal(util.isInt('1'), true);
    test.equal(util.isInt(null), false);
    test.equal(util.isInt(), false);
    test.equal(util.isInt('1.23'), false);

    test.done();
  }
});