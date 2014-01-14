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

var should = require('should');

// Test includes
var testutil = require('./util');

// Lib includes
var edmType = testutil.libRequire('common/lib/util/edmtype');

describe('Edmtype', function () {
  describe('serializeQueryValue', function () {
    it('correctly serializes int32 query values', function (done) {
      var value = 2;
      var serializedValue = edmType.serializeQueryValue(value);
      serializedValue.should.equal('2');

      done();
    });

    it('correctly serializes datetime query values', function (done) {
      var value = new Date(Date.UTC(2001, 1, 3, 4, 5, 6));
      var serializedValue = edmType.serializeQueryValue(value);
      serializedValue.should.equal("datetime'2001-02-03T04:05:06.000Z'");

      done();
    });

    it('correctly serializes float query values', function (done) {
      var value = 1.2;
      var serializedValue = edmType.serializeQueryValue(value);
      serializedValue.should.equal('1.2');

      done();
    });

    it('correctly serializes string query values', function (done) {
      var value = 'string';
      var serializedValue = edmType.serializeQueryValue(value);
      serializedValue.should.equal("'string'");

      done();
    });
  });
});