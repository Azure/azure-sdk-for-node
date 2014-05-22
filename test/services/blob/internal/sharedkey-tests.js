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

var assert = require('assert');

// Test includes
var testutil = require('../../../util/util');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');
var WebResource = common.WebResource;
var SharedKey = storage.SharedKey;
var ServiceClientConstants = common.ServiceClientConstants;
var Constants = common.Constants;
var QueryStringConstants = Constants.QueryStringConstants;
var HeaderConstants = Constants.HeaderConstants;

var sharedkey;

suite('sharedkey-tests', function () {
  setup(function (done) {
    sharedkey = new SharedKey(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY, false);

    done();
  });

  teardown(function (done) {
    // clean up
    done();
  });

  test('SignRequest', function (done) {
    var webResource = WebResource.get('container');
    webResource.withQueryOption(QueryStringConstants.RESTYPE, 'container');
    webResource.withHeader(HeaderConstants.CONTENT_TYPE, '');
    webResource.withHeader(HeaderConstants.STORAGE_VERSION_HEADER, HeaderConstants.TARGET_STORAGE_VERSION);
    webResource.withHeader(HeaderConstants.DATE_HEADER, 'Fri, 23 Sep 2011 01:37:34 GMT');

    sharedkey.signRequest(webResource, function () {
      assert.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKey devstoreaccount1:Y5R86+6XE5MH602SIyjeTwlJuQjbawv20PT4kb/F/04=');

      done();
    });
  });
});