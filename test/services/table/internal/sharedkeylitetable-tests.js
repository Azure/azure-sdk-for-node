﻿/**
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
var testutil = require('../../../util/util');

// Lib includes
var azure = testutil.libRequire('azure');
var SharedKeyLiteTable = testutil.libRequire('services/table/internal/sharedkeylitetable');
var WebResource = testutil.libRequire('http/webresource');
var ServiceClientConstants = azure.ServiceClientConstants;
var Constants = azure.Constants;
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var sharedkey;

suite('sharedkeylitetable-tests', function () {
  setup(function (done) {
    sharedkey = new SharedKeyLiteTable(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY, false);

    done();
  });

  teardown(function (done) {
    // clean up
    done();
  });

  test('SignRequest', function (done) {
    var webResource = WebResource.get('Tables');
    webResource.withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml');
    webResource.withHeader(HeaderConstants.STORAGE_VERSION_HEADER, HeaderConstants.TARGET_STORAGE_VERSION);
    webResource.withHeader(HeaderConstants.DATE_HEADER, 'Fri, 23 Sep 2011 01:37:34 GMT');

    sharedkey.signRequest(webResource, function () {
      assert.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKeyLite devstoreaccount1:c8dPVfX0lX++AxpLHNLSU8Afdd7MIoIDNX0xzo1satk=');

      done();
    });
  });

  test('SignRequestServiceProperties', function (done) {
    var webResource = WebResource.get();
    webResource.withQueryOption(QueryStringConstants.RESTYPE, 'service');
    webResource.withQueryOption(QueryStringConstants.COMP, 'properties');
    webResource.withHeader(HeaderConstants.STORAGE_VERSION_HEADER, '2011-08-18');
    webResource.withHeader('User-Agent', 'WA-Storage/1.6.0');
    webResource.withHeader(HeaderConstants.DATE_HEADER, 'Mon, 05 Dec 2011 17:55:02 GMT');

    sharedkey.signRequest(webResource, function() {
      assert.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKeyLite devstoreaccount1:b89upLBiJ54w3Ju3zBv4GzThZGj/M6C3CdTm1BySj28=');

      done();
    });
  });
});