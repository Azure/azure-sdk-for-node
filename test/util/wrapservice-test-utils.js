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

// Test includes
var testutil = require('./util');
var MockServerClient = require('../mockserver/mockserverclient');

// Lib includes
var WrapService = testutil.libRequire('services/serviceBus/wrapservice');

var exports = module.exports;

exports.isMocked = MockServerClient.isMocked();
exports.isRecording = MockServerClient.isRecording();

var mockServerClient;
var currentTest = 0;

exports.setUpTest = function (testObject, testPrefix, callback) {
  var wrapService = new WrapService();
  callback(null, wrapService);
};

exports.tearDownTest = function (testObject, wrapService, testPrefix, callback) {
  callback();
};