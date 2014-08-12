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

var https = require('https');
var http = require('http');
var OriginalClientRequest = http.ClientRequest; // HTTP ClientRequest before mocking by Nock
var OriginalHttpsRequest = https.request;
var OriginalHttpRequest = http.request;
var nock = require('nock');
var NockClientRequest = http.ClientRequest; // HTTP ClientRequest mocked by Nock
var NockHttpsRequest = https.request;
var NockHttpRequest = http.request;

// The nock module should only be required once in all of the test infrastructure.
// If the nock require/OriginalClientRequest/NockClientRequest dance is done in multiple
// files, the nocked and unNocked http objects may get out of sync and break other tests.
// To use nock in your tests, use the following pattern:
//    - In all suite setups, call nockHttp(). This will enable nock on the http object.
//    - In all suite teardowns, call unNockHttp(). This will disable nock on the http object allowing other tests to run using the original http object.
//    - make sure to 'require('nock') only once across all tests and share the instance by using nock-helper.nock

exports.nock = nock;

exports.nockHttp = function() {
  http.ClientRequest = NockClientRequest;
  http.request = NockHttpRequest;
  https.request = NockHttpsRequest;
};

exports.unNockHttp = function() {
  http.ClientRequest = OriginalClientRequest;
  http.request = OriginalHttpRequest;
  https.request = OriginalHttpsRequest;
};

exports.unNockHttp(); // Revert the nock change so that tests by default run with the original, unmocked http request objects