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
var testutil = require('../util/util');

// Lib includes
var HmacSha256Sign = testutil.libRequire('common/lib/services/hmacsha256sign');

var sharedkey;

describe('hmacsha256sign', function () {
  it('should sign correctly', function (done) {
    var hmacSha256Sign = new HmacSha256Sign('Buggy');

    var result = hmacSha256Sign.sign('DELETE\n\n0\n\n\n\n\n\n\n\n\nx-ms-date:Thu, 01 Aug 2013 13:49:05 GMTx-ms-version:2012-02-12\n/ciserversdk/cont1\nrestype:container');
    result.should.equal('VLZVbt3Tqfq2DxbJEoTng5JEemEDq+a9JtPXy9G0f84=');

    done();
  });
});