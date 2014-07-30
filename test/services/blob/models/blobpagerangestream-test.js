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
var testutil = require('../../../util/util');
var BlobPageRangeStream = testutil.libRequire('services/legacyStorage/lib/blob/internal/blobpagerangestream');

describe('BlobPageRangeStream', function(){
  var rangeStream = null;
  beforeEach(function(done) {
    rangeStream = new BlobPageRangeStream();
    done();
  });

  afterEach(function(done) {
    rangeStream = null;
    done();
  });

  it('should work with invalid page range', function(done) {
    var range = {start : 10, end : 8};
    var rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.length.should.equal(0);
    done();
  });

  it('should work with small page range and dataSize', function(done) {
    var range = {start : 1, end : 8, dataSize: 7};
    var rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.length.should.equal(1);
    rangeList.should.eql([{type : 'Page', size : 8, dataSize : 8, start : 1, end : 8}]);
    range.dataSize = 0;
    rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.length.should.equal(1);
    rangeList.should.eql([{type : 'Page', size : 8, dataSize : 0, start : 1, end : 8}]);
    done();
  });

  it('should work with large page range', function(done) {
    var range = {start : 0, end : 4 * 1024 * 1024 - 1, dataSize: 0};
    var rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.length.should.equal(1);
    rangeList.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1}]);
    range.end = 4 * 1024 * 1024;
    rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 1, start : 4 * 1024 * 1024, dataSize : 0, end : 4 * 1024 * 1024}]);
    range.end = 4 * 1024 * 1024 + 1;
    rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 2, start : 4 * 1024 * 1024, dataSize : 0, end : 4 * 1024 * 1024 + 1}]);
    range.end = 2 * 4 * 1024 * 1024 + 1;
    rangeList = [];
    rangeStream.splitPageRanges(range, rangeList);
    rangeList.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 4 * 1024 * 1024, start : 4 * 1024 * 1024, dataSize : 0, end : 2 * 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 2, dataSize : 0, start : 2 * 4 * 1024 * 1024, end : 2 * 4 * 1024 * 1024 + 1}]);
    done();
  });

  it('should resize range', function(done) {
    var range = [{start : 0, end : 4 * 1024 * 1024 + 1, dataSize: 0}];
    rangeStream.resizeAndSaveRanges(range);
    rangeStream._rangelist.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 2, dataSize : 0, start : 4 * 1024 * 1024, end : 4 * 1024 * 1024 + 1}]);
    done();
  });

  it('should add empty page range', function(done) {
    var range = [{start : 2 * 1024 * 1024, end : 4 * 1024 * 1024 + 1, dataSize: 0}];
    rangeStream._dataOffset = 5;
    rangeStream.resizeAndSaveRanges(range);
    rangeStream._rangelist.should.eql([{type : 'Page', size : 2 * 1024 * 1024 - 5, dataSize : 0, start : 5, end : 2 * 1024 * 1024 - 1},
      {type : 'Page', size : 2 * 1024 * 1024 + 2, dataSize : 0, start : 2 * 1024 * 1024, end : 4 * 1024 * 1024 + 1}]);
    done();
  });

  it('should split large empty page range', function(done) {
    var range = [{start : 6 * 1024 * 1024, end : 6 * 1024 * 1024 + 1, dataSize: 0}];
    rangeStream._dataOffset = 1 * 1024 * 1024;
    rangeStream.resizeAndSaveRanges(range);
    rangeStream._rangelist.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 1 * 1024 * 1024, end : 5 * 1024 * 1024 - 1},
      {type : 'Page', size : 1 * 1024 * 1024, dataSize : 0, start : 5 * 1024 * 1024, end : 6 * 1024 * 1024 - 1},
      {type : 'Page', size : 2, dataSize : 0, start : 6 * 1024 * 1024, end : 6 * 1024 * 1024 + 1}]);
    done();
  });

  it('should split many page ranges', function(done) {
    var range = [{start : 6 * 1024 * 1024, end : 7 * 1024 * 1024 - 1, dataSize: 1024 * 1024}, {start : 13 * 1024 * 1024, end : 18 * 1024 * 1024 + 1, dataSize: 5 * 1024 * 1024 + 2}];
    rangeStream.resizeAndSaveRanges(range);
    rangeStream._rangelist.should.eql([{type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 0, end : 4 * 1024 * 1024 - 1},
      {type : 'Page', size : 2 * 1024 * 1024, dataSize : 0, start : 4 * 1024 * 1024, end : 6 * 1024 * 1024 - 1},
      {type : 'Page', size : 1024 * 1024, dataSize : 1024 * 1024, start : 6 * 1024 * 1024, end : 7 * 1024 * 1024 - 1},
      {type : 'Page', size : 4 * 1024 * 1024, dataSize : 0, start : 7 * 1024 * 1024 , end : 11 * 1024 * 1024 - 1},
      {type : 'Page', size : 2 * 1024 * 1024, dataSize : 0, start : 11 * 1024 * 1024, end : 13 * 1024 * 1024 - 1},
      {type : 'Page', size : 4 * 1024 * 1024, dataSize : 4 * 1024 * 1024, start : 13 * 1024 * 1024, end : 17 * 1024 * 1024 - 1},
      {type : 'Page', size : 1 * 1024 * 1024 + 2, dataSize : 1 * 1024 * 1024 + 2, start : 17 * 1024 * 1024, end : 18 * 1024 * 1024 + 1}]);
    done();
  });
});
