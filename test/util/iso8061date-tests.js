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
var ISO8061Date = testutil.libRequire('util/iso8061date');

suite('iso8061date-tests', function () {
  test('Parse', function (done) {
    var datetime = new Date(Date.UTC(2011, 6, 17, 14, 0, 23, 270));
    var datetimeAtom = "2011-07-17T14:00:23.270Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    assert.deepEqual(parsed, datetime);
    done();
  });

  test('ParseLongTimestamp', function (done) {
    var datetime = new Date(Date.UTC(2011, 6, 17, 14, 0, 23, 270));
    var datetimeAtom = "2011-07-17T14:00:23.2701234Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    assert.deepEqual(parsed, datetime);
    done();
  });

  test('ParseLongTimestampWithRounding', function (done) {
    var datetime = new Date(Date.UTC(2011, 6, 17, 14, 0, 23, 270));
    var datetimeAtom = "2011-07-17T14:00:23.26993Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    assert.deepEqual(parsed, datetime);
    done();
  });

  test('ParseShortMillis', function (done) {
    var datetime = new Date(Date.UTC(2011, 6, 17, 14, 0, 23, 200));
    var datetimeAtom = "2011-07-17T14:00:23.2Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    assert.deepEqual(parsed, datetime);
    done();
  });

  test('ParsePaddedShortMillis', function (done) {
    var datetime = new Date(Date.UTC(2011, 6, 17, 14, 0, 23, 3));
    var datetimeAtom = "2011-07-17T14:00:23.003Z";
    var parsed = ISO8061Date.parse(datetimeAtom);
    assert.deepEqual(parsed, datetime);
    done();
  });

  test('Format', function (done) {
    var datetime = Date.UTC(2011, 6, 17, 14, 0, 23, 270);
    var datetimeAtom = "2011-07-17T14:00:23.270Z";
    var strdate = ISO8061Date.format(new Date(datetime));
    assert.equal(strdate, datetimeAtom);
    done();
  });
});
