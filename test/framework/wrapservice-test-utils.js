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

var util = require('util');

var MockedTestUtils = require('./mocked-test-utils');

function WrapServiceUtils(service, testPrefix) {
  WrapServiceUtils.super_.call(this, service, testPrefix);
}

util.inherits(WrapServiceUtils, MockedTestUtils);

WrapServiceUtils.prototype.teardownTest = function (callback) {
  this.baseTeardownTest(callback);
};

exports.createWrapServiceTestUtils = function (service, testPrefix) {
  return new WrapServiceUtils(service, testPrefix);
};