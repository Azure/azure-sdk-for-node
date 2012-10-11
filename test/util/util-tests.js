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
var util = testutil.libRequire('util/util');

suite('util-tests', function() {
  test('should be an empty object', function (done) {
    assert.equal(util.objectIsEmpty(null), true);
    assert.equal(util.objectIsEmpty({}), true);
    assert.equal(util.objectIsEmpty({ a: '1' }), false);
    assert.equal(util.objectIsEmpty({ a: '1', b: '2' }), false);

    done();
  });

  test('should be a string', function (done) {
    assert.equal(util.objectIsString(''), true);
    assert.equal(util.objectIsString('hi'), true);
    assert.equal(util.objectIsString(null), false);
    assert.equal(util.objectIsString({}), false);
    assert.equal(util.objectIsString({ a: '1' }), false);

    done();
  });

  test('should be an empty string', function (done) {
    assert.equal(util.stringIsEmpty(''), true);
    assert.equal(util.stringIsEmpty(null), true);
    assert.equal(util.stringIsEmpty(undefined), true);
    assert.equal(util.stringIsEmpty('a'), false);
    assert.equal(util.stringIsEmpty(' '), false);

    done();
  });

  test('should start with', function (done) {
    assert.equal(util.stringStartsWith('test', 't'), true);
    assert.equal(util.stringStartsWith('test', 'e'), false);
    assert.equal(util.stringStartsWith('test', ''), true);
    assert.equal(util.stringStartsWith('test', null), true);
    assert.equal(util.stringStartsWith('test', 'T'), false);

    done();
  });

  test('should end with', function (done) {
    assert.equal(util.stringEndsWith('test', 't'), true);
    assert.equal(util.stringEndsWith('test', 'e'), false);
    assert.equal(util.stringEndsWith('test', ''), true);
    assert.equal(util.stringEndsWith('test', null), true);
    assert.equal(util.stringEndsWith('test', 'T'), false);

    done();
  });

  test('should be int', function (done) {
    // positives
    assert.equal(util.stringIsInt('1'), true);
    assert.equal(util.stringIsInt('1asd'), false);
    assert.equal(util.stringIsInt('asd1'), false);
    assert.equal(util.stringIsInt('1.23'), false);

    // negatives
    assert.equal(util.stringIsInt('-1'), true);
    assert.equal(util.stringIsInt('-1asd'), false);
    assert.equal(util.stringIsInt('-asd1'), false);
    assert.equal(util.stringIsInt('-1.23'), false);

    // nulls
    assert.equal(util.stringIsInt(null), false);
    assert.equal(util.stringIsInt(), false);

    done();
  });

  test('should be float', function (done) {
    // positives
    assert.equal(util.stringIsFloat('1'), false);
    assert.equal(util.stringIsFloat('1.'), false);
    assert.equal(util.stringIsFloat('1.0'), false);
    assert.equal(util.stringIsFloat('1.1'), true);
    assert.equal(util.stringIsFloat('1.0a'), false);
    assert.equal(util.stringIsFloat('1a'), false);

    // negatives
    assert.equal(util.stringIsFloat('-1'), false);
    assert.equal(util.stringIsFloat('-1.'), false);
    assert.equal(util.stringIsFloat('-1.0'), false);
    assert.equal(util.stringIsFloat('-1.1'), true);
    assert.equal(util.stringIsFloat('-1.0a'), false);
    assert.equal(util.stringIsFloat('-1a'), false);

    // nulls
    assert.equal(util.stringIsFloat(null), false);
    assert.equal(util.stringIsFloat(), false);

    done();
  });

  test('should be a number', function (done) {
    // int positives
    assert.equal(util.stringIsNumber('1'), true);
    assert.equal(util.stringIsNumber('1asd'), false);
    assert.equal(util.stringIsNumber('asd1'), false);

    // int negatives
    assert.equal(util.stringIsNumber('-1'), true);
    assert.equal(util.stringIsNumber('-1asd'), false);
    assert.equal(util.stringIsNumber('-asd1'), false);

    // float positives
    assert.equal(util.stringIsNumber('1.'), true);
    assert.equal(util.stringIsNumber('1.0'), true);
    assert.equal(util.stringIsNumber('1.1'), true);
    assert.equal(util.stringIsNumber('1.0a'), false);
    assert.equal(util.stringIsNumber('1a'), false);

    // float negatives
    assert.equal(util.stringIsNumber('-1.'), true);
    assert.equal(util.stringIsNumber('-1.0'), true);
    assert.equal(util.stringIsNumber('-1.1'), true);
    assert.equal(util.stringIsNumber('-1.0a'), false);
    assert.equal(util.stringIsNumber('-1a'), false);

    // nulls
    assert.equal(util.stringIsFloat(null), false);
    assert.equal(util.stringIsFloat(), false);

    done();
  });

  test('keys counting works', function (done) {
    // int positives
    assert.equal(util.objectKeysLength({ }), 0);
    assert.equal(util.objectKeysLength(null), 0);
    assert.equal(util.objectKeysLength({ prop1: 1 }), 1);
    assert.equal(util.objectKeysLength({ prop1: 1, prop2: 2 }), 2);

    done();
  });

  test('first key works', function (done) {
    // int positives
    assert.equal(util.objectFirstKey({}), null);
    assert.equal(util.objectFirstKey(null), null);
    assert.equal(util.objectFirstKey({ prop1: 1 }), 'prop1');
    assert.equal(util.objectFirstKey({ prop1: 1, prop2: 2 }), 'prop1');

    done();
  });

  test('In array case insensitive', function (done) {
    // int positives
    assert.ok(util.inArrayInsensitive('a', [ 'a', 'b', 'c']));
    assert.ok(util.inArrayInsensitive('A', [ 'a', 'b', 'c']));
    assert.ok(!util.inArrayInsensitive('d', [ 'a', 'b', 'c']));

    done();
  });

  test('Get value case insensitive', function (done) {
    // int positives
    assert.equal(util.tryGetValueInsensitive('B', { 'a': 'a1', 'b': 'b1', 'c': 'c1' }), 'b1');
    assert.equal(util.tryGetValueInsensitive('b', { 'a': 'a1', 'b': 'b1', 'c': 'c1' }), 'b1');
    assert.equal(util.tryGetValueInsensitive('D', { 'a': 'a1', 'b': 'b1', 'c': 'c1' }), undefined);
    assert.equal(util.tryGetValueInsensitive('D', { 'a': 'a1', 'b': 'b1', 'c': 'c1' }, 'something'), 'something');

    done();
  });
});