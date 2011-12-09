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

var ISO8061Date = require('../../lib/util/iso8061date');

module.exports = testCase(
{
  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testParse: function (test) {
    var datetime = Date.UTC(2011, 6, 17, 14, 0, 23, 270);
    var datetimeAtom = "2011-07-17T14:00:23.270Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    test.equal(parsed, datetime);
    test.done();
  },

  testFormat: function (test) {
    var datetime = Date.UTC(2011, 6, 17, 14, 0, 23, 270);
    var datetimeAtom = "2011-07-17T14:00:23.0000270Z";
    var strdate = ISO8061Date.format(new Date(datetime));
    test.equal(strdate, datetimeAtom);
    test.done();
  }
});